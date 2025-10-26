-- =====================================================
-- Migration: 004_create_lancamentos_recorrentes.sql
-- Description: Criação da tabela de lançamentos recorrentes
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- Tabela de lançamentos recorrentes (templates para geração automática)
CREATE TABLE IF NOT EXISTS public.lancamentos_recorrentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo public.tipo_lancamento NOT NULL,
    categoria TEXT NOT NULL CHECK (char_length(categoria) >= 2),
    descricao TEXT NOT NULL CHECK (char_length(descricao) >= 3 AND char_length(descricao) <= 200),
    valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0.01),
    data_inicio DATE NOT NULL,
    parcelas_total INTEGER NOT NULL CHECK (parcelas_total >= 1 AND parcelas_total <= 360),
    parcelas_geradas INTEGER NOT NULL DEFAULT 0 CHECK (parcelas_geradas >= 0),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraint: parcelas_geradas não pode ser maior que parcelas_total
    CONSTRAINT check_parcelas_geradas_menor_igual_total
        CHECK (parcelas_geradas <= parcelas_total)
);

-- Comentários da tabela
COMMENT ON TABLE public.lancamentos_recorrentes IS 'Templates de lançamentos recorrentes para geração automática';
COMMENT ON COLUMN public.lancamentos_recorrentes.id IS 'Identificador único do lançamento recorrente';
COMMENT ON COLUMN public.lancamentos_recorrentes.user_id IS 'ID do usuário dono do lançamento recorrente';
COMMENT ON COLUMN public.lancamentos_recorrentes.tipo IS 'Tipo do lançamento (receita ou despesa)';
COMMENT ON COLUMN public.lancamentos_recorrentes.categoria IS 'Categoria do lançamento';
COMMENT ON COLUMN public.lancamentos_recorrentes.descricao IS 'Descrição do lançamento (3-200 caracteres)';
COMMENT ON COLUMN public.lancamentos_recorrentes.valor IS 'Valor de cada parcela em reais';
COMMENT ON COLUMN public.lancamentos_recorrentes.data_inicio IS 'Data de início da recorrência';
COMMENT ON COLUMN public.lancamentos_recorrentes.parcelas_total IS 'Total de parcelas a serem geradas (1-360)';
COMMENT ON COLUMN public.lancamentos_recorrentes.parcelas_geradas IS 'Quantidade de parcelas já geradas';
COMMENT ON COLUMN public.lancamentos_recorrentes.ativo IS 'Indica se o lançamento recorrente está ativo';
COMMENT ON COLUMN public.lancamentos_recorrentes.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.lancamentos_recorrentes.updated_at IS 'Data da última atualização';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrentes_user_ativo
    ON public.lancamentos_recorrentes(user_id, ativo)
    WHERE ativo = true;

CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrentes_data_inicio
    ON public.lancamentos_recorrentes(data_inicio);

CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrentes_pendentes
    ON public.lancamentos_recorrentes(user_id, parcelas_geradas, parcelas_total)
    WHERE ativo = true AND parcelas_geradas < parcelas_total;

-- =====================================================
-- TRIGGER: Auto-atualização do campo updated_at
-- =====================================================
CREATE TRIGGER set_lancamentos_recorrentes_updated_at
    BEFORE UPDATE ON public.lancamentos_recorrentes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TRIGGER: Auto-desativar quando todas parcelas geradas
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_lancamento_recorrente_completo()
RETURNS TRIGGER AS $$
BEGIN
    -- Se todas as parcelas foram geradas, desativar automaticamente
    IF NEW.parcelas_geradas >= NEW.parcelas_total AND NEW.ativo = true THEN
        NEW.ativo = false;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_lancamento_recorrente_completo
    BEFORE INSERT OR UPDATE ON public.lancamentos_recorrentes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_lancamento_recorrente_completo();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativa RLS na tabela
ALTER TABLE public.lancamentos_recorrentes ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios lançamentos recorrentes
CREATE POLICY "Usuários podem ver seus próprios lançamentos recorrentes"
    ON public.lancamentos_recorrentes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Usuários podem inserir lançamentos recorrentes para si mesmos
CREATE POLICY "Usuários podem criar seus próprios lançamentos recorrentes"
    ON public.lancamentos_recorrentes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem atualizar apenas seus próprios lançamentos recorrentes
CREATE POLICY "Usuários podem atualizar seus próprios lançamentos recorrentes"
    ON public.lancamentos_recorrentes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem deletar apenas seus próprios lançamentos recorrentes
CREATE POLICY "Usuários podem deletar seus próprios lançamentos recorrentes"
    ON public.lancamentos_recorrentes
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos_recorrentes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

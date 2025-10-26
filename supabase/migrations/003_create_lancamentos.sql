-- =====================================================
-- Migration: 003_create_lancamentos.sql
-- Description: Criação da tabela de lançamentos financeiros
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- Enum para tipo de lançamento
CREATE TYPE public.tipo_lancamento AS ENUM ('receita', 'despesa');

COMMENT ON TYPE public.tipo_lancamento IS 'Tipo de lançamento financeiro (receita ou despesa)';

-- Tabela de lançamentos financeiros
CREATE TABLE IF NOT EXISTS public.lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo public.tipo_lancamento NOT NULL,
    categoria TEXT NOT NULL CHECK (char_length(categoria) >= 2),
    valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0.01),
    data DATE NOT NULL,
    descricao TEXT NOT NULL CHECK (char_length(descricao) >= 3 AND char_length(descricao) <= 200),
    recorrente BOOLEAN NOT NULL DEFAULT false,
    parcelas INTEGER CHECK (parcelas IS NULL OR (parcelas >= 1 AND parcelas <= 360)),
    lancamento_pai_id UUID REFERENCES public.lancamentos_recorrentes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.lancamentos IS 'Lançamentos financeiros (receitas e despesas) dos usuários';
COMMENT ON COLUMN public.lancamentos.id IS 'Identificador único do lançamento';
COMMENT ON COLUMN public.lancamentos.user_id IS 'ID do usuário dono do lançamento';
COMMENT ON COLUMN public.lancamentos.tipo IS 'Tipo do lançamento (receita ou despesa)';
COMMENT ON COLUMN public.lancamentos.categoria IS 'Categoria do lançamento';
COMMENT ON COLUMN public.lancamentos.valor IS 'Valor do lançamento em reais (mínimo R$ 0,01)';
COMMENT ON COLUMN public.lancamentos.data IS 'Data do lançamento';
COMMENT ON COLUMN public.lancamentos.descricao IS 'Descrição do lançamento (3-200 caracteres)';
COMMENT ON COLUMN public.lancamentos.recorrente IS 'Indica se o lançamento é recorrente';
COMMENT ON COLUMN public.lancamentos.parcelas IS 'Número de parcelas (1-360, opcional)';
COMMENT ON COLUMN public.lancamentos.lancamento_pai_id IS 'ID do lançamento recorrente pai (se aplicável)';
COMMENT ON COLUMN public.lancamentos.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.lancamentos.updated_at IS 'Data da última atualização';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_data
    ON public.lancamentos(user_id, data DESC);

CREATE INDEX IF NOT EXISTS idx_lancamentos_user_tipo_categoria
    ON public.lancamentos(user_id, tipo, categoria);

CREATE INDEX IF NOT EXISTS idx_lancamentos_pai
    ON public.lancamentos(lancamento_pai_id)
    WHERE lancamento_pai_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lancamentos_data
    ON public.lancamentos(data DESC);

CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo
    ON public.lancamentos(tipo);

CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrente
    ON public.lancamentos(recorrente)
    WHERE recorrente = true;

-- =====================================================
-- TRIGGER: Auto-atualização do campo updated_at
-- =====================================================
CREATE TRIGGER set_lancamentos_updated_at
    BEFORE UPDATE ON public.lancamentos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativa RLS na tabela
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios lançamentos
CREATE POLICY "Usuários podem ver seus próprios lançamentos"
    ON public.lancamentos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Usuários podem inserir lançamentos para si mesmos
CREATE POLICY "Usuários podem criar seus próprios lançamentos"
    ON public.lancamentos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem atualizar apenas seus próprios lançamentos
CREATE POLICY "Usuários podem atualizar seus próprios lançamentos"
    ON public.lancamentos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem deletar apenas seus próprios lançamentos
CREATE POLICY "Usuários podem deletar seus próprios lançamentos"
    ON public.lancamentos
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

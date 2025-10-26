-- =====================================================
-- Migration: 002_create_objetivos.sql
-- Description: Criação da tabela de objetivos financeiros
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- Enum para status dos objetivos
CREATE TYPE public.status_objetivo AS ENUM ('ativo', 'concluido', 'cancelado');

COMMENT ON TYPE public.status_objetivo IS 'Status possíveis para um objetivo financeiro';

-- Tabela de objetivos financeiros
CREATE TABLE IF NOT EXISTS public.objetivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL CHECK (char_length(nome) >= 3 AND char_length(nome) <= 100),
    valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0),
    valor_atual DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (valor_atual >= 0),
    prioridade INTEGER NOT NULL CHECK (prioridade >= 1 AND prioridade <= 10),
    prazo DATE NOT NULL CHECK (prazo >= CURRENT_DATE),
    categoria TEXT NOT NULL CHECK (char_length(categoria) >= 2),
    icone TEXT,
    status public.status_objetivo NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraint: valor_atual não pode ser maior que valor
    CONSTRAINT check_valor_atual_menor_igual_valor CHECK (valor_atual <= valor)
);

-- Comentários da tabela
COMMENT ON TABLE public.objetivos IS 'Objetivos financeiros dos usuários';
COMMENT ON COLUMN public.objetivos.id IS 'Identificador único do objetivo';
COMMENT ON COLUMN public.objetivos.user_id IS 'ID do usuário dono do objetivo';
COMMENT ON COLUMN public.objetivos.nome IS 'Nome do objetivo (3-100 caracteres)';
COMMENT ON COLUMN public.objetivos.valor IS 'Valor total do objetivo em reais';
COMMENT ON COLUMN public.objetivos.valor_atual IS 'Valor já acumulado para o objetivo';
COMMENT ON COLUMN public.objetivos.prioridade IS 'Prioridade do objetivo (1-10, sendo 10 máxima)';
COMMENT ON COLUMN public.objetivos.prazo IS 'Data limite para alcançar o objetivo';
COMMENT ON COLUMN public.objetivos.categoria IS 'Categoria do objetivo (ex: casa, carro, viagem)';
COMMENT ON COLUMN public.objetivos.icone IS 'Identificador do ícone para UI (opcional)';
COMMENT ON COLUMN public.objetivos.status IS 'Status atual do objetivo';
COMMENT ON COLUMN public.objetivos.created_at IS 'Data de criação do objetivo';
COMMENT ON COLUMN public.objetivos.updated_at IS 'Data da última atualização';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_objetivos_user_status
    ON public.objetivos(user_id, status);

CREATE INDEX IF NOT EXISTS idx_objetivos_user_prazo
    ON public.objetivos(user_id, prazo);

CREATE INDEX IF NOT EXISTS idx_objetivos_user_prioridade
    ON public.objetivos(user_id, prioridade DESC);

CREATE INDEX IF NOT EXISTS idx_objetivos_created_at
    ON public.objetivos(created_at DESC);

-- =====================================================
-- TRIGGER: Auto-atualização do campo updated_at
-- =====================================================
CREATE TRIGGER set_objetivos_updated_at
    BEFORE UPDATE ON public.objetivos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TRIGGER: Auto-completar objetivo quando atingir valor
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_objetivo_completado()
RETURNS TRIGGER AS $$
BEGIN
    -- Se valor_atual >= valor e ainda está ativo, marcar como concluído
    IF NEW.valor_atual >= NEW.valor AND NEW.status = 'ativo' THEN
        NEW.status = 'concluido';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_objetivo_completado
    BEFORE INSERT OR UPDATE ON public.objetivos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_objetivo_completado();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativa RLS na tabela
ALTER TABLE public.objetivos ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios objetivos
CREATE POLICY "Usuários podem ver seus próprios objetivos"
    ON public.objetivos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Usuários podem inserir objetivos para si mesmos
CREATE POLICY "Usuários podem criar seus próprios objetivos"
    ON public.objetivos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem atualizar apenas seus próprios objetivos
CREATE POLICY "Usuários podem atualizar seus próprios objetivos"
    ON public.objetivos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem deletar apenas seus próprios objetivos
CREATE POLICY "Usuários podem deletar seus próprios objetivos"
    ON public.objetivos
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.objetivos TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

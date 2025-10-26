-- =====================================================
-- Migration: 005_create_ativos.sql
-- Description: Criação da tabela de ativos patrimoniais
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- Enum para tipo de ativo
CREATE TYPE public.tipo_ativo AS ENUM ('imovel', 'veiculo', 'investimento');

COMMENT ON TYPE public.tipo_ativo IS 'Tipo de ativo patrimonial';

-- Enum para vendabilidade do ativo
CREATE TYPE public.vendabilidade_ativo AS ENUM ('vendavel', 'condicional', 'nao_vendavel');

COMMENT ON TYPE public.vendabilidade_ativo IS 'Indica a facilidade de venda do ativo';

-- Tabela de ativos patrimoniais
CREATE TABLE IF NOT EXISTS public.ativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo public.tipo_ativo NOT NULL,
    nome TEXT NOT NULL CHECK (char_length(nome) >= 3 AND char_length(nome) <= 100),
    valor_estimado DECIMAL(15, 2) NOT NULL CHECK (valor_estimado > 0),
    vendabilidade public.vendabilidade_ativo NOT NULL,
    descricao TEXT CHECK (descricao IS NULL OR char_length(descricao) <= 500),
    metadados JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.ativos IS 'Ativos patrimoniais dos usuários (imóveis, veículos, investimentos)';
COMMENT ON COLUMN public.ativos.id IS 'Identificador único do ativo';
COMMENT ON COLUMN public.ativos.user_id IS 'ID do usuário dono do ativo';
COMMENT ON COLUMN public.ativos.tipo IS 'Tipo do ativo (imóvel, veículo ou investimento)';
COMMENT ON COLUMN public.ativos.nome IS 'Nome/descrição do ativo (3-100 caracteres)';
COMMENT ON COLUMN public.ativos.valor_estimado IS 'Valor estimado do ativo em reais';
COMMENT ON COLUMN public.ativos.vendabilidade IS 'Facilidade de venda do ativo';
COMMENT ON COLUMN public.ativos.descricao IS 'Descrição detalhada do ativo (máx 500 caracteres)';
COMMENT ON COLUMN public.ativos.metadados IS 'Dados específicos por tipo de ativo em formato JSON';
COMMENT ON COLUMN public.ativos.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.ativos.updated_at IS 'Data da última atualização';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ativos_user_tipo
    ON public.ativos(user_id, tipo);

CREATE INDEX IF NOT EXISTS idx_ativos_vendabilidade
    ON public.ativos(vendabilidade);

CREATE INDEX IF NOT EXISTS idx_ativos_user_valor
    ON public.ativos(user_id, valor_estimado DESC);

CREATE INDEX IF NOT EXISTS idx_ativos_metadados
    ON public.ativos USING GIN (metadados);

-- =====================================================
-- FUNÇÃO: Validar metadados por tipo de ativo
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_ativos_metadados()
RETURNS TRIGGER AS $$
DECLARE
    placa_regex TEXT := '^[A-Z]{3}[0-9][A-Z][0-9]{2}$';
BEGIN
    -- Validação para IMÓVEL
    IF NEW.tipo = 'imovel' THEN
        -- Campos obrigatórios: endereco, metragem, ano, tipoImovel
        IF NOT (
            NEW.metadados ? 'endereco' AND
            NEW.metadados ? 'metragem' AND
            NEW.metadados ? 'ano' AND
            NEW.metadados ? 'tipoImovel'
        ) THEN
            RAISE EXCEPTION 'Imóvel deve ter: endereco, metragem, ano, tipoImovel';
        END IF;

        -- Validar tipoImovel
        IF NEW.metadados->>'tipoImovel' NOT IN ('casa', 'apartamento', 'terreno', 'comercial', 'outro') THEN
            RAISE EXCEPTION 'tipoImovel inválido para imóvel';
        END IF;

        -- Validar metragem é número positivo
        IF (NEW.metadados->>'metragem')::numeric <= 0 THEN
            RAISE EXCEPTION 'metragem deve ser maior que zero';
        END IF;
    END IF;

    -- Validação para VEÍCULO
    IF NEW.tipo = 'veiculo' THEN
        -- Campos obrigatórios: modelo, placa, ano, tipoVeiculo
        IF NOT (
            NEW.metadados ? 'modelo' AND
            NEW.metadados ? 'placa' AND
            NEW.metadados ? 'ano' AND
            NEW.metadados ? 'tipoVeiculo'
        ) THEN
            RAISE EXCEPTION 'Veículo deve ter: modelo, placa, ano, tipoVeiculo';
        END IF;

        -- Validar formato da placa (padrão Mercosul: ABC1D23)
        IF NOT (NEW.metadados->>'placa' ~ placa_regex) THEN
            RAISE EXCEPTION 'Placa deve estar no formato ABC1D23';
        END IF;

        -- Validar tipoVeiculo
        IF NEW.metadados->>'tipoVeiculo' NOT IN ('carro', 'moto', 'caminhao', 'outro') THEN
            RAISE EXCEPTION 'tipoVeiculo inválido para veículo';
        END IF;
    END IF;

    -- Validação para INVESTIMENTO
    IF NEW.tipo = 'investimento' THEN
        -- Campos obrigatórios: tipoInvestimento, rentabilidadeAnual, instituicao
        IF NOT (
            NEW.metadados ? 'tipoInvestimento' AND
            NEW.metadados ? 'rentabilidadeAnual' AND
            NEW.metadados ? 'instituicao'
        ) THEN
            RAISE EXCEPTION 'Investimento deve ter: tipoInvestimento, rentabilidadeAnual, instituicao';
        END IF;

        -- Validar tipoInvestimento
        IF NEW.metadados->>'tipoInvestimento' NOT IN ('renda_fixa', 'renda_variavel', 'cripto', 'outro') THEN
            RAISE EXCEPTION 'tipoInvestimento inválido';
        END IF;

        -- Validar rentabilidadeAnual é número
        BEGIN
            PERFORM (NEW.metadados->>'rentabilidadeAnual')::numeric;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'rentabilidadeAnual deve ser um número válido';
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_ativos_metadados_trigger
    BEFORE INSERT OR UPDATE ON public.ativos
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_ativos_metadados();

-- =====================================================
-- TRIGGER: Auto-atualização do campo updated_at
-- =====================================================
CREATE TRIGGER set_ativos_updated_at
    BEFORE UPDATE ON public.ativos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativa RLS na tabela
ALTER TABLE public.ativos ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios ativos
CREATE POLICY "Usuários podem ver seus próprios ativos"
    ON public.ativos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Usuários podem inserir ativos para si mesmos
CREATE POLICY "Usuários podem criar seus próprios ativos"
    ON public.ativos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem atualizar apenas seus próprios ativos
CREATE POLICY "Usuários podem atualizar seus próprios ativos"
    ON public.ativos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Usuários podem deletar apenas seus próprios ativos
CREATE POLICY "Usuários podem deletar seus próprios ativos"
    ON public.ativos
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ativos TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- EXEMPLOS DE METADADOS POR TIPO
-- =====================================================
-- IMÓVEL:
-- {
--   "endereco": "Rua das Flores, 123",
--   "metragem": 85.5,
--   "ano": 2018,
--   "tipoImovel": "apartamento"
-- }
--
-- VEÍCULO:
-- {
--   "modelo": "Honda Civic 2020",
--   "placa": "ABC1D23",
--   "ano": 2020,
--   "tipoVeiculo": "carro"
-- }
--
-- INVESTIMENTO:
-- {
--   "tipoInvestimento": "renda_fixa",
--   "rentabilidadeAnual": 12.5,
--   "instituicao": "Banco XYZ"
-- }

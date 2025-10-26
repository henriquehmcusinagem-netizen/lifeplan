-- =====================================================
-- Migration: 001_create_profiles.sql
-- Description: Criação da tabela de perfis de usuários
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- Tabela de perfis dos usuários
-- Estende a autenticação do Supabase Auth com informações adicionais
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL CHECK (char_length(nome_completo) >= 3 AND char_length(nome_completo) <= 100),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.profiles IS 'Perfis dos usuários do sistema LifePlan';
COMMENT ON COLUMN public.profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN public.profiles.nome_completo IS 'Nome completo do usuário (3-100 caracteres)';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL do avatar do usuário (opcional)';
COMMENT ON COLUMN public.profiles.created_at IS 'Data de criação do perfil';
COMMENT ON COLUMN public.profiles.updated_at IS 'Data da última atualização do perfil';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- =====================================================
-- TRIGGER: Auto-atualização do campo updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TRIGGER: Auto-criação de perfil ao registrar usuário
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nome_completo)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativa RLS na tabela
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Usuários podem criar seu próprio perfil"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Usuários NÃO podem deletar seus perfis (apenas CASCADE via auth.users)
CREATE POLICY "Usuários não podem deletar perfis diretamente"
    ON public.profiles
    FOR DELETE
    USING (false);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- Migration: 006_create_functions.sql
-- Description: Funções utilitárias para cálculos e operações
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- =====================================================
-- FUNÇÃO: Calcular progresso de um objetivo
-- =====================================================
CREATE OR REPLACE FUNCTION public.calcular_progresso_objetivo(objetivo_id UUID)
RETURNS DECIMAL(5, 2) AS $$
DECLARE
    v_valor DECIMAL(15, 2);
    v_valor_atual DECIMAL(15, 2);
    v_progresso DECIMAL(5, 2);
BEGIN
    -- Buscar valores do objetivo
    SELECT valor, valor_atual
    INTO v_valor, v_valor_atual
    FROM public.objetivos
    WHERE id = objetivo_id;

    -- Se não encontrou o objetivo, retornar 0
    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- Se valor é zero, retornar 0 para evitar divisão por zero
    IF v_valor = 0 THEN
        RETURN 0;
    END IF;

    -- Calcular progresso percentual (limitado a 100%)
    v_progresso := LEAST((v_valor_atual / v_valor) * 100, 100);

    RETURN ROUND(v_progresso, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.calcular_progresso_objetivo IS 'Calcula o progresso percentual de um objetivo (0-100%)';

-- =====================================================
-- FUNÇÃO: Total de receitas de um mês
-- =====================================================
CREATE OR REPLACE FUNCTION public.total_receitas_mes(
    p_user_id UUID,
    p_mes INTEGER,
    p_ano INTEGER
)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
    v_total DECIMAL(15, 2);
BEGIN
    -- Validar mês
    IF p_mes < 1 OR p_mes > 12 THEN
        RAISE EXCEPTION 'Mês inválido. Use valores entre 1 e 12';
    END IF;

    -- Calcular total de receitas do mês
    SELECT COALESCE(SUM(valor), 0)
    INTO v_total
    FROM public.lancamentos
    WHERE user_id = p_user_id
        AND tipo = 'receita'
        AND EXTRACT(MONTH FROM data) = p_mes
        AND EXTRACT(YEAR FROM data) = p_ano;

    RETURN ROUND(v_total, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.total_receitas_mes IS 'Calcula o total de receitas de um usuário em um mês específico';

-- =====================================================
-- FUNÇÃO: Total de despesas de um mês
-- =====================================================
CREATE OR REPLACE FUNCTION public.total_despesas_mes(
    p_user_id UUID,
    p_mes INTEGER,
    p_ano INTEGER
)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
    v_total DECIMAL(15, 2);
BEGIN
    -- Validar mês
    IF p_mes < 1 OR p_mes > 12 THEN
        RAISE EXCEPTION 'Mês inválido. Use valores entre 1 e 12';
    END IF;

    -- Calcular total de despesas do mês
    SELECT COALESCE(SUM(valor), 0)
    INTO v_total
    FROM public.lancamentos
    WHERE user_id = p_user_id
        AND tipo = 'despesa'
        AND EXTRACT(MONTH FROM data) = p_mes
        AND EXTRACT(YEAR FROM data) = p_ano;

    RETURN ROUND(v_total, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.total_despesas_mes IS 'Calcula o total de despesas de um usuário em um mês específico';

-- =====================================================
-- FUNÇÃO: Resultado do mês (receitas - despesas)
-- =====================================================
CREATE OR REPLACE FUNCTION public.resultado_mes(
    p_user_id UUID,
    p_mes INTEGER,
    p_ano INTEGER
)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
    v_receitas DECIMAL(15, 2);
    v_despesas DECIMAL(15, 2);
BEGIN
    -- Obter totais usando as funções existentes
    v_receitas := public.total_receitas_mes(p_user_id, p_mes, p_ano);
    v_despesas := public.total_despesas_mes(p_user_id, p_mes, p_ano);

    -- Retornar resultado (receitas - despesas)
    RETURN ROUND(v_receitas - v_despesas, 2);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.resultado_mes IS 'Calcula o resultado mensal (receitas - despesas) de um usuário';

-- =====================================================
-- FUNÇÃO: Gerar próximo lançamento recorrente
-- =====================================================
CREATE OR REPLACE FUNCTION public.gerar_lancamento_recorrente(recorrente_id UUID)
RETURNS UUID AS $$
DECLARE
    v_recorrente RECORD;
    v_nova_data DATE;
    v_novo_lancamento_id UUID;
    v_parcela_numero INTEGER;
BEGIN
    -- Buscar dados do lançamento recorrente
    SELECT *
    INTO v_recorrente
    FROM public.lancamentos_recorrentes
    WHERE id = recorrente_id
        AND ativo = true
        AND parcelas_geradas < parcelas_total;

    -- Se não encontrou ou já completou todas as parcelas, retornar NULL
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Calcular número da parcela atual
    v_parcela_numero := v_recorrente.parcelas_geradas + 1;

    -- Calcular data da próxima parcela (adiciona meses à data inicial)
    v_nova_data := v_recorrente.data_inicio + (v_recorrente.parcelas_geradas || ' months')::INTERVAL;

    -- Criar novo lançamento
    INSERT INTO public.lancamentos (
        user_id,
        tipo,
        categoria,
        valor,
        data,
        descricao,
        recorrente,
        parcelas,
        lancamento_pai_id
    ) VALUES (
        v_recorrente.user_id,
        v_recorrente.tipo,
        v_recorrente.categoria,
        v_recorrente.valor,
        v_nova_data,
        v_recorrente.descricao || ' (' || v_parcela_numero || '/' || v_recorrente.parcelas_total || ')',
        true,
        v_recorrente.parcelas_total,
        recorrente_id
    )
    RETURNING id INTO v_novo_lancamento_id;

    -- Atualizar contador de parcelas geradas
    UPDATE public.lancamentos_recorrentes
    SET parcelas_geradas = parcelas_geradas + 1
    WHERE id = recorrente_id;

    RETURN v_novo_lancamento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.gerar_lancamento_recorrente IS 'Gera o próximo lançamento a partir de um template recorrente';

-- =====================================================
-- FUNÇÃO: Gerar todos os lançamentos recorrentes pendentes
-- =====================================================
CREATE OR REPLACE FUNCTION public.processar_lancamentos_recorrentes()
RETURNS TABLE (
    recorrente_id UUID,
    lancamentos_criados INTEGER
) AS $$
DECLARE
    v_recorrente RECORD;
    v_lancamentos_criados INTEGER;
    v_novo_id UUID;
BEGIN
    -- Iterar sobre todos os lançamentos recorrentes ativos e pendentes
    FOR v_recorrente IN
        SELECT id, data_inicio, parcelas_total, parcelas_geradas
        FROM public.lancamentos_recorrentes
        WHERE ativo = true
            AND parcelas_geradas < parcelas_total
            AND user_id = auth.uid()  -- Apenas do usuário atual
        ORDER BY data_inicio
    LOOP
        v_lancamentos_criados := 0;

        -- Gerar lançamentos até a data atual
        WHILE v_recorrente.parcelas_geradas < v_recorrente.parcelas_total
            AND (v_recorrente.data_inicio + (v_recorrente.parcelas_geradas || ' months')::INTERVAL) <= CURRENT_DATE
        LOOP
            v_novo_id := public.gerar_lancamento_recorrente(v_recorrente.id);

            IF v_novo_id IS NOT NULL THEN
                v_lancamentos_criados := v_lancamentos_criados + 1;
                v_recorrente.parcelas_geradas := v_recorrente.parcelas_geradas + 1;
            ELSE
                EXIT;  -- Sair do loop se não conseguir gerar
            END IF;
        END LOOP;

        -- Retornar resultado para este recorrente
        IF v_lancamentos_criados > 0 THEN
            recorrente_id := v_recorrente.id;
            lancamentos_criados := v_lancamentos_criados;
            RETURN NEXT;
        END IF;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.processar_lancamentos_recorrentes IS 'Processa todos os lançamentos recorrentes pendentes do usuário até a data atual';

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT EXECUTE ON FUNCTION public.calcular_progresso_objetivo TO authenticated;
GRANT EXECUTE ON FUNCTION public.total_receitas_mes TO authenticated;
GRANT EXECUTE ON FUNCTION public.total_despesas_mes TO authenticated;
GRANT EXECUTE ON FUNCTION public.resultado_mes TO authenticated;
GRANT EXECUTE ON FUNCTION public.gerar_lancamento_recorrente TO authenticated;
GRANT EXECUTE ON FUNCTION public.processar_lancamentos_recorrentes TO authenticated;

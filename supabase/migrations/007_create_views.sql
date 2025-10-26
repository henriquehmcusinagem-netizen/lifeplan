-- =====================================================
-- Migration: 007_create_views.sql
-- Description: Criação de views para relatórios e dashboards
-- Author: Sistema LifePlan
-- Date: 2025-10-25
-- =====================================================

-- =====================================================
-- VIEW: Dashboard mensal consolidado
-- =====================================================
CREATE OR REPLACE VIEW public.v_dashboard_mensal AS
SELECT
    l.user_id,
    EXTRACT(MONTH FROM l.data)::INTEGER AS mes,
    EXTRACT(YEAR FROM l.data)::INTEGER AS ano,
    COALESCE(SUM(CASE WHEN l.tipo = 'receita' THEN l.valor ELSE 0 END), 0) AS receitas,
    COALESCE(SUM(CASE WHEN l.tipo = 'despesa' THEN l.valor ELSE 0 END), 0) AS despesas,
    COALESCE(
        SUM(CASE WHEN l.tipo = 'receita' THEN l.valor ELSE 0 END) -
        SUM(CASE WHEN l.tipo = 'despesa' THEN l.valor ELSE 0 END),
        0
    ) AS resultado,
    COUNT(DISTINCT CASE WHEN l.tipo = 'receita' THEN l.id END) AS total_receitas_count,
    COUNT(DISTINCT CASE WHEN l.tipo = 'despesa' THEN l.id END) AS total_despesas_count
FROM public.lancamentos l
GROUP BY l.user_id, EXTRACT(MONTH FROM l.data), EXTRACT(YEAR FROM l.data)
ORDER BY ano DESC, mes DESC;

COMMENT ON VIEW public.v_dashboard_mensal IS 'Dashboard mensal consolidado com receitas, despesas e resultado';

-- =====================================================
-- VIEW: Objetivos com progresso calculado
-- =====================================================
CREATE OR REPLACE VIEW public.v_objetivos_progresso AS
SELECT
    o.id,
    o.user_id,
    o.nome,
    o.valor,
    o.valor_atual,
    o.prioridade,
    o.prazo,
    o.categoria,
    o.icone,
    o.status,
    o.created_at,
    o.updated_at,
    -- Cálculo do progresso percentual
    CASE
        WHEN o.valor > 0 THEN LEAST(ROUND((o.valor_atual / o.valor) * 100, 2), 100)
        ELSE 0
    END AS progresso_percentual,
    -- Valor restante para alcançar o objetivo
    GREATEST(o.valor - o.valor_atual, 0) AS valor_restante,
    -- Dias até o prazo
    (o.prazo - CURRENT_DATE) AS dias_restantes,
    -- Valor médio mensal necessário para alcançar o objetivo
    CASE
        WHEN o.prazo > CURRENT_DATE AND o.valor > o.valor_atual THEN
            ROUND(
                (o.valor - o.valor_atual) /
                GREATEST(
                    EXTRACT(EPOCH FROM (o.prazo::timestamp - CURRENT_DATE::timestamp)) / (30.44 * 86400), -- meses restantes
                    1
                ),
                2
            )
        ELSE 0
    END AS valor_mensal_necessario,
    -- Status do prazo
    CASE
        WHEN o.status = 'concluido' THEN 'concluido'
        WHEN o.status = 'cancelado' THEN 'cancelado'
        WHEN o.prazo < CURRENT_DATE THEN 'atrasado'
        WHEN (o.prazo - CURRENT_DATE) <= 30 THEN 'proximo_vencimento'
        ELSE 'dentro_prazo'
    END AS status_prazo
FROM public.objetivos o;

COMMENT ON VIEW public.v_objetivos_progresso IS 'Objetivos com cálculos de progresso, valores restantes e status do prazo';

-- =====================================================
-- VIEW: Lançamentos agregados por categoria
-- =====================================================
CREATE OR REPLACE VIEW public.v_lancamentos_categoria AS
SELECT
    l.user_id,
    l.tipo,
    l.categoria,
    COUNT(l.id) AS total_lancamentos,
    SUM(l.valor) AS valor_total,
    AVG(l.valor) AS valor_medio,
    MIN(l.valor) AS valor_minimo,
    MAX(l.valor) AS valor_maximo,
    MIN(l.data) AS primeira_data,
    MAX(l.data) AS ultima_data,
    -- Agregação por período
    COUNT(DISTINCT EXTRACT(YEAR FROM l.data) || '-' || EXTRACT(MONTH FROM l.data)) AS meses_com_lancamentos
FROM public.lancamentos l
GROUP BY l.user_id, l.tipo, l.categoria
ORDER BY l.user_id, l.tipo, valor_total DESC;

COMMENT ON VIEW public.v_lancamentos_categoria IS 'Agregação de lançamentos por categoria com estatísticas';

-- =====================================================
-- VIEW: Patrimônio total por usuário
-- =====================================================
CREATE OR REPLACE VIEW public.v_patrimonio_total AS
SELECT
    a.user_id,
    -- Total geral
    COALESCE(SUM(a.valor_estimado), 0) AS patrimonio_total,
    -- Total por tipo de ativo
    COALESCE(SUM(CASE WHEN a.tipo = 'imovel' THEN a.valor_estimado ELSE 0 END), 0) AS total_imoveis,
    COALESCE(SUM(CASE WHEN a.tipo = 'veiculo' THEN a.valor_estimado ELSE 0 END), 0) AS total_veiculos,
    COALESCE(SUM(CASE WHEN a.tipo = 'investimento' THEN a.valor_estimado ELSE 0 END), 0) AS total_investimentos,
    -- Total por vendabilidade
    COALESCE(SUM(CASE WHEN a.vendabilidade = 'vendavel' THEN a.valor_estimado ELSE 0 END), 0) AS total_vendavel,
    COALESCE(SUM(CASE WHEN a.vendabilidade = 'condicional' THEN a.valor_estimado ELSE 0 END), 0) AS total_condicional,
    COALESCE(SUM(CASE WHEN a.vendabilidade = 'nao_vendavel' THEN a.valor_estimado ELSE 0 END), 0) AS total_nao_vendavel,
    -- Contadores
    COUNT(a.id) AS total_ativos,
    COUNT(CASE WHEN a.tipo = 'imovel' THEN 1 END) AS quantidade_imoveis,
    COUNT(CASE WHEN a.tipo = 'veiculo' THEN 1 END) AS quantidade_veiculos,
    COUNT(CASE WHEN a.tipo = 'investimento' THEN 1 END) AS quantidade_investimentos,
    -- Percentuais
    CASE
        WHEN SUM(a.valor_estimado) > 0 THEN
            ROUND((SUM(CASE WHEN a.vendabilidade = 'vendavel' THEN a.valor_estimado ELSE 0 END) / SUM(a.valor_estimado)) * 100, 2)
        ELSE 0
    END AS percentual_vendavel
FROM public.ativos a
GROUP BY a.user_id;

COMMENT ON VIEW public.v_patrimonio_total IS 'Consolidação do patrimônio total por usuário com distribuição por tipo e vendabilidade';

-- =====================================================
-- VIEW: Análise mensal detalhada (últimos 12 meses)
-- =====================================================
CREATE OR REPLACE VIEW public.v_analise_mensal_12m AS
WITH meses AS (
    SELECT
        l.user_id,
        EXTRACT(YEAR FROM l.data)::INTEGER AS ano,
        EXTRACT(MONTH FROM l.data)::INTEGER AS mes,
        TO_CHAR(l.data, 'YYYY-MM') AS periodo,
        MIN(l.data) AS primeira_data,
        MAX(l.data) AS ultima_data
    FROM public.lancamentos l
    WHERE l.data >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY l.user_id, EXTRACT(YEAR FROM l.data), EXTRACT(MONTH FROM l.data), TO_CHAR(l.data, 'YYYY-MM')
)
SELECT
    m.user_id,
    m.ano,
    m.mes,
    m.periodo,
    m.primeira_data,
    m.ultima_data,
    COALESCE(SUM(CASE WHEN l.tipo = 'receita' THEN l.valor END), 0) AS receitas,
    COALESCE(SUM(CASE WHEN l.tipo = 'despesa' THEN l.valor END), 0) AS despesas,
    COALESCE(SUM(CASE WHEN l.tipo = 'receita' THEN l.valor END), 0) -
    COALESCE(SUM(CASE WHEN l.tipo = 'despesa' THEN l.valor END), 0) AS resultado,
    COUNT(CASE WHEN l.tipo = 'receita' THEN 1 END) AS qtd_receitas,
    COUNT(CASE WHEN l.tipo = 'despesa' THEN 1 END) AS qtd_despesas,
    -- Taxa de poupança
    CASE
        WHEN SUM(CASE WHEN l.tipo = 'receita' THEN l.valor END) > 0 THEN
            ROUND(
                ((SUM(CASE WHEN l.tipo = 'receita' THEN l.valor END) -
                  SUM(CASE WHEN l.tipo = 'despesa' THEN l.valor END)) /
                 SUM(CASE WHEN l.tipo = 'receita' THEN l.valor END)) * 100,
                2
            )
        ELSE 0
    END AS taxa_poupanca
FROM meses m
LEFT JOIN public.lancamentos l ON
    l.user_id = m.user_id AND
    EXTRACT(YEAR FROM l.data) = m.ano AND
    EXTRACT(MONTH FROM l.data) = m.mes
GROUP BY m.user_id, m.ano, m.mes, m.periodo, m.primeira_data, m.ultima_data
ORDER BY m.user_id, m.ano DESC, m.mes DESC;

COMMENT ON VIEW public.v_analise_mensal_12m IS 'Análise mensal detalhada dos últimos 12 meses com taxa de poupança';

-- =====================================================
-- VIEW: Top categorias de despesas
-- =====================================================
CREATE OR REPLACE VIEW public.v_top_categorias_despesas AS
SELECT
    l.user_id,
    l.categoria,
    COUNT(l.id) AS total_lancamentos,
    SUM(l.valor) AS valor_total,
    AVG(l.valor) AS valor_medio,
    -- Percentual do total de despesas
    ROUND(
        (SUM(l.valor) / NULLIF(
            (SELECT SUM(valor) FROM public.lancamentos WHERE user_id = l.user_id AND tipo = 'despesa'),
            0
        )) * 100,
        2
    ) AS percentual_total,
    -- Ranking
    ROW_NUMBER() OVER (PARTITION BY l.user_id ORDER BY SUM(l.valor) DESC) AS ranking
FROM public.lancamentos l
WHERE l.tipo = 'despesa'
GROUP BY l.user_id, l.categoria
ORDER BY l.user_id, valor_total DESC;

COMMENT ON VIEW public.v_top_categorias_despesas IS 'Ranking das categorias de despesas por valor total';

-- =====================================================
-- ROW LEVEL SECURITY nas VIEWS
-- =====================================================

-- Dashboard mensal
ALTER VIEW public.v_dashboard_mensal SET (security_invoker = true);

-- Objetivos com progresso
ALTER VIEW public.v_objetivos_progresso SET (security_invoker = true);

-- Lançamentos por categoria
ALTER VIEW public.v_lancamentos_categoria SET (security_invoker = true);

-- Patrimônio total
ALTER VIEW public.v_patrimonio_total SET (security_invoker = true);

-- Análise mensal 12 meses
ALTER VIEW public.v_analise_mensal_12m SET (security_invoker = true);

-- Top categorias de despesas
ALTER VIEW public.v_top_categorias_despesas SET (security_invoker = true);

-- =====================================================
-- GRANTS: Permissões para usuários autenticados
-- =====================================================
GRANT SELECT ON public.v_dashboard_mensal TO authenticated;
GRANT SELECT ON public.v_objetivos_progresso TO authenticated;
GRANT SELECT ON public.v_lancamentos_categoria TO authenticated;
GRANT SELECT ON public.v_patrimonio_total TO authenticated;
GRANT SELECT ON public.v_analise_mensal_12m TO authenticated;
GRANT SELECT ON public.v_top_categorias_despesas TO authenticated;

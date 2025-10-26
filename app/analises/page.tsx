'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { ExportButton } from '@/components/ExportButton';
import {
  TrendingUp,
  DollarSign,
  TrendingDown,
  Percent,
  Lightbulb,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react';
import { generateAnalisesPDF } from '@/lib/export-pdf';
import { exportToPDF } from '@/lib/export-pdf';
import { exportAnalisesToExcel } from '@/lib/export-excel';
import { useLancamentos } from '@/hooks/useLancamentos';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const CORES_CATEGORIAS: Record<string, string> = {
  'Gastos Fixos': '#3b82f6',
  'Alimentação': '#10b981',
  'Transporte': '#f59e0b',
  'Lazer': '#8b5cf6',
  'Saúde': '#ec4899',
  'Educação': '#14b8a6',
  'Outros': '#6b7280',
};

export default function AnalisesPage() {
  const { lancamentos, loading } = useLancamentos();
  const anoAtual = new Date().getFullYear();

  // Processar dados dos lançamentos
  const dadosProcessados = useMemo(() => {
    // Filtrar lançamentos do ano atual
    const lancamentosAno = lancamentos.filter(l => {
      const data = new Date(l.data);
      return data.getFullYear() === anoAtual;
    });

    // Calcular dados mensais
    const dadosMensais = MESES.map((mes, index) => {
      const lancamentosMes = lancamentosAno.filter(l => {
        const data = new Date(l.data);
        return data.getMonth() === index;
      });

      const receitas = lancamentosMes
        .filter(l => l.tipo === 'receita')
        .reduce((sum, l) => sum + Number(l.valor), 0);

      const despesas = lancamentosMes
        .filter(l => l.tipo === 'despesa')
        .reduce((sum, l) => sum + Number(l.valor), 0);

      return {
        mes,
        receitas,
        despesas,
        resultado: receitas - despesas
      };
    });

    // Calcular totais do ano
    const receitasTotal = dadosMensais.reduce((sum, m) => sum + m.receitas, 0);
    const despesasTotal = dadosMensais.reduce((sum, m) => sum + m.despesas, 0);
    const resultadoTotal = receitasTotal - despesasTotal;
    const margem = receitasTotal > 0 ? (resultadoTotal / receitasTotal) * 100 : 0;

    // Calcular dados trimestrais
    const dadosTrimestrais = [
      { trimestre: '1º Trimestre', meses: [0, 1, 2] },
      { trimestre: '2º Trimestre', meses: [3, 4, 5] },
      { trimestre: '3º Trimestre', meses: [6, 7, 8] },
      { trimestre: '4º Trimestre', meses: [9, 10, 11] },
    ].map(t => {
      const receitas = t.meses.reduce((sum, m) => sum + dadosMensais[m].receitas, 0);
      const despesas = t.meses.reduce((sum, m) => sum + dadosMensais[m].despesas, 0);
      const resultado = receitas - despesas;
      const margemTrimestre = receitas > 0 ? (resultado / receitas) * 100 : 0;

      return {
        trimestre: t.trimestre,
        resultado,
        margem: Number(margemTrimestre.toFixed(1)),
        positivo: resultado >= 0
      };
    });

    // Calcular distribuição de despesas por categoria
    const despesasPorCategoria: Record<string, number> = {};
    lancamentosAno
      .filter(l => l.tipo === 'despesa')
      .forEach(l => {
        const categoria = l.categoria || 'Outros';
        despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + Number(l.valor);
      });

    const distribuicaoDespesas = Object.entries(despesasPorCategoria)
      .map(([categoria, valor]) => ({
        categoria,
        valor: despesasTotal > 0 ? Number(((valor / despesasTotal) * 100).toFixed(1)) : 0,
        cor: CORES_CATEGORIAS[categoria] || CORES_CATEGORIAS['Outros']
      }))
      .sort((a, b) => b.valor - a.valor);

    // Gerar insights automáticos
    const insights = [];

    // Insight sobre resultado anual
    if (resultadoTotal > 0) {
      insights.push({
        titulo: 'Resultado Positivo no Ano',
        descricao: `Você teve um saldo positivo de R$ ${resultadoTotal.toLocaleString('pt-BR')} em ${anoAtual}, com margem de ${margem.toFixed(1)}%.`,
        tipo: 'success'
      });
    } else if (resultadoTotal < 0) {
      insights.push({
        titulo: 'Atenção: Resultado Negativo',
        descricao: `Suas despesas superaram as receitas em R$ ${Math.abs(resultadoTotal).toLocaleString('pt-BR')} em ${anoAtual}. Revise seus gastos.`,
        tipo: 'warning'
      });
    }

    // Insight sobre melhor trimestre
    const melhorTrimestre = dadosTrimestrais.reduce((max, t) => t.resultado > max.resultado ? t : max);
    if (melhorTrimestre.resultado > 0) {
      insights.push({
        titulo: `Melhor Desempenho: ${melhorTrimestre.trimestre}`,
        descricao: `O ${melhorTrimestre.trimestre} foi o mais lucrativo com R$ ${melhorTrimestre.resultado.toLocaleString('pt-BR')} (${melhorTrimestre.margem}% de margem).`,
        tipo: 'success'
      });
    }

    // Insight sobre pior trimestre
    const piorTrimestre = dadosTrimestrais.reduce((min, t) => t.resultado < min.resultado ? t : min);
    if (piorTrimestre.resultado < 0) {
      insights.push({
        titulo: `Trimestre Crítico: ${piorTrimestre.trimestre}`,
        descricao: `O ${piorTrimestre.trimestre} teve prejuízo de R$ ${Math.abs(piorTrimestre.resultado).toLocaleString('pt-BR')}. Revise despesas deste período.`,
        tipo: 'warning'
      });
    }

    // Insight sobre maior categoria de despesa
    if (distribuicaoDespesas.length > 0) {
      const maiorCategoria = distribuicaoDespesas[0];
      insights.push({
        titulo: `Maior Despesa: ${maiorCategoria.categoria}`,
        descricao: `A categoria "${maiorCategoria.categoria}" representa ${maiorCategoria.valor}% das suas despesas. ${maiorCategoria.valor > 30 ? 'Há potencial para otimização.' : 'Está dentro do esperado.'}`,
        tipo: maiorCategoria.valor > 30 ? 'warning' : 'info'
      });
    }

    return {
      dadosMensais,
      dadosTrimestrais,
      distribuicaoDespesas,
      receitasTotal,
      despesasTotal,
      resultadoTotal,
      margem,
      insights
    };
  }, [lancamentos, anoAtual]);

  const handleExportExcel = () => {
    const dadosExport = dadosProcessados.dadosMensais.map(m => ({
      'Mês': m.mes,
      'Receitas': m.receitas,
      'Despesas': m.despesas,
      'Resultado': m.resultado
    }));

    exportAnalisesToExcel(dadosExport);
  };

  const handleExportPDF = () => {
    generateAnalisesPDF({
      receitas: dadosProcessados.receitasTotal,
      despesas: dadosProcessados.despesasTotal,
      resultado: dadosProcessados.resultadoTotal
    });
  };

  if (loading) {
    return (
      <AppLayout
        title="Análises"
        subtitle="Inteligência financeira e métricas estratégicas"
      >
        <div className="p-4 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando análises...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Análises"
      subtitle="Inteligência financeira e métricas estratégicas"
    >
      <div className="p-4 lg:p-8">
        {/* Botão de Exportação */}
        <div className="flex justify-end mb-4 lg:mb-6">
          <ExportButton
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />
        </div>

        <div id="analises-content">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatCard
              label={`Resultado ${anoAtual}`}
              value={`R$ ${dadosProcessados.resultadoTotal.toLocaleString('pt-BR')}`}
              icon={<TrendingUp className="w-6 h-6" />}
              variant={dadosProcessados.resultadoTotal >= 0 ? "success" : "danger"}
            />

            <StatCard
              label="Receitas"
              value={`R$ ${dadosProcessados.receitasTotal.toLocaleString('pt-BR')}`}
              icon={<DollarSign className="w-6 h-6" />}
            />

            <StatCard
              label="Despesas"
              value={`R$ ${dadosProcessados.despesasTotal.toLocaleString('pt-BR')}`}
              icon={<TrendingDown className="w-6 h-6" />}
            />

            <StatCard
              label="Margem"
              value={`${dadosProcessados.margem.toFixed(1)}%`}
              icon={<Percent className="w-6 h-6" />}
            />
          </div>

          {/* Análise Mensal */}
          <div className="card mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">ANÁLISE MENSAL</h2>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dadosProcessados.dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="mes"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="receitas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Receitas"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Despesas"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resultado"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Resultado"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Análise Trimestral */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">ANÁLISE TRIMESTRAL</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {dadosProcessados.dadosTrimestrais.map((trimestre, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">{trimestre.trimestre}</p>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>

                  <p className={`text-3xl font-bold mt-2 ${
                    trimestre.positivo ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {trimestre.positivo ? '' : '-'}R$ {Math.abs(trimestre.resultado).toLocaleString('pt-BR')}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      trimestre.positivo
                        ? 'bg-success-50 text-success-700'
                        : 'bg-danger-50 text-danger-700'
                    }`}>
                      {trimestre.margem > 0 ? '+' : ''}{trimestre.margem}% margem
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição de Despesas e Insights lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
            {/* Distribuição de Despesas */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <PieChartIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">DISTRIBUIÇÃO DE DESPESAS</h2>
              </div>

              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dadosProcessados.distribuicaoDespesas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, valor }) => `${categoria} ${valor}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {dadosProcessados.distribuicaoDespesas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legenda com barras */}
                <div className="w-full mt-4 space-y-3">
                  {dadosProcessados.distribuicaoDespesas.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.cor }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 font-medium">{item.categoria}</span>
                          <span className="text-gray-900 font-semibold">{item.valor}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${item.valor}%`,
                              backgroundColor: item.cor
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights & Recomendações */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">INSIGHTS & RECOMENDAÇÕES</h2>
              </div>

              <div className="space-y-4">
                {dadosProcessados.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.tipo === 'success'
                        ? 'bg-success-50 border-success-500'
                        : insight.tipo === 'warning'
                        ? 'bg-warning-50 border-warning-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <h3 className={`font-semibold text-sm mb-1 ${
                      insight.tipo === 'success'
                        ? 'text-success-900'
                        : insight.tipo === 'warning'
                        ? 'text-warning-900'
                        : 'text-blue-900'
                    }`}>
                      {insight.titulo}
                    </h3>
                    <p className={`text-xs ${
                      insight.tipo === 'success'
                        ? 'text-success-700'
                        : insight.tipo === 'warning'
                        ? 'text-warning-700'
                        : 'text-blue-700'
                    }`}>
                      {insight.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

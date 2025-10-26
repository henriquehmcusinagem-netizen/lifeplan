'use client';

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

// Dados mensais de 2025
const dadosMensais = [
  { mes: 'Jan', receitas: 0, despesas: 0, resultado: 0 },
  { mes: 'Fev', receitas: 0, despesas: 0, resultado: 0 },
  { mes: 'Mar', receitas: 11600, despesas: 11600, resultado: 0 },
  { mes: 'Abr', receitas: 17680, despesas: 13221, resultado: 4459 },
  { mes: 'Mai', receitas: 11600, despesas: 11600, resultado: 0 },
  { mes: 'Jun', receitas: 11600, despesas: 11600, resultado: 0 },
  { mes: 'Jul', receitas: 11600, despesas: 14160, resultado: -2560 },
  { mes: 'Ago', receitas: 11600, despesas: 13879, resultado: -2221 },
  { mes: 'Set', receitas: 11600, despesas: 13258, resultado: -1658 },
  { mes: 'Out', receitas: 17680, despesas: 13121, resultado: 4559 },
  { mes: 'Nov', receitas: 17680, despesas: 12563, resultado: 5117 },
  { mes: 'Dez', receitas: 21219, despesas: 19520, resultado: 1699 },
];

// Dados trimestrais
const dadosTrimestrais = [
  { trimestre: '1º Trimestre', resultado: 0, margem: 0, positivo: false },
  { trimestre: '2º Trimestre', resultado: 4459, margem: 9.8, positivo: true },
  { trimestre: '3º Trimestre', resultado: -6439, margem: -13.9, positivo: false },
  { trimestre: '4º Trimestre', resultado: 11375, margem: 18.1, positivo: true },
];

// Dados de distribuição de despesas
const distribuicaoDespesas = [
  { categoria: 'Gastos Fixos', valor: 18, cor: '#3b82f6' },
  { categoria: 'Alimentação', valor: 25, cor: '#10b981' },
  { categoria: 'Transporte', valor: 15, cor: '#f59e0b' },
  { categoria: 'Outros', valor: 42, cor: '#8b5cf6' },
];

// Insights
const insights = [
  {
    titulo: 'Recuperação no 2º Semestre',
    descricao: 'O 2º semestre foi significativamente mais lucrativo que o 1º semestre, com destaque para o 4º trimestre (18.1% de margem).',
    tipo: 'success'
  },
  {
    titulo: 'Trimestre Crítico',
    descricao: 'O 3º trimestre teve o pior desempenho com prejuízo de R$ 6.439 (-13.9% margem). Revisar despesas deste período.',
    tipo: 'warning'
  },
  {
    titulo: 'Crescimento de Receitas',
    descricao: 'Receitas aumentaram nos meses de abril, outubro, novembro e dezembro, indicando sazonalidade positiva no final do ano.',
    tipo: 'info'
  },
  {
    titulo: 'Oportunidade de Otimização',
    descricao: 'Categoria "Outros" representa 42% das despesas. Há potencial para redução e categorização mais específica.',
    tipo: 'info'
  },
];

export default function AnalisesPage() {
  // Totais do ano
  const receitasTotal = 154459;
  const despesasTotal = 140363;
  const resultadoTotal = 14096;
  const margem = 9.1;

  const handleExportExcel = () => {
    // Para Excel, você pode exportar os dados de análises estruturados
    console.log('Exportar análises para Excel');
  };

  const handleExportPDF = () => {
    generateAnalisesPDF({
      receitas: receitasTotal,
      despesas: despesasTotal,
      resultado: resultadoTotal
    });
  };

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
              label="Resultado 2025"
              value={`R$ ${resultadoTotal.toLocaleString('pt-BR')}`}
              icon={<TrendingUp className="w-6 h-6" />}
              variant="success"
            />

            <StatCard
              label="Receitas"
              value={`R$ ${receitasTotal.toLocaleString('pt-BR')}`}
              icon={<DollarSign className="w-6 h-6" />}
            />

            <StatCard
              label="Despesas"
              value={`R$ ${despesasTotal.toLocaleString('pt-BR')}`}
              icon={<TrendingDown className="w-6 h-6" />}
            />

            <StatCard
              label="Margem"
              value={`${margem}%`}
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
              <LineChart data={dadosMensais}>
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
              {dadosTrimestrais.map((trimestre, index) => (
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
                      data={distribuicaoDespesas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, valor }) => `${categoria} ${valor}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {distribuicaoDespesas.map((entry, index) => (
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
                  {distribuicaoDespesas.map((item, index) => (
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
                {insights.map((insight, index) => (
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

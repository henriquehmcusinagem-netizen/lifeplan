'use client';

import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { ExportButton } from '@/components/ExportButton';
import { NovoLancamentoModal, EditarLancamentoModal } from '@/components/modals';
import type { Lancamento } from '@/components/modals/EditarLancamentoModal';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Filter, Edit2, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { exportLancamentosToExcel } from '@/lib/export-excel';
import { exportToPDF } from '@/lib/export-pdf';
import { useLancamentos } from '@/hooks/useLancamentos';
import { categoriasReceita, categoriasDespesa } from '@/lib/validations';

// Mapeamento de ícones para categorias
const getCategoriaIcon = (categoria: string, tipo: 'receita' | 'despesa'): string => {
  const categorias = tipo === 'receita' ? categoriasReceita : categoriasDespesa;
  const found = categorias.find(c => c.value === categoria);
  if (found?.label) {
    const emoji = found.label.match(/^(\p{Emoji})/u);
    return emoji ? emoji[0] : '💰';
  }
  return tipo === 'receita' ? '💰' : '💸';
};

// Mapeamento de nomes de categorias
const getCategoriaLabel = (categoria: string, tipo: 'receita' | 'despesa'): string => {
  const categorias = tipo === 'receita' ? categoriasReceita : categoriasDespesa;
  const found = categorias.find(c => c.value === categoria);
  return found?.label.replace(/^(\p{Emoji})\s*/u, '') || categoria;
};

export default function LancamentosPage() {
  const [isNovoLancamentoModalOpen, setIsNovoLancamentoModalOpen] = useState(false);
  const [isEditarLancamentoModalOpen, setIsEditarLancamentoModalOpen] = useState(false);
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<Lancamento | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState(2025);

  // Estados dos filtros
  const [mesSelecionado, setMesSelecionado] = useState<number | ''>(''); // 0-11 ou '' para todos
  const [tipoSelecionado, setTipoSelecionado] = useState<'receita' | 'despesa' | ''>('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [termoBusca, setTermoBusca] = useState('');

  // Buscar dados do Supabase
  const { lancamentos, loading, error, refetch } = useLancamentos();

  // Processar dados para o formato necessário
  const dadosProcessados = useMemo(() => {
    if (!lancamentos || lancamentos.length === 0) {
      return {
        resumoMensal: [],
        receitasPorCategoria: [],
        despesasPorCategoria: [],
        totalReceitas: 0,
        totalDespesas: 0,
        totalResultado: 0,
      };
    }

    // Filtrar lançamentos do ano selecionado e aplicar filtros
    const lancamentosAno = lancamentos.filter(l => {
      const dataLancamento = new Date(l.data);

      // Filtro por ano
      if (dataLancamento.getFullYear() !== anoSelecionado) return false;

      // Filtro por mês
      if (mesSelecionado !== '' && dataLancamento.getMonth() !== mesSelecionado) return false;

      // Filtro por tipo
      if (tipoSelecionado !== '' && l.tipo !== tipoSelecionado) return false;

      // Filtro por categoria
      if (categoriaSelecionada !== '' && l.categoria !== categoriaSelecionada) return false;

      // Filtro por busca (descricao)
      if (termoBusca && !l.descricao.toLowerCase().includes(termoBusca.toLowerCase())) return false;

      return true;
    });

    // Array de meses
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Calcular resumo mensal
    const resumoMensal = meses.map((mes, index) => {
      const lancamentosMes = lancamentosAno.filter(l => {
        const dataLancamento = new Date(l.data);
        return dataLancamento.getMonth() === index;
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
        resultado: receitas - despesas,
      };
    });

    // Calcular receitas por categoria
    const receitasPorCategoriaMap = new Map<string, number>();
    lancamentosAno
      .filter(l => l.tipo === 'receita')
      .forEach(l => {
        const atual = receitasPorCategoriaMap.get(l.categoria) || 0;
        receitasPorCategoriaMap.set(l.categoria, atual + Number(l.valor));
      });

    const receitasPorCategoria = Array.from(receitasPorCategoriaMap.entries())
      .map(([categoria, total]) => ({
        categoria: getCategoriaLabel(categoria, 'receita'),
        categoriaValue: categoria,
        icon: getCategoriaIcon(categoria, 'receita'),
        total,
      }))
      .sort((a, b) => b.total - a.total);

    // Calcular despesas por categoria
    const despesasPorCategoriaMap = new Map<string, number>();
    lancamentosAno
      .filter(l => l.tipo === 'despesa')
      .forEach(l => {
        const atual = despesasPorCategoriaMap.get(l.categoria) || 0;
        despesasPorCategoriaMap.set(l.categoria, atual + Number(l.valor));
      });

    const despesasPorCategoria = Array.from(despesasPorCategoriaMap.entries())
      .map(([categoria, total]) => ({
        categoria: getCategoriaLabel(categoria, 'despesa'),
        categoriaValue: categoria,
        icon: getCategoriaIcon(categoria, 'despesa'),
        total,
      }))
      .sort((a, b) => b.total - a.total);

    const totalReceitas = receitasPorCategoria.reduce((sum, r) => sum + r.total, 0);
    const totalDespesas = despesasPorCategoria.reduce((sum, d) => sum + d.total, 0);

    return {
      resumoMensal,
      receitasPorCategoria,
      despesasPorCategoria,
      totalReceitas,
      totalDespesas,
      totalResultado: totalReceitas - totalDespesas,
    };
  }, [lancamentos, anoSelecionado, mesSelecionado, tipoSelecionado, categoriaSelecionada, termoBusca]);

  const {
    resumoMensal,
    receitasPorCategoria,
    despesasPorCategoria,
    totalReceitas,
    totalDespesas,
    totalResultado
  } = dadosProcessados;

  const handleExportExcel = () => {
    const dadosExport = resumoMensal.map(l => ({
      'Mês': l.mes,
      'Receitas': l.receitas,
      'Despesas': l.despesas,
      'Resultado': l.resultado
    }));
    exportLancamentosToExcel(dadosExport);
  };

  const handleExportPDF = async () => {
    await exportToPDF('lancamentos-content', 'lifeplan-lancamentos.pdf');
  };

  const handleEditarLancamento = (categoriaValue: string, tipo: 'receita' | 'despesa', valor: number) => {
    // Buscar o primeiro lançamento dessa categoria para edição
    const lancamentoReal = lancamentos.find(l =>
      l.categoria === categoriaValue && l.tipo === tipo
    );

    if (lancamentoReal) {
      const lancamentoEdit: Lancamento = {
        id: lancamentoReal.id,
        tipo: lancamentoReal.tipo,
        categoria: lancamentoReal.categoria,
        valor: Number(lancamentoReal.valor),
        data: new Date(lancamentoReal.data),
        descricao: lancamentoReal.descricao,
        recorrente: lancamentoReal.recorrente || false,
        parcelas: lancamentoReal.parcelas,
      };

      setLancamentoSelecionado(lancamentoEdit);
      setIsEditarLancamentoModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsNovoLancamentoModalOpen(false);
    setIsEditarLancamentoModalOpen(false);
    setLancamentoSelecionado(null);
    refetch();
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout
        title="Lançamentos Financeiros"
        subtitle="Controle completo de receitas e despesas mensais"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando lançamentos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout
        title="Lançamentos Financeiros"
        subtitle="Controle completo de receitas e despesas mensais"
      >
        <div className="p-4 lg:p-8">
          <div className="card bg-danger-50 border-danger-200">
            <p className="text-danger-700">Erro ao carregar lançamentos: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Empty state
  if (!lancamentos || lancamentos.length === 0) {
    return (
      <AppLayout
        title="Lançamentos Financeiros"
        subtitle="Controle completo de receitas e despesas mensais"
      >
        <div className="p-4 lg:p-8">
          <div className="card text-center py-8 lg:py-12">
            <DollarSign className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              Nenhum lançamento encontrado
            </h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
              Comece adicionando seu primeiro lançamento financeiro
            </p>
            <button
              onClick={() => setIsNovoLancamentoModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 text-sm lg:text-base"
            >
              <Plus className="w-4 h-4" />
              Novo Lançamento
            </button>
          </div>
        </div>

        <NovoLancamentoModal
          isOpen={isNovoLancamentoModalOpen}
          onClose={handleModalClose}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Lançamentos Financeiros"
      subtitle="Controle completo de receitas e despesas mensais"
    >
      <div className="p-4 lg:p-8" id="lancamentos-content">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatCard
              label={`Total Receitas ${anoSelecionado}`}
              value={formatCurrency(totalReceitas)}
              icon={<TrendingUp className="w-6 h-6" />}
            />

            <StatCard
              label={`Total Despesas ${anoSelecionado}`}
              value={formatCurrency(totalDespesas)}
              icon={<TrendingDown className="w-6 h-6" />}
            />

            <StatCard
              label={`Resultado ${anoSelecionado}`}
              value={formatCurrency(totalResultado)}
              icon={<DollarSign className="w-6 h-6" />}
            />

            <StatCard
              label="Média Mensal"
              value={formatCurrency(totalResultado / 12)}
              icon={<Calendar className="w-6 h-6" />}
            />
          </div>

          {/* Filtros e Actions */}
          <div className="card mb-4 lg:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
              <Filter className="w-5 h-5 text-primary-600 hidden lg:block" />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Filtro Ano */}
                <select
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                >
                  <option value={2025}>Ano: 2025</option>
                  <option value={2024}>Ano: 2024</option>
                  <option value={2023}>Ano: 2023</option>
                </select>

                {/* Filtro Mês */}
                <select
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value === '' ? '' : Number(e.target.value))}
                >
                  <option value="">Todos os meses</option>
                  <option value={0}>Janeiro</option>
                  <option value={1}>Fevereiro</option>
                  <option value={2}>Março</option>
                  <option value={3}>Abril</option>
                  <option value={4}>Maio</option>
                  <option value={5}>Junho</option>
                  <option value={6}>Julho</option>
                  <option value={7}>Agosto</option>
                  <option value={8}>Setembro</option>
                  <option value={9}>Outubro</option>
                  <option value={10}>Novembro</option>
                  <option value={11}>Dezembro</option>
                </select>

                {/* Filtro Tipo */}
                <select
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e.target.value as 'receita' | 'despesa' | '')}
                >
                  <option value="">Tipo: Todos</option>
                  <option value="receita">Receitas</option>
                  <option value="despesa">Despesas</option>
                </select>

                {/* Filtro Categoria */}
                <select
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
                  <option value="">Categoria: Todas</option>
                  {tipoSelecionado === 'receita' && categoriasReceita.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                  {tipoSelecionado === 'despesa' && categoriasDespesa.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                  {tipoSelecionado === '' && (
                    <>
                      <optgroup label="Receitas">
                        {categoriasReceita.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Despesas">
                        {categoriasDespesa.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </optgroup>
                    </>
                  )}
                </select>
              </div>

              {/* Campo de Busca */}
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Buscar por descrição..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Limpar Filtros */}
              {(mesSelecionado !== '' || tipoSelecionado !== '' || categoriaSelecionada !== '' || termoBusca !== '') && (
                <button
                  onClick={() => {
                    setMesSelecionado('');
                    setTipoSelecionado('');
                    setCategoriaSelecionada('');
                    setTermoBusca('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <ExportButton
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
              />
              <button
                onClick={() => setIsNovoLancamentoModalOpen(true)}
                className="btn-primary flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                <Plus className="w-4 h-4" />
                Novo Lançamento
              </button>
            </div>
          </div>

          {/* Tabela de Resumo Mensal */}
          <div className="card mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Resumo Mensal {anoSelecionado}</h2>

            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Mês</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Receitas</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Despesas</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Resultado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resumoMensal.map((lancamento, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{lancamento.mes}</td>
                      <td className="py-3 px-4 text-sm text-right text-success-600 font-medium">
                        {formatCurrency(lancamento.receitas)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-danger-600 font-medium">
                        {formatCurrency(lancamento.despesas)}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-bold ${
                        lancamento.resultado > 0 ? 'text-success-600' :
                        lancamento.resultado < 0 ? 'text-danger-600' : 'text-gray-500'
                      }`}>
                        {formatCurrency(lancamento.resultado)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lancamento.resultado > 0 && (
                          <Badge variant="success" icon="✅">Lucro</Badge>
                        )}
                        {lancamento.resultado < 0 && (
                          <Badge variant="danger" icon="⚠️">Prejuízo</Badge>
                        )}
                        {lancamento.resultado === 0 && (
                          <Badge variant="default" icon="○">Sem dados</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Total */}
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-4 px-4 text-sm text-gray-900">TOTAL</td>
                    <td className="py-4 px-4 text-sm text-right text-success-600">
                      {formatCurrency(totalReceitas)}
                    </td>
                    <td className="py-4 px-4 text-sm text-right text-danger-600">
                      {formatCurrency(totalDespesas)}
                    </td>
                    <td className={`py-4 px-4 text-sm text-right ${
                      totalResultado > 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {formatCurrency(totalResultado)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Receitas por Categoria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success-600" />
                Receitas por Categoria
              </h2>

              {receitasPorCategoria.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma receita registrada neste período</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receitasPorCategoria.map((receita, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{receita.icon}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{receita.categoria}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-success-600 dark:text-success-400">
                            {formatCurrency(receita.total)}
                          </span>
                          <button
                            onClick={() => handleEditarLancamento(receita.categoriaValue, 'receita', receita.total)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Editar lançamento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success-500 rounded-full"
                          style={{ width: `${totalReceitas > 0 ? (receita.total / totalReceitas) * 100 : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {totalReceitas > 0 ? ((receita.total / totalReceitas) * 100).toFixed(1) : 0}% do total
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Despesas por Categoria */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-danger-600" />
                Despesas por Categoria
              </h2>

              {despesasPorCategoria.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma despesa registrada neste período</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {despesasPorCategoria.map((despesa, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{despesa.icon}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{despesa.categoria}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-danger-600 dark:text-danger-400">
                            {formatCurrency(despesa.total)}
                          </span>
                          <button
                            onClick={() => handleEditarLancamento(despesa.categoriaValue, 'despesa', despesa.total)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Editar lançamento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-danger-500 rounded-full"
                          style={{ width: `${totalDespesas > 0 ? (despesa.total / totalDespesas) * 100 : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {totalDespesas > 0 ? ((despesa.total / totalDespesas) * 100).toFixed(1) : 0}% do total
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Modal Novo Lançamento */}
      <NovoLancamentoModal
        isOpen={isNovoLancamentoModalOpen}
        onClose={handleModalClose}
      />

      {/* Modal Editar Lançamento */}
      <EditarLancamentoModal
        isOpen={isEditarLancamentoModalOpen}
        onClose={handleModalClose}
        lancamento={lancamentoSelecionado}
      />
    </AppLayout>
  );
}

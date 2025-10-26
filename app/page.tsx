'use client';

import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { ObjectiveCard } from '@/components/ObjectiveCard';
import { AlertCard } from '@/components/AlertCard';
import { Wallet, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useObjetivos } from '@/hooks/useObjetivos';
import { useLancamentos } from '@/hooks/useLancamentos';
import { useAtivos } from '@/hooks/useAtivos';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { objetivos, loading: loadingObjetivos } = useObjetivos();
  const { lancamentos, loading: loadingLancamentos } = useLancamentos();
  const { ativos, loading: loadingAtivos } = useAtivos();

  const isLoading = loadingObjetivos || loadingLancamentos || loadingAtivos;

  // Calcular métricas do dashboard
  const metricas = useMemo(() => {
    // 1. Patrimônio Total (soma dos ativos)
    const patrimonioTotal = ativos.reduce((sum, ativo) => {
      return sum + (ativo.valor_estimado || 0);
    }, 0);

    // 2. Capacidade Mensal (receitas - despesas do mês atual)
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const lancamentosMesAtual = lancamentos.filter((lanc) => {
      const dataLanc = new Date(lanc.data);
      return dataLanc >= primeiroDiaMes && dataLanc <= ultimoDiaMes;
    });

    const receitasMes = lancamentosMesAtual
      .filter((lanc) => lanc.tipo === 'receita')
      .reduce((sum, lanc) => sum + (lanc.valor || 0), 0);

    const despesasMes = lancamentosMesAtual
      .filter((lanc) => lanc.tipo === 'despesa')
      .reduce((sum, lanc) => sum + (lanc.valor || 0), 0);

    const capacidadeMensal = receitasMes - despesasMes;

    // 3. Objetivos Ativos
    const objetivosAtivos = objetivos.filter(
      (obj) => obj.status === 'ativo'
    ).length;

    // 4. Reserva de Emergência (baseada em 6 meses de despesas médias)
    // Calcular média de despesas dos últimos 6 meses
    const seiseMesesAtras = new Date();
    seiseMesesAtras.setMonth(seiseMesesAtras.getMonth() - 6);

    const lancamentosUltimos6Meses = lancamentos.filter((lanc) => {
      const dataLanc = new Date(lanc.data);
      return dataLanc >= seiseMesesAtras;
    });

    const totalDespesas6Meses = lancamentosUltimos6Meses
      .filter((lanc) => lanc.tipo === 'despesa')
      .reduce((sum, lanc) => sum + (lanc.valor || 0), 0);

    const mediaDespesasMensal = totalDespesas6Meses / 6 || despesasMes;
    const reservaNecessaria = mediaDespesasMensal * 6;

    // Verificar se existe um objetivo de "Reserva de Emergência"
    const objetivoReserva = objetivos.find(
      (obj) =>
        obj.categoria === 'emergencia' ||
        obj.nome.toLowerCase().includes('reserva') ||
        obj.nome.toLowerCase().includes('emergência')
    );

    const valorReservaAtual = objetivoReserva?.valor_atual || 0;
    const mesesReserva = mediaDespesasMensal > 0
      ? valorReservaAtual / mediaDespesasMensal
      : 0;

    // Calcular mudança percentual do patrimônio (comparando com mês anterior)
    const mesAnteriorInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const mesAnteriorFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    const lancamentosMesAnterior = lancamentos.filter((lanc) => {
      const dataLanc = new Date(lanc.data);
      return dataLanc >= mesAnteriorInicio && dataLanc <= mesAnteriorFim;
    });

    const receitasMesAnterior = lancamentosMesAnterior
      .filter((lanc) => lanc.tipo === 'receita')
      .reduce((sum, lanc) => sum + (lanc.valor || 0), 0);

    const despesasMesAnterior = lancamentosMesAnterior
      .filter((lanc) => lanc.tipo === 'despesa')
      .reduce((sum, lanc) => sum + (lanc.valor || 0), 0);

    const capacidadeMesAnterior = receitasMesAnterior - despesasMesAnterior;

    const mudancaCapacidade = capacidadeMesAnterior !== 0
      ? ((capacidadeMensal - capacidadeMesAnterior) / Math.abs(capacidadeMesAnterior)) * 100
      : 0;

    return {
      patrimonioTotal,
      capacidadeMensal,
      objetivosAtivos,
      mesesReserva,
      reservaNecessaria,
      mediaDespesasMensal,
      mudancaCapacidade,
    };
  }, [ativos, lancamentos, objetivos]);

  // Gerar alertas inteligentes
  const alertas = useMemo(() => {
    const alerts = [];

    // Alerta de reserva de emergência
    if (metricas.mesesReserva < 3) {
      alerts.push({
        type: 'warning' as const,
        title: metricas.mesesReserva === 0
          ? 'CRÍTICO: Você não tem reserva de emergência!'
          : `ATENÇÃO: Sua reserva cobre apenas ${metricas.mesesReserva.toFixed(1)} meses!`,
        message: `Recomendação: Priorizar ${metricas.reservaNecessaria.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })} antes de outros objetivos. Isso equivale a 6 meses de despesas (${
          metricas.mediaDespesasMensal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        }/mês).`,
      });
    }

    // Alerta de patrimônio parado (se tiver ativos sem rentabilidade)
    const ativosImprodutivos = ativos.filter((ativo) => {
      if (ativo.tipo === 'investimento') {
        return !ativo.rentabilidade_anual || ativo.rentabilidade_anual < 1;
      }
      return ativo.tipo !== 'investimento';
    });

    const valorAtivoImprodutivo = ativosImprodutivos.reduce(
      (sum, ativo) => sum + (ativo.valor_estimado || 0),
      0
    );

    if (valorAtivoImprodutivo > metricas.mediaDespesasMensal * 12) {
      const potencialRenda = valorAtivoImprodutivo * 0.01; // 1% ao mês
      const aumentoCapacidade = metricas.capacidadeMensal > 0
        ? ((potencialRenda / metricas.capacidadeMensal) * 100).toFixed(0)
        : 'significativo';

      alerts.push({
        type: 'info' as const,
        title: 'OPORTUNIDADE: Você tem patrimônio parado',
        message: `Você possui ${valorAtivoImprodutivo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })} em ativos improdutivos. Se investir a 1% ao mês = ${potencialRenda.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}/mês de renda passiva! Isso aumentaria sua capacidade em ${aumentoCapacidade}%.`,
      });
    }

    // Alerta de capacidade negativa
    if (metricas.capacidadeMensal < 0) {
      alerts.push({
        type: 'warning' as const,
        title: 'ATENÇÃO: Suas despesas superam suas receitas!',
        message: `Você está gastando ${Math.abs(metricas.capacidadeMensal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })} a mais do que ganha por mês. Revise seus gastos urgentemente!`,
      });
    }

    return alerts;
  }, [metricas, ativos]);

  // Preparar dados dos objetivos para exibição
  const objetivosParaExibir = useMemo(() => {
    return objetivos
      .filter((obj) => obj.status === 'ativo')
      .sort((a, b) => (b.prioridade || 0) - (a.prioridade || 0))
      .slice(0, 6) // Mostrar até 6 objetivos
      .map((obj) => {
        const faltante = obj.valor - obj.valor_atual;
        const mesesNecessarios = metricas.capacidadeMensal > 0
          ? Math.ceil(faltante / metricas.capacidadeMensal)
          : null;

        let timeRemaining = '';
        if (mesesNecessarios === null) {
          timeRemaining = 'Aumente sua capacidade de poupança';
        } else if (mesesNecessarios <= 0) {
          timeRemaining = 'Objetivo alcançável!';
        } else if (mesesNecessarios === 1) {
          timeRemaining = 'Falta 1 mês';
        } else if (mesesNecessarios <= 12) {
          timeRemaining = `Faltam ${mesesNecessarios} meses`;
        } else {
          const anos = Math.floor(mesesNecessarios / 12);
          const meses = mesesNecessarios % 12;
          timeRemaining = meses > 0
            ? `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`
            : `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
        }

        if (metricas.capacidadeMensal > 0) {
          timeRemaining += ` poupando ${metricas.capacidadeMensal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}/mês`;
        }

        // Adicionar recomendações especiais
        let recommendation = '';
        if (obj.categoria === 'emergencia' || obj.nome.toLowerCase().includes('reserva')) {
          recommendation = 'PRIORIDADE MÁXIMA! Essencial para segurança financeira';
        } else if (metricas.capacidadeMensal <= 0) {
          recommendation = 'Considere aumentar capacidade de poupança ou vender ativos ociosos';
        }

        return {
          title: obj.nome,
          icon: obj.icone || '🎯',
          current: obj.valor_atual,
          target: obj.valor,
          priority: obj.prioridade || 5,
          timeRemaining,
          recommendation: recommendation || undefined,
        };
      });
  }, [objetivos, metricas]);

  const nomeUsuario = user?.user_metadata?.nome_completo?.split(' ')[0] || 'Usuário';

  return (
    <AppLayout
      title="Dashboard"
      subtitle={`Olá, ${nomeUsuario}! Aqui está sua visão geral.`}
    >
      <div className="p-4 lg:p-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando seus dados...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <StatCard
                  label="Patrimônio Total"
                  value={metricas.patrimonioTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                  icon={<Wallet className="w-6 h-6" />}
                />

                <StatCard
                  label="Capacidade Mensal"
                  value={metricas.capacidadeMensal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                  change={metricas.mudancaCapacidade !== 0 ? Number(metricas.mudancaCapacidade.toFixed(1)) : undefined}
                  icon={<TrendingUp className="w-6 h-6" />}
                />

                <StatCard
                  label="Objetivos Ativos"
                  value={metricas.objetivosAtivos.toString()}
                  icon={<Target className="w-6 h-6" />}
                />

                <StatCard
                  label="Reserva de Emergência"
                  value={`${metricas.mesesReserva.toFixed(1)} meses`}
                  icon={<AlertTriangle className="w-6 h-6" />}
                  variant={metricas.mesesReserva < 3 ? 'danger' : metricas.mesesReserva < 6 ? 'warning' : 'success'}
                />
              </div>

              {/* Alerts */}
              {alertas.length > 0 && (
                <div className="mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">
                    Alertas & Recomendações
                  </h2>

                  <div className="space-y-3 lg:space-y-4">
                    {alertas.map((alerta, index) => (
                      <AlertCard
                        key={index}
                        type={alerta.type}
                        title={alerta.title}
                        message={alerta.message}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Objectives */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 lg:mb-4">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                    Seus Objetivos
                  </h2>
                  <button
                    className="btn-primary text-sm lg:text-base w-full sm:w-auto"
                    onClick={() => window.location.href = '/objetivos'}
                  >
                    + Novo Objetivo
                  </button>
                </div>

                {objetivosParaExibir.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 lg:p-8 text-center">
                    <Target className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
                    <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                      Nenhum objetivo cadastrado
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">
                      Comece definindo seus objetivos financeiros para acompanhar seu progresso.
                    </p>
                    <button
                      className="btn-primary text-sm lg:text-base"
                      onClick={() => window.location.href = '/objetivos'}
                    >
                      Criar Primeiro Objetivo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {objetivosParaExibir.map((objetivo, index) => (
                      <ObjectiveCard
                        key={index}
                        {...objetivo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
      </div>
    </AppLayout>
  );
}

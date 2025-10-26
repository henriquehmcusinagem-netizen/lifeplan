/**
 * EXEMPLO PRÁTICO - Página Completa com Loading e Error Handling
 *
 * Este arquivo demonstra uma implementação completa de uma página
 * com todos os recursos de loading states e error handling.
 *
 * Use este código como referência para implementar nas suas páginas.
 */

'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ObjectiveCard } from '@/components/ObjectiveCard';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/Button';
import { ObjectivesLoader } from '@/components/PageLoader';
import { NovoObjetivoModal } from '@/components/modals/NovoObjetivoModal';
import { EditarObjetivoModal } from '@/components/modals/EditarObjetivoModal';
import { useToast } from '@/contexts/ToastContext';
import { Target, TrendingUp, CheckCircle2, Clock, Plus, RefreshCw } from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================

interface Objetivo {
  id: string;
  title: string;
  icon: string;
  current: number;
  target: number;
  priority: number;
  timeRemaining: string;
  recommendation?: string;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ObjetivosPageExample() {
  const { showToast } = useToast();

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectives, setObjectives] = useState<Objetivo[]>([]);

  // Modais
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objetivo | null>(null);

  // ============================================================
  // FUNÇÕES DE CARREGAMENTO
  // ============================================================

  const loadObjectives = async (showLoadingState = true) => {
    if (showLoadingState) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular erro aleatório (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error('Erro ao carregar objetivos do servidor');
      }

      // Dados mockados
      const mockObjectives: Objetivo[] = [
        {
          id: '1',
          title: 'Comprar Moto',
          icon: '🏍️',
          current: 5000,
          target: 20000,
          priority: 8,
          timeRemaining: '8 meses',
          recommendation: 'Economize R$ 1.875/mês para atingir sua meta no prazo planejado.',
        },
        {
          id: '2',
          title: 'Tirar CNH',
          icon: '🚗',
          current: 850,
          target: 3000,
          priority: 9,
          timeRemaining: '4 meses',
          recommendation: 'Você está no caminho certo! Continue guardando R$ 537/mês.',
        },
        {
          id: '3',
          title: 'Reserva de Emergência',
          icon: '🛡️',
          current: 42000,
          target: 50000,
          priority: 10,
          timeRemaining: '5 meses',
          recommendation: 'Quase lá! Apenas R$ 8.000 para completar sua proteção financeira.',
        },
      ];

      setObjectives(mockObjectives);

      if (!showLoadingState) {
        showToast('success', 'Objetivos atualizados!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Carregar dados na montagem
  useEffect(() => {
    loadObjectives();
  }, []);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = () => {
    loadObjectives(false);
  };

  const handleEdit = (objective: Objetivo) => {
    setSelectedObjective(objective);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este objetivo?')) {
      return;
    }

    try {
      // Simular delete na API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setObjectives(prev => prev.filter(obj => obj.id !== id));
      showToast('success', 'Objetivo excluído com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao excluir objetivo');
    }
  };

  const handleSuccess = () => {
    loadObjectives(false);
  };

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(
    obj => (obj.current / obj.target) >= 1
  ).length;
  const inProgressObjectives = objectives.filter(
    obj => obj.current > 0 && (obj.current / obj.target) < 1
  ).length;
  const totalNeeded = objectives.reduce((sum, obj) => sum + obj.target, 0);
  const totalSaved = objectives.reduce((sum, obj) => sum + obj.current, 0);

  // ============================================================
  // RENDERIZAÇÃO - LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Header
            title="Objetivos"
            subtitle="Carregando seus objetivos..."
          />
          <ObjectivesLoader />
        </main>
      </div>
    );
  }

  // ============================================================
  // RENDERIZAÇÃO - ERROR STATE
  // ============================================================

  if (error && objectives.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Header
            title="Objetivos"
            subtitle="Erro ao carregar objetivos"
          />
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Erro ao Carregar Objetivos
              </h2>

              <p className="text-gray-600 mb-6">
                {error}
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => loadObjectives()}
                  variant="primary"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>

                <Button
                  onClick={() => setIsNovoModalOpen(true)}
                  variant="secondary"
                >
                  Criar Primeiro Objetivo
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // RENDERIZAÇÃO - CONTENT
  // ============================================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Objetivos"
          subtitle="Gerencie suas metas e acompanhe o progresso"
        />

        <div className="p-8">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total de Objetivos"
              value={totalObjectives.toString()}
              icon={<Target className="w-5 h-5" />}
            />
            <StatCard
              label="Concluídos"
              value={completedObjectives.toString()}
              icon={<CheckCircle2 className="w-5 h-5" />}
              variant="success"
            />
            <StatCard
              label="Em Andamento"
              value={inProgressObjectives.toString()}
              icon={<Clock className="w-5 h-5" />}
              variant="warning"
            />
            <StatCard
              label="Valor Total"
              value={`R$ ${(totalNeeded / 1000).toFixed(0)}k`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Seus Objetivos
            </h2>

            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="secondary"
                loading={isRefreshing}
                disabled={isRefreshing}
              >
                <RefreshCw className="w-4 h-4" />
                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>

              <Button onClick={() => setIsNovoModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Novo Objetivo
              </Button>
            </div>
          </div>

          {/* Lista de Objetivos */}
          {objectives.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum objetivo cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando seu primeiro objetivo financeiro
              </p>
              <Button onClick={() => setIsNovoModalOpen(true)}>
                Criar Primeiro Objetivo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {objectives.map((objective) => (
                <div key={objective.id} className="relative group">
                  <ObjectiveCard
                    id={objective.id}
                    title={objective.title}
                    icon={objective.icon}
                    current={objective.current}
                    target={objective.target}
                    priority={objective.priority}
                    timeRemaining={objective.timeRemaining}
                    recommendation={objective.recommendation}
                  />

                  {/* Botões de ação (aparecem no hover) */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(objective)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(objective.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resumo Final */}
          {objectives.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    Progresso Geral dos Objetivos
                  </h3>
                  <p className="text-sm text-primary-700 mb-4">
                    Você já economizou{' '}
                    <span className="font-bold">
                      R$ {totalSaved.toLocaleString('pt-BR')}
                    </span>{' '}
                    de um total de{' '}
                    <span className="font-bold">
                      R$ {totalNeeded.toLocaleString('pt-BR')}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-white rounded-full overflow-hidden max-w-md">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${(totalSaved / totalNeeded) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary-900">
                      {((totalSaved / totalNeeded) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-5xl">🎯</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modais */}
      <NovoObjetivoModal
        isOpen={isNovoModalOpen}
        onClose={() => setIsNovoModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {selectedObjective && (
        <EditarObjetivoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedObjective(null);
          }}
          objetivo={{
            id: selectedObjective.id,
            nome: selectedObjective.title,
            valor: selectedObjective.target,
            valorAtual: selectedObjective.current,
            prioridade: selectedObjective.priority,
            prazo: new Date(),
            categoria: 'financeiro',
            icone: selectedObjective.icon,
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// ============================================================
// NOTAS DE IMPLEMENTAÇÃO
// ============================================================

/**
 * Este exemplo demonstra:
 *
 * 1. LOADING STATES
 *    - Loading inicial com ObjectivesLoader
 *    - Loading no botão de refresh
 *    - Loading nos modais
 *
 * 2. ERROR HANDLING
 *    - Try-catch em todas as operações assíncronas
 *    - Tela de erro dedicada
 *    - Botão de retry
 *    - Toast notifications para erros
 *
 * 3. TOAST NOTIFICATIONS
 *    - Sucesso ao criar/editar/excluir
 *    - Erro em operações falhadas
 *    - Info ao atualizar dados
 *
 * 4. ESTADOS VAZIOS
 *    - Mensagem quando não há objetivos
 *    - CTA para criar primeiro objetivo
 *
 * 5. VALIDAÇÃO
 *    - Confirmação antes de excluir
 *    - Validação completa nos modais
 *
 * 6. UX
 *    - Botões de ação aparecem no hover
 *    - Feedback visual em todas as ações
 *    - Estados de carregamento não bloqueantes
 *    - Refresh sem recarregar a página toda
 */

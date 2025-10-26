'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { ToastContainer } from './ui/Toast';
import { useToast } from '@/hooks/useToast';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { Tooltip } from './Tooltip';
import { AnimatedNumber } from './AnimatedNumber';
import { PageTransition } from './PageTransition';
import { FadeIn, StaggeredFadeIn } from './FadeIn';
import { LoadingSkeleton, StatCardSkeleton, TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { ConfirmDialog } from './ConfirmDialog';
import { FloatingActionButton } from './FloatingActionButton';
import {
  DollarSign,
  TrendingUp,
  Target,
  Inbox,
  Plus,
  Info
} from 'lucide-react';

export function AnimationShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { toasts, success, error, info, warning, removeToast } = useToast();

  return (
    <PageTransition>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Showcase de Animações
          </h1>
          <Tooltip content="Demonstração de todos os componentes animados">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-gray-500" />
            </button>
          </Tooltip>
        </div>

        {/* Toast Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Toasts Animados
          </h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => success('Operação realizada com sucesso!')} className="btn-primary">
              Toast Sucesso
            </button>
            <button onClick={() => error('Ocorreu um erro!')} className="btn-secondary">
              Toast Erro
            </button>
            <button onClick={() => info('Informação importante')} className="btn-primary">
              Toast Info
            </button>
            <button onClick={() => warning('Atenção necessária')} className="btn-secondary">
              Toast Aviso
            </button>
          </div>
        </div>

        {/* Modals */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Modais Animados
          </h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Abrir Modal
            </button>
            <button onClick={() => setShowConfirm(true)} className="btn-secondary">
              Abrir Confirmação
            </button>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeIn delay={0}>
            <StatCard
              label="Receitas"
              value={15000}
              change={12.5}
              icon={<DollarSign className="w-5 h-5" />}
              animated
            />
          </FadeIn>
          <FadeIn delay={100}>
            <StatCard
              label="Despesas"
              value={8500}
              change={-5.2}
              icon={<TrendingUp className="w-5 h-5" />}
              animated
            />
          </FadeIn>
          <FadeIn delay={200}>
            <StatCard
              label="Objetivos"
              value={5}
              change={0}
              icon={<Target className="w-5 h-5" />}
              animated
            />
          </FadeIn>
        </div>

        {/* Progress Bars */}
        <div className="card space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Barras de Progresso Animadas
          </h2>
          <ProgressBar current={7500} target={10000} label="Objetivo: Viagem" />
          <ProgressBar current={15000} target={20000} label="Objetivo: Carro" />
          <ProgressBar current={25000} target={50000} label="Objetivo: Casa" />
        </div>

        {/* Animated Numbers */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Números Animados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                R$ <AnimatedNumber value={125000} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Taxa</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedNumber value={12.5} decimals={1} suffix="%" />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Usuários</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedNumber value={1543} />
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Média</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedNumber value={98.7} decimals={1} />
              </p>
            </div>
          </div>
        </div>

        {/* Loading States */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Estados de Loading
            </h2>
            <button
              onClick={() => setShowLoading(!showLoading)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {showLoading ? 'Esconder' : 'Mostrar'} Loading
            </button>
          </div>

          {showLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
              <TableSkeleton rows={3} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Clique em &quot;Mostrar Loading&quot; para ver os skeletons animados
            </p>
          )}
        </div>

        {/* Empty State */}
        <div className="card">
          <EmptyState
            icon={<Inbox className="w-16 h-16" />}
            title="Nenhum item encontrado"
            description="Não há itens para exibir no momento. Comece adicionando um novo item."
            action={
              <button className="btn-primary">
                Adicionar Item
              </button>
            }
          />
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={() => success('Ação rápida executada!')}
          icon={<Plus className="w-6 h-6" />}
          label="Nova Ação"
        />

        {/* Modal Components */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal Animado"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Este é um exemplo de modal com animações suaves de entrada e saída.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Fechar
              </button>
              <button
                onClick={() => {
                  success('Ação confirmada!');
                  setShowModal(false);
                }}
                className="btn-primary"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => success('Ação confirmada!')}
          title="Confirmar Ação"
          description="Tem certeza que deseja realizar esta ação? Esta operação não pode ser desfeita."
          confirmText="Sim, confirmar"
          cancelText="Cancelar"
          variant="danger"
        />

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </PageTransition>
  );
}

'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ObjectiveCard } from '@/components/ObjectiveCard';
import { StatCard } from '@/components/StatCard';
import { ExportButton } from '@/components/ExportButton';
import { NovoObjetivoModal } from '@/components/modals';
import { Target, TrendingUp, CheckCircle2, Clock, Search, Plus } from 'lucide-react';
import { exportObjetivosToExcel } from '@/lib/export-excel';
import { exportToPDF } from '@/lib/export-pdf';
import { useObjetivos } from '@/hooks/useObjetivos';

export default function ObjetivosPage() {
  const [isNovoObjetivoModalOpen, setIsNovoObjetivoModalOpen] = useState(false);
  const { objetivos, loading } = useObjetivos();

  // Converter dados do Supabase para o formato esperado pelo componente
  const objectives = objetivos.map(obj => {
    const prazoDate = new Date(obj.prazo);
    const hoje = new Date();
    const diffTime = prazoDate.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timeRemaining = '';
    if (diffDays < 0) {
      timeRemaining = 'Prazo expirado';
    } else if (diffDays < 30) {
      timeRemaining = `${diffDays} dias`;
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30);
      timeRemaining = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else {
      const anos = Math.floor(diffDays / 365);
      timeRemaining = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }

    const faltante = obj.valor - obj.valor_atual;
    const mesesRestantes = Math.max(1, Math.ceil(diffDays / 30));
    const valorMensal = faltante / mesesRestantes;

    let recommendation = '';
    if (obj.valor_atual >= obj.valor) {
      recommendation = 'Parabéns! Você alcançou seu objetivo!';
    } else if (valorMensal <= 0) {
      recommendation = 'Continue mantendo seus investimentos!';
    } else {
      recommendation = `Economize R$ ${valorMensal.toFixed(2)}/mês para atingir sua meta no prazo planejado.`;
    }

    return {
      id: obj.id,
      title: obj.nome,
      icon: obj.icone || '🎯',
      current: obj.valor_atual,
      target: obj.valor,
      priority: obj.prioridade,
      timeRemaining,
      recommendation,
      categoria: obj.categoria,
      status: obj.status
    };
  });

  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => (obj.current / obj.target) >= 1).length;
  const inProgressObjectives = objectives.filter(obj => obj.current > 0 && (obj.current / obj.target) < 1).length;
  const totalNeeded = objectives.reduce((sum, obj) => sum + obj.target, 0);
  const totalSaved = objectives.reduce((sum, obj) => sum + obj.current, 0);

  if (loading) {
    return (
      <AppLayout
        title="Objetivos"
        subtitle="Gerencie suas metas e acompanhe o progresso"
      >
        <div className="p-4 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando objetivos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleExportExcel = () => {
    const dadosExport = objectives.map(obj => ({
      'Objetivo': obj.title,
      'Valor Atual': obj.current,
      'Valor Meta': obj.target,
      'Progresso (%)': ((obj.current / obj.target) * 100).toFixed(2),
      'Prioridade': obj.priority,
      'Tempo Restante': obj.timeRemaining,
      'Recomendação': obj.recommendation
    }));
    exportObjetivosToExcel(dadosExport);
  };

  const handleExportPDF = async () => {
    await exportToPDF('objetivos-content', 'lifeplan-objetivos.pdf');
  };

  return (
    <AppLayout
      title="Objetivos"
      subtitle="Gerencie suas metas e acompanhe o progresso"
    >
      <div className="p-4 lg:p-8" id="objetivos-content">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
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

          {/* Filtros e Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="flex flex-col lg:flex-row lg:flex-wrap items-stretch lg:items-center gap-3 lg:gap-4">
              {/* Filtros */}
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Todos os objetivos</option>
                  <option>Curto prazo</option>
                  <option>Médio prazo</option>
                  <option>Longo prazo</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Prioridade</option>
                  <option>Alta (8-10)</option>
                  <option>Média (5-7)</option>
                  <option>Baixa (1-4)</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Status</option>
                  <option>Não iniciado</option>
                  <option>Em andamento</option>
                  <option>Concluído</option>
                </select>

                {/* Campo de Busca */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar objetivos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                <ExportButton
                  onExportExcel={handleExportExcel}
                  onExportPDF={handleExportPDF}
                />
                <button
                  onClick={() => setIsNovoObjetivoModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Objetivo
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Objetivos */}
          {objectives.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
              <div className="text-5xl lg:text-6xl mb-3 lg:mb-4">🎯</div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                Nenhum objetivo cadastrado
              </h3>
              <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
                Comece definindo seus objetivos financeiros e acompanhe seu progresso
              </p>
              <button
                onClick={() => setIsNovoObjetivoModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-primary-600 text-white text-sm lg:text-base font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                Criar Primeiro Objetivo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  title={objective.title}
                  icon={objective.icon}
                  current={objective.current}
                  target={objective.target}
                  priority={objective.priority}
                  timeRemaining={objective.timeRemaining}
                  recommendation={objective.recommendation}
                />
              ))}
            </div>
          )}

          {/* Resumo Final */}
          <div className="mt-6 lg:mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 lg:p-6 border border-primary-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Progresso Geral dos Objetivos
                </h3>
                <p className="text-sm text-primary-700 mb-4">
                  Você já economizou <span className="font-bold">R$ {totalSaved.toLocaleString('pt-BR')}</span> de
                  um total de <span className="font-bold">R$ {totalNeeded.toLocaleString('pt-BR')}</span>
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
      </div>

      {/* Modal Novo Objetivo */}
      <NovoObjetivoModal
        isOpen={isNovoObjetivoModalOpen}
        onClose={() => setIsNovoObjetivoModalOpen(false)}
      />
    </AppLayout>
  );
}

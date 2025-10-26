/**
 * ARQUIVO DE EXEMPLO - Demonstra como usar os novos componentes
 *
 * Este arquivo mostra exemplos de uso dos componentes de:
 * - Loading States
 * - Error Handling
 * - Toast Notifications
 * - Form Validation
 */

'use client';

import { useState } from 'react';
import { DashboardLoader, TableLoader, ObjectivesLoader } from '@/components/PageLoader';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { NovoObjetivoModal } from '@/components/modals/NovoObjetivoModal';

// ============= EXEMPLO 1: Loading States =============
export function ExampleLoadingStates() {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento
  setTimeout(() => setIsLoading(false), 3000);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return <div>Conteúdo carregado!</div>;
}

// ============= EXEMPLO 2: Toast Notifications =============
export function ExampleToasts() {
  const { showToast } = useToast();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Exemplos de Toast</h2>

      <div className="flex gap-4">
        <Button onClick={() => showToast('success', 'Operação realizada com sucesso!')}>
          Toast de Sucesso
        </Button>

        <Button
          variant="danger"
          onClick={() => showToast('error', 'Ocorreu um erro ao processar sua solicitação')}
        >
          Toast de Erro
        </Button>

        <Button
          variant="secondary"
          onClick={() => showToast('warning', 'Atenção: Verifique os dados antes de continuar')}
        >
          Toast de Aviso
        </Button>

        <Button
          variant="secondary"
          onClick={() => showToast('info', 'Esta é uma informação importante')}
        >
          Toast de Info
        </Button>
      </div>
    </div>
  );
}

// ============= EXEMPLO 3: Formulário com Loading e Validação =============
export function ExampleFormWithValidation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Exemplo de Formulário</h2>

      <Button onClick={() => setIsModalOpen(true)}>
        Abrir Modal de Novo Objetivo
      </Button>

      <NovoObjetivoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log('Objetivo criado com sucesso!');
        }}
      />
    </div>
  );
}

// ============= EXEMPLO 4: Fetch com Loading e Error Handling =============
export function ExampleDataFetching() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const { showToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular erro aleatório
      if (Math.random() < 0.3) {
        throw new Error('Erro ao buscar dados');
      }

      const mockData = { id: 1, name: 'Exemplo', value: 100 };
      setData(mockData);
      showToast('success', 'Dados carregados com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Exemplo de Fetch com Error Handling</h2>

      <Button onClick={fetchData} loading={isLoading} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Buscar Dados'}
      </Button>

      {isLoading && <TableLoader />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Erro: {error}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {data && !isLoading && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Dados carregados:</p>
          <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ============= EXEMPLO 5: Diferentes Tipos de Loaders =============
export function ExampleDifferentLoaders() {
  const [loaderType, setLoaderType] = useState<'dashboard' | 'table' | 'objectives'>('dashboard');

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Diferentes Tipos de Loaders</h2>

      <div className="flex gap-4 mb-6">
        <Button onClick={() => setLoaderType('dashboard')}>
          Dashboard Loader
        </Button>
        <Button onClick={() => setLoaderType('table')}>
          Table Loader
        </Button>
        <Button onClick={() => setLoaderType('objectives')}>
          Objectives Loader
        </Button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        {loaderType === 'dashboard' && <DashboardLoader />}
        {loaderType === 'table' && <TableLoader />}
        {loaderType === 'objectives' && <ObjectivesLoader />}
      </div>
    </div>
  );
}

// ============= EXEMPLO 6: Componente de Página Completo =============
export function ExampleCompletePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Simular carregamento inicial
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  const handleAction = async () => {
    try {
      showToast('info', 'Processando sua solicitação...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('success', 'Ação concluída com sucesso!');
    } catch (err) {
      showToast('error', 'Erro ao processar ação');
    }
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar página</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Página Completa</h1>
      <Button onClick={handleAction}>
        Executar Ação
      </Button>
    </div>
  );
}

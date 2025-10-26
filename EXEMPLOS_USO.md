# Exemplos Práticos de Uso - Animações LifePlan

## 1. Adicionar Toast em uma Página

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { StatCard } from '@/components/StatCard';
import { PageTransition } from '@/components/PageTransition';

export default function DashboardPage() {
  const { toasts, success, error, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Dados atualizados com sucesso!');
    } catch (e) {
      error('Erro ao atualizar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <button onClick={handleRefresh} className="btn-primary mb-6">
          Atualizar Dados
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Receitas"
            value={15000}
            change={12.5}
            animated
          />
          {/* Mais cards... */}
        </div>

        {/* Toast Container - SEMPRE no final */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </PageTransition>
  );
}
```

---

## 2. Modal com Formulário

```tsx
// components/AdicionarLancamentoButton.tsx
'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

export function AdicionarLancamentoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { success } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Salvar dados
      await api.save(data);
      success('Lançamento adicionado!');
      setIsOpen(false);
    } catch (e) {
      // Tratar erro
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        Novo Lançamento
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Novo Lançamento"
      >
        <form onSubmit={handleSubmit}>
          {/* Campos do formulário */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Descrição"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Valor"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

---

## 3. Lista com Loading e Empty State

```tsx
// app/lancamentos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { FadeIn } from '@/components/FadeIn';
import { Receipt, Plus } from 'lucide-react';

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setLancamentos([]);
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Lançamentos</h1>
        <div className="card">
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (lancamentos.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Lançamentos</h1>
        <div className="card">
          <EmptyState
            icon={<Receipt className="w-16 h-16" />}
            title="Nenhum lançamento encontrado"
            description="Comece adicionando seu primeiro lançamento financeiro"
            action={
              <button className="btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Novo Lançamento
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Lançamentos</h1>

      <FadeIn>
        <div className="card">
          {/* Lista de lançamentos */}
          {lancamentos.map((item) => (
            <div key={item.id}>{/* Item */}</div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
```

---

## 4. Confirmação antes de Deletar

```tsx
// components/DeletarButton.tsx
'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { Trash2 } from 'lucide-react';

export function DeletarButton({ id, nome }: { id: string; nome: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { success, error } = useToast();

  const handleDelete = async () => {
    try {
      await api.delete(id);
      success(`${nome} deletado com sucesso!`);
    } catch (e) {
      error('Erro ao deletar');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja deletar "${nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, deletar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
```

---

## 5. Dashboard com Números Animados

```tsx
// app/page.tsx
'use client';

import { StatCard } from '@/components/StatCard';
import { PageTransition } from '@/components/PageTransition';
import { FadeIn } from '@/components/FadeIn';
import { DollarSign, TrendingUp, Target, Wallet } from 'lucide-react';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Stats Grid com animação escalonada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FadeIn delay={0}>
            <StatCard
              label="Saldo Total"
              value={45678}
              change={8.2}
              icon={<Wallet className="w-5 h-5" />}
              animated
            />
          </FadeIn>

          <FadeIn delay={100}>
            <StatCard
              label="Receitas do Mês"
              value={15000}
              change={12.5}
              icon={<DollarSign className="w-5 h-5" />}
              animated
            />
          </FadeIn>

          <FadeIn delay={200}>
            <StatCard
              label="Despesas do Mês"
              value={8500}
              change={-3.2}
              icon={<TrendingUp className="w-5 h-5" />}
              animated
            />
          </FadeIn>

          <FadeIn delay={300}>
            <StatCard
              label="Objetivos Atingidos"
              value={3}
              change={50}
              icon={<Target className="w-5 h-5" />}
              animated
            />
          </FadeIn>
        </div>

        {/* Mais conteúdo... */}
      </div>
    </PageTransition>
  );
}
```

---

## 6. Floating Action Button

```tsx
// app/lancamentos/page.tsx
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Plus } from 'lucide-react';

export default function LancamentosPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      {/* Conteúdo da página */}

      {/* FAB para adicionar rapidamente */}
      <FloatingActionButton
        onClick={() => setShowModal(true)}
        icon={<Plus className="w-6 h-6" />}
        label="Novo"
        position="bottom-right"
      />
    </div>
  );
}
```

---

## 7. Tooltips em Botões

```tsx
import { Tooltip } from '@/components/Tooltip';
import { Info, Edit, Trash2 } from 'lucide-react';

export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Tooltip content="Ver detalhes" position="top">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Info className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content="Editar" position="top">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Edit className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content="Deletar" position="top">
        <button className="p-2 hover:bg-gray-100 rounded text-red-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </Tooltip>
    </div>
  );
}
```

---

## 8. Layout com Mobile Menu

```tsx
// app/layout.tsx
import { Sidebar } from '@/components/Sidebar';
import { MobileMenu } from '@/components/MobileMenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Mobile Menu - visível só em mobile */}
        <MobileMenu />

        {/* Sidebar - visível só em desktop */}
        <Sidebar className="hidden md:block" />

        {/* Conteúdo Principal */}
        <main className="md:ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
```

---

## 9. Progress com Animação

```tsx
// components/ObjetivoCard.tsx
import { ProgressBar } from '@/components/ProgressBar';
import { AnimatedNumber } from '@/components/AnimatedNumber';

export function ObjetivoCard({ objetivo }: { objetivo: Objetivo }) {
  const percentage = (objetivo.valorAtual / objetivo.valor) * 100;

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">{objetivo.nome}</h3>

      <div className="mb-4">
        <p className="text-2xl font-bold">
          R$ <AnimatedNumber value={objetivo.valorAtual} decimals={2} />
        </p>
        <p className="text-sm text-gray-500">
          de R$ {objetivo.valor.toFixed(2)}
        </p>
      </div>

      <ProgressBar
        current={objetivo.valorAtual}
        target={objetivo.valor}
        label={`${Math.round(percentage)}% atingido`}
      />
    </div>
  );
}
```

---

## 10. Toast Provider Global

```tsx
// app/layout.tsx
'use client';

import { createContext, useContext } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useGlobalToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useGlobalToast deve ser usado dentro de ToastProvider');
  return context;
}

// Uso:
// Wrap app com <ToastProvider>
// Em qualquer componente: const { success } = useGlobalToast();
```

---

## Dicas de Performance

1. **Use PageTransition apenas nas páginas principais**
2. **FadeIn com delay para lists grandes pode ser pesado - use com moderação**
3. **AnimatedNumber funciona bem até ~1000 items**
4. **Skeleton loading melhora perceived performance**
5. **ToastContainer global evita múltiplas instâncias**

---

## Checklist de Integração

- [ ] Adicionar ToastProvider no layout
- [ ] PageTransition nas páginas principais
- [ ] MobileMenu + Sidebar responsivo
- [ ] Loading states com Skeleton
- [ ] Empty states nas listas
- [ ] ConfirmDialog antes de deletar
- [ ] Tooltips em botões de ação
- [ ] AnimatedNumber em valores importantes
- [ ] FAB para ação principal
- [ ] Modal para formulários

---

Pronto! Com esses exemplos você pode começar a integrar as animações em todo o LifePlan! 🚀

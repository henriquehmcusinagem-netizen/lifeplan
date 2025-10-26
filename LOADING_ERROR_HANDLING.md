# Loading States e Error Handling - LifePlan

Este documento descreve todos os componentes de loading states e error handling adicionados ao projeto LifePlan.

## Índice
1. [Toast Notifications](#toast-notifications)
2. [Loading States](#loading-states)
3. [Error Boundary](#error-boundary)
4. [Componentes de UI](#componentes-de-ui)
5. [Modais com Validação](#modais-com-validação)
6. [Exemplos de Uso](#exemplos-de-uso)

---

## Toast Notifications

### ToastContext
**Arquivo:** `contexts/ToastContext.tsx`

Provedor global de notificações toast.

**Uso:**
```tsx
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('success', 'Operação realizada com sucesso!');
  };

  const handleError = () => {
    showToast('error', 'Ocorreu um erro');
  };

  return (
    <button onClick={handleSuccess}>Salvar</button>
  );
}
```

**Tipos de Toast:**
- `success` - Verde, para operações bem-sucedidas
- `error` - Vermelho, para erros
- `warning` - Amarelo, para avisos
- `info` - Azul, para informações

**Características:**
- Desaparece automaticamente após 3 segundos
- Empilhamento de múltiplos toasts
- Animação suave de entrada/saída
- Botão de fechar manual

---

## Loading States

### Page Loaders
**Arquivo:** `components/PageLoader.tsx`

Skeleton loaders para diferentes tipos de páginas.

#### DashboardLoader
```tsx
import { DashboardLoader } from '@/components/PageLoader';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return <div>Conteúdo...</div>;
}
```

#### TableLoader
```tsx
import { TableLoader } from '@/components/PageLoader';

function DataTable() {
  if (loading) return <TableLoader />;
  return <table>...</table>;
}
```

#### ObjectivesLoader
```tsx
import { ObjectivesLoader } from '@/components/PageLoader';

function ObjetivosPage() {
  if (loading) return <ObjectivesLoader />;
  return <div>...</div>;
}
```

#### FormLoader
```tsx
import { FormLoader } from '@/components/PageLoader';

function FormPage() {
  if (loading) return <FormLoader />;
  return <form>...</form>;
}
```

---

## Error Boundary

### ErrorBoundary
**Arquivo:** `components/ErrorBoundary.tsx`

Captura erros em toda a aplicação e exibe uma tela de erro amigável.

**Configuração (já feita em `app/layout.tsx`):**
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Características:**
- Captura erros não tratados
- Exibe mensagem amigável ao usuário
- Mostra detalhes técnicos do erro (em desenvolvimento)
- Botão para recarregar a página

---

## Componentes de UI

### Button
**Arquivo:** `components/ui/Button.tsx`

Botão com suporte a loading state.

```tsx
<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

**Props:**
- `loading`: boolean - Mostra spinner e desabilita botão
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

### Input
**Arquivo:** `components/ui/Input.tsx`

Input com validação inline.

```tsx
<Input
  label="Nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
  required
/>
```

**Props:**
- `label`: string
- `error`: string - Mensagem de erro
- `helperText`: string - Texto de ajuda
- `required`: boolean

### Textarea
**Arquivo:** `components/ui/Textarea.tsx`

Textarea com contador de caracteres.

```tsx
<Textarea
  label="Descrição"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  maxLength={500}
  showCounter
  error={errors.description}
/>
```

**Props:**
- `label`: string
- `error`: string
- `maxLength`: number
- `showCounter`: boolean - Mostra contador X/Y

### Select
**Arquivo:** `components/ui/Select.tsx`

Select com validação.

```tsx
<Select
  label="Categoria"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
  ]}
  error={errors.category}
/>
```

### Skeleton
**Arquivo:** `components/ui/Skeleton.tsx`

Componente base para loading skeletons.

```tsx
<Skeleton className="h-32 w-full" />
<Skeleton className="h-4 w-48" />
```

---

## Modais com Validação

### NovoObjetivoModal
**Arquivo:** `components/modals/NovoObjetivoModal.tsx`

Modal para criar novo objetivo com:
- Validação de formulário em tempo real
- Loading state no submit
- Toast de sucesso/erro
- Desabilitação do botão durante loading
- Contador de caracteres no textarea

**Uso:**
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

<Button onClick={() => setIsModalOpen(true)}>
  Novo Objetivo
</Button>

<NovoObjetivoModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={() => {
    // Atualizar lista de objetivos
  }}
/>
```

### EditarObjetivoModal
**Arquivo:** `components/modals/EditarObjetivoModal.tsx`

Similar ao NovoObjetivoModal, mas para edição.

**Uso:**
```tsx
<EditarObjetivoModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  objetivo={selectedObjetivo}
  onSuccess={() => {
    // Atualizar lista
  }}
/>
```

### NovoLancamentoModal
**Arquivo:** `components/modals/NovoLancamentoModal.tsx`

Modal para registrar receitas/despesas com:
- Seleção de tipo (receita/despesa)
- Validação de valores
- Categorias dinâmicas
- Checkbox para lançamentos recorrentes

---

## Exemplos de Uso

### Exemplo 1: Página com Loading
```tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardLoader } from '@/components/PageLoader';
import { useToast } from '@/contexts/ToastContext';

export default function MinhaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
        showToast('success', 'Dados carregados!');
      } catch (error) {
        showToast('error', 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return <div>{/* Conteúdo */}</div>;
}
```

### Exemplo 2: Formulário com Validação
```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

export default function MeuForm() {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast('error', 'Corrija os erros no formulário');
      return;
    }

    setIsLoading(true);
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      showToast('success', 'Salvo com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nome"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
        error={errors.name}
        required
      />

      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}
```

### Exemplo 3: Action com Toast
```tsx
const handleDelete = async (id) => {
  if (!confirm('Tem certeza?')) return;

  try {
    await fetch(`/api/delete/${id}`, { method: 'DELETE' });
    showToast('success', 'Item excluído com sucesso!');
    refreshData();
  } catch (error) {
    showToast('error', 'Erro ao excluir item');
  }
};
```

---

## Arquivos Criados/Modificados

### Novos Arquivos
- ✅ `contexts/ToastContext.tsx`
- ✅ `components/PageLoader.tsx`
- ✅ `components/ErrorBoundary.tsx`
- ✅ `components/ui/Textarea.tsx`
- ✅ `components/modals/NovoLancamentoModal.tsx`
- ✅ `components/examples/ExampleUsage.tsx`

### Arquivos Modificados
- ✅ `app/layout.tsx` - Adicionado ToastProvider e ErrorBoundary
- ✅ `components/modals/NovoObjetivoModal.tsx` - Adicionado toast e melhor error handling
- ✅ `components/modals/EditarObjetivoModal.tsx` - Adicionado toast e melhor error handling

### Arquivos Existentes (já estavam prontos)
- ✅ `components/ui/Button.tsx` - Já tinha loading state
- ✅ `components/ui/Input.tsx` - Já tinha validação inline
- ✅ `components/ui/Select.tsx` - Já tinha validação
- ✅ `components/ui/Toast.tsx` - Já existia
- ✅ `components/ui/Skeleton.tsx` - Já existia
- ✅ `components/ui/Modal.tsx` - Já existia

---

## Boas Práticas

### 1. Sempre use loading states
```tsx
// ❌ Ruim
const handleSave = async () => {
  await saveData();
};

// ✅ Bom
const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
    showToast('success', 'Salvo!');
  } catch (error) {
    showToast('error', 'Erro ao salvar');
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Valide em tempo real
```tsx
const handleChange = (field, value) => {
  setFormData({ ...formData, [field]: value });
  // Limpar erro quando usuário começa a digitar
  if (errors[field]) {
    setErrors({ ...errors, [field]: undefined });
  }
};
```

### 3. Desabilite botões durante loading
```tsx
<Button
  loading={isLoading}
  disabled={isLoading}
  onClick={handleAction}
>
  {isLoading ? 'Processando...' : 'Enviar'}
</Button>
```

### 4. Use toasts para feedback
```tsx
// Sucesso
showToast('success', 'Objetivo criado com sucesso!');

// Erro
showToast('error', 'Erro ao salvar. Tente novamente.');

// Aviso
showToast('warning', 'Atenção: Verifique os dados');

// Info
showToast('info', 'Processando sua solicitação...');
```

---

## Próximos Passos

Para continuar melhorando o error handling:

1. **Adicionar retry logic** para chamadas de API
2. **Implementar offline detection**
3. **Adicionar logs de erro** (Sentry, etc)
4. **Criar testes** para os componentes de erro
5. **Adicionar loading skeletons** em mais páginas
6. **Implementar optimistic updates** onde apropriado

---

## Suporte

Para dúvidas ou problemas, consulte:
- Este documento
- `components/examples/ExampleUsage.tsx` - Exemplos práticos
- Componentes individuais - Todos têm JSDoc

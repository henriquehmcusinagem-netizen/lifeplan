# Quick Start Guide - Loading States e Error Handling

Guia rápido para começar a usar os novos componentes de loading e error handling no LifePlan.

## 📋 Índice Rápido

- [Mostrar Toast](#1-mostrar-toast)
- [Adicionar Loading em Página](#2-adicionar-loading-em-página)
- [Adicionar Loading em Botão](#3-adicionar-loading-em-botão)
- [Criar Form com Validação](#4-criar-form-com-validação)
- [Usar Modal com Loading](#5-usar-modal-com-loading)
- [Handle de Erros](#6-handle-de-erros)

---

## 1. Mostrar Toast

**Use quando:** Precisar dar feedback ao usuário sobre uma ação.

```tsx
import { useToast } from '@/contexts/ToastContext';

function MeuComponente() {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showToast('success', 'Dados salvos com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao salvar dados');
    }
  };

  return <button onClick={handleSave}>Salvar</button>;
}
```

**Tipos disponíveis:**
- `'success'` - Verde (operações bem-sucedidas)
- `'error'` - Vermelho (erros)
- `'warning'` - Amarelo (avisos)
- `'info'` - Azul (informações)

---

## 2. Adicionar Loading em Página

**Use quando:** Carregar dados ao montar a página.

```tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardLoader } from '@/components/PageLoader';

export default function MinhaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return <div>Meu conteúdo: {data}</div>;
}
```

**Loaders disponíveis:**
- `DashboardLoader` - Para dashboard
- `TableLoader` - Para tabelas
- `ObjectivesLoader` - Para lista de objetivos
- `FormLoader` - Para formulários

---

## 3. Adicionar Loading em Botão

**Use quando:** Executar uma ação assíncrona.

```tsx
import { Button } from '@/components/ui/Button';

function MeuForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await enviarDados();
      showToast('success', 'Enviado!');
    } catch (error) {
      showToast('error', 'Erro ao enviar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      onClick={handleSubmit}
    >
      {isLoading ? 'Enviando...' : 'Enviar'}
    </Button>
  );
}
```

---

## 4. Criar Form com Validação

**Use quando:** Criar formulário com inputs validados.

```tsx
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

function MeuForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
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
      await saveData(formData);
      showToast('success', 'Salvo com sucesso!');
      // Reset form
      setFormData({ name: '', description: '' });
    } catch (error) {
      showToast('error', 'Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpar erro quando usuário digita
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        disabled={isLoading}
      />

      <Textarea
        label="Descrição"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        maxLength={500}
        showCounter
        rows={4}
        required
        disabled={isLoading}
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

---

## 5. Usar Modal com Loading

**Use quando:** Abrir modal para criar/editar dados.

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NovoObjetivoModal } from '@/components/modals/NovoObjetivoModal';

function MinhaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objectives, setObjectives] = useState([]);

  const handleSuccess = () => {
    // Recarregar objetivos
    loadObjectives();
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        Novo Objetivo
      </Button>

      <NovoObjetivoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Lista de objetivos */}
      {objectives.map(obj => (
        <div key={obj.id}>{obj.title}</div>
      ))}
    </div>
  );
}
```

---

## 6. Handle de Erros

**Use quando:** Fazer chamadas de API ou operações que podem falhar.

### Pattern Completo

```tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { DashboardLoader } from '@/components/PageLoader';
import { Button } from '@/components/ui/Button';

export default function MinhaPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data');

      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const result = await response.json();
      setData(result);
      showToast('success', 'Dados carregados!');
    } catch (err) {
      const errorMessage = err.message || 'Erro desconhecido';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <DashboardLoader />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Erro ao Carregar
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadData}>Tentar Novamente</Button>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">Nenhum dado encontrado</p>
        <Button onClick={loadData}>Carregar</Button>
      </div>
    );
  }

  // Success state
  return <div>Dados: {JSON.stringify(data)}</div>;
}
```

---

## 🎯 Atalhos Rápidos

### Toast Simples
```tsx
const { showToast } = useToast();
showToast('success', 'Operação realizada!');
```

### Loading Rápido
```tsx
if (isLoading) return <DashboardLoader />;
```

### Botão com Loading
```tsx
<Button loading={isLoading} disabled={isLoading}>
  Salvar
</Button>
```

### Input com Erro
```tsx
<Input
  label="Nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>
```

---

## 📚 Mais Informações

- **Documentação completa:** `LOADING_ERROR_HANDLING.md`
- **Exemplos práticos:** `components/examples/ExampleUsage.tsx`
- **Página completa:** `components/examples/PageWithLoadingExample.tsx`
- **Status:** `IMPLEMENTACAO_CONCLUIDA.md`

---

## 🔗 Componentes Disponíveis

### Contexts
- `useToast()` - Toast notifications

### UI Components
- `Button` - Botão com loading
- `Input` - Input com validação
- `Textarea` - Textarea com contador
- `Select` - Select com validação
- `Modal` - Modal base

### Loaders
- `DashboardLoader`
- `TableLoader`
- `ObjectivesLoader`
- `FormLoader`

### Modals
- `NovoObjetivoModal`
- `EditarObjetivoModal`
- `NovoLancamentoModal`

### Error Handling
- `ErrorBoundary` (já configurado no layout)

---

## ✅ Checklist de Uso

Ao criar uma nova página/feature:

- [ ] Adicionar loading state
- [ ] Usar toast para feedback
- [ ] Validar formulários
- [ ] Handle de erros (try-catch)
- [ ] Loading em botões
- [ ] Estados vazios
- [ ] Desabilitar durante loading

---

**Última atualização:** 2025-10-25

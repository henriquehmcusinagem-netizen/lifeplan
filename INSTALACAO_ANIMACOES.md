# Instalação e Configuração - Animações LifePlan

## Arquivos Criados

### Componentes UI
- `components/ui/Modal.tsx` - Modal animado com framer-motion
- `components/ui/Toast.tsx` - Sistema de toasts animados

### Componentes de Animação
- `components/PageTransition.tsx` - Transições de página
- `components/AnimatedNumber.tsx` - Números com animação de contagem
- `components/Tooltip.tsx` - Tooltips animados
- `components/MobileMenu.tsx` - Menu mobile com drawer animado
- `components/FadeIn.tsx` - Fade in e StaggeredFadeIn
- `components/LoadingSkeleton.tsx` - Skeletons de loading
- `components/EmptyState.tsx` - Estado vazio com animações
- `components/ConfirmDialog.tsx` - Diálogo de confirmação
- `components/FloatingActionButton.tsx` - FAB animado

### Showcase
- `components/AnimationShowcase.tsx` - Demonstração de todos os componentes

### Hooks
- `hooks/useToast.ts` - Hook para gerenciar toasts

### Documentação
- `README_ANIMATIONS.md` - Guia completo de uso
- `INSTALACAO_ANIMACOES.md` - Este arquivo

---

## Arquivos Modificados

### 1. `components/ui/Modal.tsx`
✅ Adicionado AnimatePresence e motion do framer-motion
✅ Animações de entrada e saída
✅ Suporte a dark mode

### 2. `components/ui/Toast.tsx`
✅ Refatorado para usar framer-motion
✅ Criado ToastContainer component
✅ Suporte a dark mode

### 3. `components/StatCard.tsx`
✅ Adicionado suporte a AnimatedNumber
✅ Prop `animated` para ativar animação
✅ Hover effects nos ícones
✅ Dark mode completo

### 4. `components/Sidebar.tsx`
✅ Adicionado prop className para suporte mobile
✅ Melhorado overflow-y-auto
✅ Transições suaves
✅ Hover state na seção do usuário

### 5. `app/globals.css`
✅ Smooth scroll
✅ Focus visible para acessibilidade
✅ Active scale nos botões
✅ Animações customizadas:
  - shimmer (loading)
  - fadeIn
  - slideUp
  - pulseSoft
  - skeleton

---

## Como Usar

### 1. Toasts em qualquer página

```tsx
'use client';

import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

export default function MyPage() {
  const { toasts, success, error, removeToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('Dados salvos com sucesso!');
    } catch (e) {
      error('Erro ao salvar dados');
    }
  };

  return (
    <>
      <button onClick={handleSave}>Salvar</button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

### 2. Modal em qualquer componente

```tsx
'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Meu Modal">
        <div>Conteúdo do modal</div>
      </Modal>
    </>
  );
}
```

### 3. Números animados em cards

```tsx
import { StatCard } from '@/components/StatCard';
import { DollarSign } from 'lucide-react';

<StatCard
  label="Receitas"
  value={15000}
  change={12.5}
  icon={<DollarSign className="w-5 h-5" />}
  animated  // Ativa animação
/>
```

### 4. Loading states

```tsx
import { StatCardSkeleton, TableSkeleton } from '@/components/LoadingSkeleton';

{isLoading ? (
  <StatCardSkeleton />
) : (
  <StatCard {...props} />
)}
```

### 5. Empty states

```tsx
import { EmptyState } from '@/components/EmptyState';
import { Inbox } from 'lucide-react';

{items.length === 0 && (
  <EmptyState
    icon={<Inbox className="w-16 h-16" />}
    title="Nenhum item encontrado"
    description="Comece adicionando um novo item"
    action={<button onClick={handleAdd}>Adicionar</button>}
  />
)}
```

### 6. FAB para ações rápidas

```tsx
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Plus } from 'lucide-react';

<FloatingActionButton
  onClick={handleQuickAdd}
  icon={<Plus className="w-6 h-6" />}
  label="Adicionar"
  position="bottom-right"
/>
```

### 7. Mobile Menu

No layout principal:

```tsx
import { MobileMenu } from '@/components/MobileMenu';

<MobileMenu />
<Sidebar className="hidden md:block" />
```

---

## Testando

### Ver todos os componentes em ação:

1. Crie uma rota de teste (opcional):

```tsx
// app/showcase/page.tsx
import { AnimationShowcase } from '@/components/AnimationShowcase';

export default function ShowcasePage() {
  return <AnimationShowcase />;
}
```

2. Acesse `/showcase` para ver todos os componentes

---

## Classes CSS Disponíveis

```css
/* Animações */
.animate-shimmer    /* Loading shimmer */
.animate-fadeIn     /* Fade in suave */
.animate-slideUp    /* Slide up */
.animate-pulseSoft  /* Pulse suave */

/* Skeleton */
.skeleton           /* Loading skeleton com shimmer */

/* Estados */
.card:hover         /* Hover com elevação */
active:scale-95     /* Feedback tátil em botões */
```

---

## Dependências

Já instaladas:
- ✅ framer-motion@12.23.24
- ✅ lucide-react (ícones)
- ✅ tailwindcss

---

## Próximas Integrações Sugeridas

1. **Dashboard** (`app/page.tsx`):
   - Adicionar PageTransition
   - StatCards com animated={true}
   - Toasts para feedback de ações

2. **Formulários**:
   - Modal para adicionar/editar
   - Toast de sucesso/erro
   - ConfirmDialog antes de deletar

3. **Listas**:
   - LoadingSkeleton enquanto carrega
   - EmptyState quando vazio
   - FadeIn para itens

4. **Mobile**:
   - MobileMenu no layout
   - FloatingActionButton para ação principal

---

## Personalização

### Cores (tailwind.config.ts)

```js
colors: {
  primary: {
    50: '#f0f9ff',
    // ...
    600: '#2563eb',  // Cor principal dos botões e highlights
  }
}
```

### Durações de Animação

Editar em cada componente:
- Modal: 0.2s
- Toast: 0.2s
- AnimatedNumber: 1s (configurável)
- PageTransition: 0.3s

---

## Performance

- Animações usam GPU acceleration
- Framer Motion faz lazy loading
- AnimatedNumber usa requestAnimationFrame
- Skeletons evitam layout shift

---

## Suporte

Para mais informações, consulte:
- `README_ANIMATIONS.md` - Guia de uso detalhado
- `components/AnimationShowcase.tsx` - Exemplos práticos

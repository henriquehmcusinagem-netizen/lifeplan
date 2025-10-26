# Guia de Animações e Componentes - LifePlan

Este documento descreve todos os componentes animados e utilitários de polish adicionados ao LifePlan.

## Componentes Principais

### 1. Modal (`components/ui/Modal.tsx`)
Modal animado com framer-motion, backdrop blur e transições suaves.

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose} title="Título">
  Conteúdo do modal
</Modal>
```

**Animações:**
- Fade in/out do backdrop
- Scale + slide up da janela modal
- Suporte a ESC para fechar
- Previne scroll do body quando aberto

---

### 2. Toast (`components/ui/Toast.tsx`)
Sistema de notificações com animações de slide.

```tsx
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

function MyComponent() {
  const { toasts, success, error, info, warning, removeToast } = useToast();

  return (
    <>
      <button onClick={() => success('Sucesso!')}>Mostrar Toast</button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

**Variantes:** success, error, info, warning

---

### 3. AnimatedNumber (`components/AnimatedNumber.tsx`)
Contador animado para valores numéricos.

```tsx
import { AnimatedNumber } from '@/components/AnimatedNumber';

<AnimatedNumber value={1500} duration={1000} decimals={2} prefix="R$ " />
```

**Props:**
- `value`: número a ser exibido
- `duration`: duração da animação (ms)
- `decimals`: casas decimais
- `prefix/suffix`: texto antes/depois

---

### 4. StatCard (`components/StatCard.tsx`)
Card de estatística com suporte a números animados.

```tsx
import { StatCard } from '@/components/StatCard';
import { DollarSign } from 'lucide-react';

<StatCard
  label="Receitas"
  value={15000}
  change={12.5}
  icon={<DollarSign />}
  animated
/>
```

---

### 5. PageTransition (`components/PageTransition.tsx`)
Wrapper para transições de página.

```tsx
import { PageTransition } from '@/components/PageTransition';

<PageTransition>
  <div>Conteúdo da página</div>
</PageTransition>
```

---

### 6. Tooltip (`components/Tooltip.tsx`)
Tooltip animado com posicionamento flexível.

```tsx
import { Tooltip } from '@/components/Tooltip';

<Tooltip content="Dica útil" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Posições:** top, bottom, left, right

---

### 7. MobileMenu (`components/MobileMenu.tsx`)
Menu hamburguer para mobile com sidebar animada.

```tsx
import { MobileMenu } from '@/components/MobileMenu';

<MobileMenu />
```

---

### 8. LoadingSkeleton (`components/LoadingSkeleton.tsx`)
Skeletons para estados de loading.

```tsx
import { LoadingSkeleton, StatCardSkeleton, TableSkeleton } from '@/components/LoadingSkeleton';

<LoadingSkeleton variant="card" />
<StatCardSkeleton />
<TableSkeleton rows={5} />
```

**Variantes:** text, card, circle, rect

---

### 9. FadeIn (`components/FadeIn.tsx`)
Componente de fade in com delay.

```tsx
import { FadeIn, StaggeredFadeIn } from '@/components/FadeIn';

<FadeIn delay={100}>
  <div>Conteúdo</div>
</FadeIn>

<StaggeredFadeIn delay={100}>
  {items.map(item => <Card key={item.id} />)}
</StaggeredFadeIn>
```

---

### 10. EmptyState (`components/EmptyState.tsx`)
Estado vazio com animações.

```tsx
import { EmptyState } from '@/components/EmptyState';
import { Inbox } from 'lucide-react';

<EmptyState
  icon={<Inbox className="w-16 h-16" />}
  title="Nenhum item"
  description="Adicione seu primeiro item"
  action={<button>Adicionar</button>}
/>
```

---

### 11. ConfirmDialog (`components/ConfirmDialog.tsx`)
Diálogo de confirmação animado.

```tsx
import { ConfirmDialog } from '@/components/ConfirmDialog';

<ConfirmDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Confirmar"
  description="Tem certeza?"
  variant="danger"
/>
```

**Variantes:** danger, warning, info

---

### 12. FloatingActionButton (`components/FloatingActionButton.tsx`)
Botão flutuante com animações.

```tsx
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Plus } from 'lucide-react';

<FloatingActionButton
  onClick={handleAdd}
  icon={<Plus />}
  label="Adicionar"
  position="bottom-right"
/>
```

---

## Classes CSS Utilitárias

### Animações Customizadas (globals.css)

```css
/* Shimmer para loading */
.animate-shimmer

/* Fade in */
.animate-fadeIn

/* Slide up */
.animate-slideUp

/* Pulse suave */
.animate-pulseSoft

/* Skeleton */
.skeleton
```

### Modificadores de Botões

```css
/* Active scale feedback */
.btn-primary, .btn-secondary {
  @apply active:scale-95;
}
```

### Acessibilidade

```css
/* Focus outline */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary-500 rounded;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

---

## Hook useToast

```tsx
const {
  toasts,        // Array de toasts ativos
  showToast,     // Função genérica
  success,       // Toast de sucesso
  error,         // Toast de erro
  info,          // Toast de info
  warning,       // Toast de aviso
  removeToast    // Remove toast por ID
} = useToast();
```

---

## Exemplo Completo

Ver `components/AnimationShowcase.tsx` para uma demonstração completa de todos os componentes e animações.

---

## Responsividade

Todos os componentes foram projetados com dark mode e responsividade:

- **Mobile:** Menu hamburguer animado
- **Desktop:** Sidebar fixa
- **Dark Mode:** Todas as cores adaptadas
- **Acessibilidade:** Focus states e ARIA labels

---

## Performance

- Framer Motion com lazy loading
- AnimatedNumber usa `requestAnimationFrame`
- Transições suaves com GPU acceleration
- Skeleton loading para feedback imediato

---

## Próximos Passos

1. Integrar PageTransition nas páginas
2. Adicionar toasts em ações do usuário
3. Usar LoadingSkeleton em chamadas de API
4. Implementar EmptyState nas listagens
5. Adicionar FloatingActionButton para ações rápidas

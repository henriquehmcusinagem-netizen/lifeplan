# LifePlan - Gestão Estratégica Financeira

Sistema inteligente de gestão financeira e planejamento de vida que conecta sua situação financeira atual com seus objetivos de longo prazo.

## Funcionalidades

- 📊 Dashboard com visão geral financeira
- 🎯 Gestão de objetivos e metas
- 💰 Controle de patrimônio
- 📈 Análises e simulações de cenários
- 🤖 Recomendações inteligentes baseadas em IA

## Stack Tecnológica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Gráficos:** Recharts

## Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
lifeplan/
├── app/                  # App Router (Next.js 15)
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Dashboard
│   └── globals.css      # Estilos globais
├── components/          # Componentes React
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── StatCard.tsx
│   ├── ProgressBar.tsx
│   ├── Badge.tsx
│   ├── ObjectiveCard.tsx
│   └── AlertCard.tsx
├── lib/                 # Utilitários
│   └── utils.ts
└── public/             # Arquivos estáticos
```

## Design System

- **Cores Principais:**
  - Primary (Azul): #3b82f6
  - Success (Verde): #22c55e
  - Warning (Amarelo): #eab308
  - Danger (Vermelho): #ef4444

- **Tipografia:** Inter (Google Fonts)
- **Espaçamento:** Sistema baseado em 4px
- **Border Radius:** 8px, 12px, 16px

## Próximos Passos

- [ ] Integração com dados reais da planilha Excel
- [ ] Página de Objetivos
- [ ] Página de Patrimônio
- [ ] Simulador de Cenários
- [ ] Algoritmo de otimização
- [ ] Integração com IA (OpenAI/Claude)

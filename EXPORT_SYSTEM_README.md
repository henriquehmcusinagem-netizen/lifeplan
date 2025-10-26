# Sistema de Exportação de Relatórios - LifePlan

## Arquivos Criados

### 1. lib/export-excel.ts
Biblioteca para exportação de dados para Excel (XLSX).

**Funções:**
- `exportLancamentosToExcel(dados)` - Exporta lançamentos financeiros
- `exportObjetivosToExcel(objetivos)` - Exporta objetivos
- `exportPatrimonioToExcel(ativos)` - Exporta patrimônio

**Recursos:**
- Formata headers com negrito e fundo cinza
- Gera arquivos .xlsx prontos para download
- Suporta múltiplas sheets

### 2. lib/export-pdf.ts
Biblioteca para exportação de relatórios em PDF.

**Funções:**
- `exportToPDF(elementId, filename)` - Exporta elemento HTML para PDF
- `generateAnalisesPDF(dados)` - Gera PDF com análises financeiras

**Recursos:**
- Conversão de HTML para imagem via html2canvas
- Geração de PDFs formatados
- Layout A4 otimizado

### 3. components/ExportButton.tsx
Componente de botão de exportação com modal.

**Props:**
- `onExportExcel: () => void` - Callback para exportar Excel
- `onExportPDF: () => void` - Callback para exportar PDF

**Recursos:**
- Modal interativo
- Ícones para cada formato
- Interface intuitiva

## Páginas Atualizadas

### 1. app/lancamentos/page.tsx
**Adições:**
- Import das funções de exportação
- Função `handleExportExcel()` - prepara dados de lançamentos
- Função `handleExportPDF()` - exporta visualização
- Componente `<ExportButton />` substituindo botão antigo
- ID `lancamentos-content` para PDF

**Dados exportados:**
- Mês, Receitas, Despesas, Resultado

### 2. app/analises/page.tsx
**Adições:**
- Import das funções de exportação
- Função `handleExportExcel()` - placeholder para análises
- Função `handleExportPDF()` - gera PDF com dados resumidos
- Componente `<ExportButton />` no topo da página
- ID `analises-content` para PDF

**Dados exportados:**
- Receitas, Despesas, Resultado totais
- Data de geração

### 3. app/objetivos/page.tsx
**Adições:**
- Import das funções de exportação
- Função `handleExportExcel()` - prepara dados de objetivos
- Função `handleExportPDF()` - exporta visualização
- Componente `<ExportButton />` na área de ações
- ID `objetivos-content` para PDF

**Dados exportados:**
- Objetivo, Valor Atual, Valor Meta, Progresso (%), Prioridade, Tempo Restante, Recomendação

## Dependências Utilizadas

Todas as dependências já estão instaladas no package.json:
- `xlsx@0.18.5` - Geração de arquivos Excel
- `jspdf@3.0.3` - Geração de PDFs
- `html2canvas@1.4.1` - Captura de elementos HTML

## Como Usar

### No código:
```typescript
import { ExportButton } from '@/components/ExportButton';
import { exportLancamentosToExcel } from '@/lib/export-excel';
import { exportToPDF } from '@/lib/export-pdf';

const handleExportExcel = () => {
  const dados = [...]; // seus dados
  exportLancamentosToExcel(dados);
};

const handleExportPDF = async () => {
  await exportToPDF('elemento-id', 'nome-arquivo.pdf');
};

<ExportButton onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
```

### Para o usuário:
1. Clicar no botão "Exportar"
2. Escolher formato (Excel ou PDF)
3. Arquivo é baixado automaticamente

## Localização dos Arquivos

```
C:\Users\conta\OneDrive\Área de Trabalho\lifeplan\
├── lib/
│   ├── export-excel.ts     ✅ CRIADO
│   └── export-pdf.ts       ✅ CRIADO
├── components/
│   └── ExportButton.tsx    ✅ CRIADO
└── app/
    ├── lancamentos/
    │   └── page.tsx        ✅ ATUALIZADO
    ├── analises/
    │   └── page.tsx        ✅ ATUALIZADO
    └── objetivos/
        └── page.tsx        ✅ ATUALIZADO
```

## Recursos Implementados

✅ Exportação de lançamentos para Excel
✅ Exportação de objetivos para Excel
✅ Exportação de patrimônio para Excel (função pronta)
✅ Exportação de análises para PDF
✅ Exportação de visualizações HTML para PDF
✅ Componente de botão reutilizável
✅ Modal interativo para seleção de formato
✅ Integração com todas as páginas principais

## Próximos Passos (Opcional)

- Adicionar mais formatação aos PDFs
- Implementar exportação de gráficos
- Adicionar opções de personalização (período, filtros)
- Implementar preview antes de exportar
- Adicionar exportação em outros formatos (CSV, JSON)

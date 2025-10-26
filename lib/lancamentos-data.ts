// Estrutura completa de categorias de lançamentos financeiros

export interface CategoriaLancamento {
  nome: string;
  icon: string;
  valores: number[]; // 12 meses
  tipo: 'receita' | 'despesa';
  grupo: string;
}

// ✅ RECEITAS
export const receitasCategorias: CategoriaLancamento[] = [
  {
    nome: 'Salário',
    icon: '💼',
    valores: [11600, 11600, 11600, 11600, 11600, 11600, 11600, 11600, 11600, 11600, 11600, 11600],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Aluguéis',
    icon: '🏠',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Bônus ou comissão mensal',
    icon: '💰',
    valores: [0, 0, 0, 0, 6080, 4600, 11379, 0, 0, 0, 4000, 4000],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Retirada de lucro da empresa',
    icon: '🏢',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20000],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: '13º salário',
    icon: '🎁',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Férias remuneradas',
    icon: '🏖️',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Participação nos lucros (PLR)',
    icon: '📊',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
  {
    nome: 'Venda de veículo ou bem',
    icon: '🚗',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'receita',
    grupo: 'Entradas Mensais'
  },
];

// ✅ DESPESAS

// 1. GASTOS MENSAIS FIXOS
export const gastosFixos: CategoriaLancamento[] = [
  {
    nome: 'Aluguel ou parcela do financiamento',
    icon: '🏠',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Condomínio',
    icon: '🏢',
    valores: [350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'IPTU',
    icon: '📄',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Conta de luz',
    icon: '💡',
    valores: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Conta de água',
    icon: '💧',
    valores: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Internet / Wi-Fi',
    icon: '📡',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Netflix',
    icon: '📺',
    valores: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Amazon Prime',
    icon: '📦',
    valores: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Spotify / YouTube Premium',
    icon: '🎵',
    valores: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Celular (plano)',
    icon: '📱',
    valores: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Backup em nuvem',
    icon: '☁️',
    valores: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Gás de cozinha',
    icon: '🔥',
    valores: [0, 120, 0, 0, 120, 0, 0, 120, 0, 0, 120, 0],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Faxineira ou diarista',
    icon: '🧹',
    valores: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Segurança / Monitoramento',
    icon: '🔒',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
  {
    nome: 'Jardinagem',
    icon: '🌿',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Gastos Mensais Fixos'
  },
];

// 🛒 MERCADO E CONSUMO
export const mercadoConsumo: CategoriaLancamento[] = [
  {
    nome: 'Compras de mercado',
    icon: '🛒',
    valores: [2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
  {
    nome: 'Marmitas',
    icon: '🍱',
    valores: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
  {
    nome: 'Feira / Hortifruti',
    icon: '🥬',
    valores: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
  {
    nome: 'Padaria',
    icon: '🥖',
    valores: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
  {
    nome: 'Açougue',
    icon: '🥩',
    valores: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
  {
    nome: 'Produtos de higiene e limpeza',
    icon: '🧴',
    valores: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
    tipo: 'despesa',
    grupo: 'Mercado e Consumo'
  },
];

// 👧 FILHAS (EDUCAÇÃO E CUIDADOS)
export const filhas: CategoriaLancamento[] = [
  {
    nome: 'Mensalidade escolar',
    icon: '🏫',
    valores: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Transporte escolar',
    icon: '🚌',
    valores: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Aula de Inglês',
    icon: '🇬🇧',
    valores: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Aula Teclado Música',
    icon: '🎹',
    valores: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Aula Natação / Personal',
    icon: '🏊',
    valores: [280, 280, 280, 280, 280, 280, 280, 280, 280, 280, 280, 280],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Plano de saúde da criança',
    icon: '⚕️',
    valores: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Dentista',
    icon: '🦷',
    valores: [0, 150, 0, 150, 0, 150, 0, 150, 0, 150, 0, 150],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Presentes e mesadas',
    icon: '🎁',
    valores: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Matrícula escolar',
    icon: '📝',
    valores: [0, 1500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Material escolar',
    icon: '✏️',
    valores: [0, 600, 0, 0, 0, 0, 0, 600, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Uniforme Escolar',
    icon: '👕',
    valores: [0, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Livros',
    icon: '📚',
    valores: [0, 150, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Passeios e excursões escolares',
    icon: '🎒',
    valores: [0, 0, 0, 200, 0, 0, 0, 0, 0, 200, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
  {
    nome: 'Festas de aniversário (Rebeca, Ísis)',
    icon: '🎂',
    valores: [0, 0, 0, 800, 0, 0, 0, 0, 1000, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Filhas (Educação e Cuidados)'
  },
];

// 🚗 VEÍCULOS
export const veiculos: CategoriaLancamento[] = [
  {
    nome: 'Uber',
    icon: '🚕',
    valores: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Combustível',
    icon: '⛽',
    valores: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Estacionamento / Pedágio',
    icon: '🅿️',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Lavagem de carro',
    icon: '🚿',
    valores: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Manutenção preventiva',
    icon: '🔧',
    valores: [0, 0, 300, 0, 0, 300, 0, 0, 300, 0, 0, 300],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Seguro do carro',
    icon: '🛡️',
    valores: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
  {
    nome: 'Licenciamento',
    icon: '📋',
    valores: [0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Veículos'
  },
];

// 🩺 SAÚDE
export const saude: CategoriaLancamento[] = [
  {
    nome: 'Plano de saúde',
    icon: '🏥',
    valores: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Medicamentos',
    icon: '💊',
    valores: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Terapias (psicólogo, fono, fisioterapia)',
    icon: '🧠',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Suplementos',
    icon: '💪',
    valores: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Exames laboratoriais',
    icon: '🔬',
    valores: [0, 0, 0, 400, 0, 0, 0, 0, 0, 400, 0, 0],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Nutricionista',
    icon: '🥗',
    valores: [0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Tirzepatida',
    icon: '💉',
    valores: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
  {
    nome: 'Médico de Performance',
    icon: '⚡',
    valores: [0, 0, 0, 600, 0, 0, 0, 0, 0, 600, 0, 0],
    tipo: 'despesa',
    grupo: 'Saúde'
  },
];

// 🏋️ ATIVIDADES FÍSICAS
export const atividadesFisicas: CategoriaLancamento[] = [
  {
    nome: 'Academia / Personal',
    icon: '🏋️',
    valores: [350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350, 350],
    tipo: 'despesa',
    grupo: 'Atividades Físicas'
  },
  {
    nome: 'Suplementos esportivos',
    icon: '🥤',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Atividades Físicas'
  },
  {
    nome: 'Equipamentos',
    icon: '⚙️',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Atividades Físicas'
  },
];

// 📚 DESENVOLVIMENTO / ESPIRITUALIDADE
export const desenvolvimento: CategoriaLancamento[] = [
  {
    nome: 'Livros',
    icon: '📖',
    valores: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    tipo: 'despesa',
    grupo: 'Desenvolvimento / Espiritualidade'
  },
  {
    nome: 'Cursos e mentorias',
    icon: '🎓',
    valores: [0, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Desenvolvimento / Espiritualidade'
  },
  {
    nome: 'Ferramentas de estudo (ChatGPT, Canva, Notion)',
    icon: '🔧',
    valores: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
    tipo: 'despesa',
    grupo: 'Desenvolvimento / Espiritualidade'
  },
  {
    nome: 'Aplicativos pagos',
    icon: '📱',
    valores: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    tipo: 'despesa',
    grupo: 'Desenvolvimento / Espiritualidade'
  },
  {
    nome: 'Doações / dízimo',
    icon: '🙏',
    valores: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    tipo: 'despesa',
    grupo: 'Desenvolvimento / Espiritualidade'
  },
];

// 🎉 LAZER / VIDA SOCIAL
export const lazer: CategoriaLancamento[] = [
  {
    nome: 'Saídas em família (restaurantes, cinema, parque)',
    icon: '👨‍👩‍👧‍👧',
    valores: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
    tipo: 'despesa',
    grupo: 'Lazer / Vida Social'
  },
  {
    nome: 'Saídas de Lancha / Jet Sky',
    icon: '🚤',
    valores: [0, 0, 0, 0, 800, 0, 0, 800, 0, 0, 800, 0],
    tipo: 'despesa',
    grupo: 'Lazer / Vida Social'
  },
  {
    nome: 'Delivery / iFood',
    icon: '🍕',
    valores: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
    tipo: 'despesa',
    grupo: 'Lazer / Vida Social'
  },
  {
    nome: 'Datas comemorativas',
    icon: '🎂',
    valores: [0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500],
    tipo: 'despesa',
    grupo: 'Lazer / Vida Social'
  },
  {
    nome: 'Presentes para amigos/família',
    icon: '🎁',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Lazer / Vida Social'
  },
];

// 🛠️ MANUTENÇÃO DA CASA
export const manutencaoCasa: CategoriaLancamento[] = [
  {
    nome: 'Limpeza da Piscina',
    icon: '🏊',
    valores: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    tipo: 'despesa',
    grupo: 'Manutenção da Casa'
  },
  {
    nome: 'Insumos limpeza Piscina',
    icon: '🧪',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Manutenção da Casa'
  },
  {
    nome: 'Reparos imprevistos',
    icon: '🔨',
    valores: [0, 0, 300, 0, 0, 0, 400, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Manutenção da Casa'
  },
  {
    nome: 'Pintura / conserto de eletrodomésticos',
    icon: '🎨',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Manutenção da Casa'
  },
  {
    nome: 'Mão de obra (Pedreiro, encanador, eletricista)',
    icon: '👷',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Manutenção da Casa'
  },
];

// 🧍 PESSOAIS
export const pessoais: CategoriaLancamento[] = [
  {
    nome: 'Cabeleireiro / Barbeiro / Estética',
    icon: '💇',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Pessoais'
  },
  {
    nome: 'Roupas e calçados',
    icon: '👗',
    valores: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
    tipo: 'despesa',
    grupo: 'Pessoais'
  },
  {
    nome: 'Cosméticos e cuidados pessoais',
    icon: '💄',
    valores: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    tipo: 'despesa',
    grupo: 'Pessoais'
  },
];

// ✈️ VIAGENS E FÉRIAS
export const viagens: CategoriaLancamento[] = [
  {
    nome: 'Passagens aéreas',
    icon: '✈️',
    valores: [0, 0, 0, 0, 0, 0, 2000, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
  {
    nome: 'Hospedagem',
    icon: '🏨',
    valores: [0, 0, 0, 0, 0, 0, 1500, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
  {
    nome: 'Alimentação em viagem',
    icon: '🍽️',
    valores: [0, 0, 0, 0, 0, 0, 800, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
  {
    nome: 'Ingressos (parques, atrações)',
    icon: '🎢',
    valores: [0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
  {
    nome: 'Seguro viagem',
    icon: '🛡️',
    valores: [0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
  {
    nome: 'Presentes de Natal e Fim de Ano',
    icon: '🎄',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1200],
    tipo: 'despesa',
    grupo: 'Viagens e Férias'
  },
];

// 📅 TAXAS E OBRIGAÇÕES
export const taxasObrigacoes: CategoriaLancamento[] = [
  {
    nome: 'IPVA',
    icon: '🚗',
    valores: [0, 0, 450, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Licenciamento de veículos',
    icon: '📋',
    valores: [0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Cartório',
    icon: '📜',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Passaporte',
    icon: '🛂',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Documento Nacionalidade Portuguesa',
    icon: '🇵🇹',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Anúncio OLX',
    icon: '📣',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Seguro residencial',
    icon: '🏠',
    valores: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Seguro de vida',
    icon: '🛡️',
    valores: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Despesas com sala comercial',
    icon: '🏢',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Taxas bancárias e financeiras',
    icon: '🏦',
    valores: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Anuidade de cartão de crédito',
    icon: '💳',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
  {
    nome: 'Vacinas particulares',
    icon: '💉',
    valores: [0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Taxas e Obrigações'
  },
];

// 👨‍👩‍👧 DESPESAS COM FAMILIARES
export const familiaresExtendidos: CategoriaLancamento[] = [
  {
    nome: 'Ajuda financeira a parentes',
    icon: '💝',
    valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tipo: 'despesa',
    grupo: 'Despesas com Familiares'
  },
  {
    nome: 'Presentes de aniversário de familiares',
    icon: '🎁',
    valores: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    tipo: 'despesa',
    grupo: 'Despesas com Familiares'
  },
];

// Consolidar todas as categorias
export const todasCategorias: CategoriaLancamento[] = [
  ...receitasCategorias,
  ...gastosFixos,
  ...mercadoConsumo,
  ...filhas,
  ...veiculos,
  ...saude,
  ...atividadesFisicas,
  ...desenvolvimento,
  ...lazer,
  ...manutencaoCasa,
  ...pessoais,
  ...viagens,
  ...taxasObrigacoes,
  ...familiaresExtendidos,
];

// Agrupar por grupo
export const categoriasPorGrupo = todasCategorias.reduce((acc, cat) => {
  if (!acc[cat.grupo]) {
    acc[cat.grupo] = [];
  }
  acc[cat.grupo].push(cat);
  return acc;
}, {} as Record<string, CategoriaLancamento[]>);

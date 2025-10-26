import { z } from 'zod';

// Schema para Objetivo
export const objetivoSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  valor: z.number()
    .positive('Valor deve ser positivo')
    .min(1, 'Valor mínimo é R$ 1'),
  prioridade: z.number()
    .min(1, 'Prioridade mínima é 1')
    .max(10, 'Prioridade máxima é 10'),
  prazo: z.date(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  icone: z.string().optional(),
  valorAtual: z.number().min(0, 'Valor atual não pode ser negativo').optional().default(0),
});

export type ObjetivoFormData = z.infer<typeof objetivoSchema>;

// Schema para Lançamento
export const lancamentoSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valor: z.number()
    .positive('Valor deve ser positivo')
    .min(0.01, 'Valor mínimo é R$ 0,01'),
  data: z.date(),
  descricao: z.string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  recorrente: z.boolean().optional().default(false),
  parcelas: z.number().min(1).max(360).optional(),
});

export type LancamentoFormData = z.infer<typeof lancamentoSchema>;

// Schema base para Ativo
const ativoBaseSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  valorEstimado: z.number().positive('Valor deve ser positivo'),
  vendabilidade: z.enum(['vendavel', 'condicional', 'nao_vendavel']),
  descricao: z.string().max(500, 'Descrição muito longa').optional(),
});

// Schema específico para Imóvel
export const imovelSchema = ativoBaseSchema.extend({
  tipo: z.literal('imovel'),
  endereco: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  metragem: z.number().positive('Metragem deve ser positiva'),
  ano: z.number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano não pode ser futuro'),
  tipoImovel: z.enum(['casa', 'apartamento', 'terreno', 'comercial', 'outro']),
});

// Schema específico para Veículo
export const veiculoSchema = ativoBaseSchema.extend({
  tipo: z.literal('veiculo'),
  modelo: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  placa: z.string()
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, 'Placa inválida (formato: ABC1D23)')
    .optional(),
  ano: z.number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  tipoVeiculo: z.enum(['carro', 'moto', 'caminhao', 'outro']),
});

// Schema específico para Investimento
export const investimentoSchema = ativoBaseSchema.extend({
  tipo: z.literal('investimento'),
  tipoInvestimento: z.enum(['renda_fixa', 'renda_variavel', 'cripto', 'outro']),
  rentabilidadeAnual: z.number()
    .min(-100, 'Rentabilidade mínima é -100%')
    .max(1000, 'Rentabilidade máxima é 1000%')
    .optional(),
  instituicao: z.string().min(2, 'Nome da instituição muito curto').optional(),
});

// Schema unificado para Ativo
export const ativoSchema = z.discriminatedUnion('tipo', [
  imovelSchema,
  veiculoSchema,
  investimentoSchema,
]);

export type AtivoFormData = z.infer<typeof ativoSchema>;
export type ImovelFormData = z.infer<typeof imovelSchema>;
export type VeiculoFormData = z.infer<typeof veiculoSchema>;
export type InvestimentoFormData = z.infer<typeof investimentoSchema>;

// ✅ CATEGORIAS DE RECEITAS
export const categoriasReceita = [
  { value: 'salario', label: '💼 Salário', grupo: 'Entradas Mensais' },
  { value: 'alugueis', label: '🏠 Aluguéis', grupo: 'Entradas Mensais' },
  { value: 'bonus', label: '💰 Bônus ou comissão mensal', grupo: 'Entradas Mensais' },
  { value: 'lucro_empresa', label: '🏢 Retirada de lucro da empresa', grupo: 'Entradas Mensais' },
  { value: '13salario', label: '🎁 13º salário', grupo: 'Entradas Mensais' },
  { value: 'ferias', label: '🏖️ Férias remuneradas', grupo: 'Entradas Mensais' },
  { value: 'plr', label: '📊 Participação nos lucros (PLR)', grupo: 'Entradas Mensais' },
  { value: 'venda_bem', label: '🚗 Venda de veículo ou bem', grupo: 'Entradas Mensais' },
];

// ✅ CATEGORIAS DE DESPESAS ORGANIZADAS
export const categoriasDespesa = [
  // 🏠 GASTOS MENSAIS FIXOS
  { value: 'aluguel', label: '🏠 Aluguel ou financiamento', grupo: 'Gastos Mensais Fixos' },
  { value: 'condominio', label: '🏢 Condomínio', grupo: 'Gastos Mensais Fixos' },
  { value: 'iptu', label: '📄 IPTU', grupo: 'Gastos Mensais Fixos' },
  { value: 'luz', label: '💡 Conta de luz', grupo: 'Gastos Mensais Fixos' },
  { value: 'agua', label: '💧 Conta de água', grupo: 'Gastos Mensais Fixos' },
  { value: 'internet', label: '📡 Internet / Wi-Fi', grupo: 'Gastos Mensais Fixos' },
  { value: 'netflix', label: '📺 Netflix', grupo: 'Gastos Mensais Fixos' },
  { value: 'amazon', label: '📦 Amazon Prime', grupo: 'Gastos Mensais Fixos' },
  { value: 'spotify', label: '🎵 Spotify / YouTube Premium', grupo: 'Gastos Mensais Fixos' },
  { value: 'celular', label: '📱 Celular (plano)', grupo: 'Gastos Mensais Fixos' },
  { value: 'backup_nuvem', label: '☁️ Backup em nuvem', grupo: 'Gastos Mensais Fixos' },
  { value: 'gas', label: '🔥 Gás de cozinha', grupo: 'Gastos Mensais Fixos' },
  { value: 'diarista', label: '🧹 Faxineira ou diarista', grupo: 'Gastos Mensais Fixos' },
  { value: 'seguranca', label: '🔒 Segurança / Monitoramento', grupo: 'Gastos Mensais Fixos' },
  { value: 'jardinagem', label: '🌿 Jardinagem', grupo: 'Gastos Mensais Fixos' },

  // 🛒 MERCADO E CONSUMO
  { value: 'mercado', label: '🛒 Compras de mercado', grupo: 'Mercado e Consumo' },
  { value: 'marmitas', label: '🍱 Marmitas', grupo: 'Mercado e Consumo' },
  { value: 'feira', label: '🥬 Feira / Hortifruti', grupo: 'Mercado e Consumo' },
  { value: 'padaria', label: '🥖 Padaria', grupo: 'Mercado e Consumo' },
  { value: 'acougue', label: '🥩 Açougue', grupo: 'Mercado e Consumo' },
  { value: 'higiene_limpeza', label: '🧴 Produtos de higiene e limpeza', grupo: 'Mercado e Consumo' },

  // 👧 FILHAS (EDUCAÇÃO E CUIDADOS)
  { value: 'escola', label: '🏫 Mensalidade escolar', grupo: 'Filhas' },
  { value: 'transporte_escolar', label: '🚌 Transporte escolar', grupo: 'Filhas' },
  { value: 'ingles', label: '🇬🇧 Aula de Inglês', grupo: 'Filhas' },
  { value: 'teclado', label: '🎹 Aula Teclado Música', grupo: 'Filhas' },
  { value: 'natacao', label: '🏊 Aula Natação / Personal', grupo: 'Filhas' },
  { value: 'plano_saude_filhas', label: '⚕️ Plano de saúde da criança', grupo: 'Filhas' },
  { value: 'dentista_filhas', label: '🦷 Dentista', grupo: 'Filhas' },
  { value: 'presentes_mesadas', label: '🎁 Presentes e mesadas', grupo: 'Filhas' },
  { value: 'matricula', label: '📝 Matrícula escolar', grupo: 'Filhas' },
  { value: 'material_escolar', label: '✏️ Material escolar', grupo: 'Filhas' },
  { value: 'uniforme', label: '👕 Uniforme Escolar', grupo: 'Filhas' },
  { value: 'livros_escolares', label: '📚 Livros', grupo: 'Filhas' },
  { value: 'passeios_escola', label: '🎒 Passeios e excursões escolares', grupo: 'Filhas' },
  { value: 'aniversarios_filhas', label: '🎂 Festas de aniversário', grupo: 'Filhas' },

  // 🚗 VEÍCULOS
  { value: 'uber', label: '🚕 Uber', grupo: 'Veículos' },
  { value: 'combustivel', label: '⛽ Combustível', grupo: 'Veículos' },
  { value: 'estacionamento', label: '🅿️ Estacionamento / Pedágio', grupo: 'Veículos' },
  { value: 'lavagem', label: '🚿 Lavagem de carro', grupo: 'Veículos' },
  { value: 'manutencao_carro', label: '🔧 Manutenção preventiva', grupo: 'Veículos' },
  { value: 'seguro_carro', label: '🛡️ Seguro do carro', grupo: 'Veículos' },
  { value: 'licenciamento', label: '📋 Licenciamento', grupo: 'Veículos' },

  // 🩺 SAÚDE
  { value: 'plano_saude', label: '🏥 Plano de saúde', grupo: 'Saúde' },
  { value: 'medicamentos', label: '💊 Medicamentos', grupo: 'Saúde' },
  { value: 'terapias', label: '🧠 Terapias (psicólogo, fono, fisio)', grupo: 'Saúde' },
  { value: 'suplementos', label: '💪 Suplementos', grupo: 'Saúde' },
  { value: 'exames', label: '🔬 Exames laboratoriais', grupo: 'Saúde' },
  { value: 'nutricionista', label: '🥗 Nutricionista', grupo: 'Saúde' },
  { value: 'tirzepatida', label: '💉 Tirzepatida', grupo: 'Saúde' },
  { value: 'medico_performance', label: '⚡ Médico de Performance', grupo: 'Saúde' },

  // 🏋️ ATIVIDADES FÍSICAS
  { value: 'academia', label: '🏋️ Academia / Personal', grupo: 'Atividades Físicas' },
  { value: 'suplementos_esporte', label: '🥤 Suplementos esportivos', grupo: 'Atividades Físicas' },
  { value: 'equipamentos_esporte', label: '⚙️ Equipamentos', grupo: 'Atividades Físicas' },

  // 📚 DESENVOLVIMENTO / ESPIRITUALIDADE
  { value: 'livros', label: '📖 Livros', grupo: 'Desenvolvimento' },
  { value: 'cursos', label: '🎓 Cursos e mentorias', grupo: 'Desenvolvimento' },
  { value: 'ferramentas_estudo', label: '🔧 Ferramentas (ChatGPT, Canva, Notion)', grupo: 'Desenvolvimento' },
  { value: 'apps_pagos', label: '📱 Aplicativos pagos', grupo: 'Desenvolvimento' },
  { value: 'dizimo', label: '🙏 Doações / dízimo', grupo: 'Desenvolvimento' },

  // 🎉 LAZER / VIDA SOCIAL
  { value: 'saidas_familia', label: '👨‍👩‍👧‍👧 Saídas em família', grupo: 'Lazer' },
  { value: 'lancha_jet', label: '🚤 Saídas de Lancha / Jet Sky', grupo: 'Lazer' },
  { value: 'delivery', label: '🍕 Delivery / iFood', grupo: 'Lazer' },
  { value: 'datas_comemorativas', label: '🎂 Datas comemorativas', grupo: 'Lazer' },
  { value: 'presentes_amigos', label: '🎁 Presentes para amigos/família', grupo: 'Lazer' },

  // 🛠️ MANUTENÇÃO DA CASA
  { value: 'limpeza_piscina', label: '🏊 Limpeza da Piscina', grupo: 'Manutenção Casa' },
  { value: 'insumos_piscina', label: '🧪 Insumos limpeza Piscina', grupo: 'Manutenção Casa' },
  { value: 'reparos', label: '🔨 Reparos imprevistos', grupo: 'Manutenção Casa' },
  { value: 'pintura_eletros', label: '🎨 Pintura / conserto eletrodomésticos', grupo: 'Manutenção Casa' },
  { value: 'mao_obra', label: '👷 Mão de obra (Pedreiro, encanador)', grupo: 'Manutenção Casa' },

  // 🧍 PESSOAIS
  { value: 'cabeleireiro', label: '💇 Cabeleireiro / Barbeiro / Estética', grupo: 'Pessoais' },
  { value: 'roupas', label: '👗 Roupas e calçados', grupo: 'Pessoais' },
  { value: 'cosmeticos', label: '💄 Cosméticos e cuidados pessoais', grupo: 'Pessoais' },

  // ✈️ VIAGENS E FÉRIAS
  { value: 'passagens', label: '✈️ Passagens aéreas', grupo: 'Viagens' },
  { value: 'hospedagem', label: '🏨 Hospedagem', grupo: 'Viagens' },
  { value: 'alimentacao_viagem', label: '🍽️ Alimentação em viagem', grupo: 'Viagens' },
  { value: 'ingressos', label: '🎢 Ingressos (parques, atrações)', grupo: 'Viagens' },
  { value: 'seguro_viagem', label: '🛡️ Seguro viagem', grupo: 'Viagens' },
  { value: 'presentes_natal', label: '🎄 Presentes de Natal e Fim de Ano', grupo: 'Viagens' },

  // 📅 TAXAS E OBRIGAÇÕES
  { value: 'ipva', label: '🚗 IPVA', grupo: 'Taxas e Obrigações' },
  { value: 'licenciamento_veiculo', label: '📋 Licenciamento de veículos', grupo: 'Taxas e Obrigações' },
  { value: 'cartorio', label: '📜 Cartório', grupo: 'Taxas e Obrigações' },
  { value: 'passaporte', label: '🛂 Passaporte', grupo: 'Taxas e Obrigações' },
  { value: 'doc_portugal', label: '🇵🇹 Documento Nacionalidade Portuguesa', grupo: 'Taxas e Obrigações' },
  { value: 'anuncio_olx', label: '📣 Anúncio OLX', grupo: 'Taxas e Obrigações' },
  { value: 'seguro_residencial', label: '🏠 Seguro residencial', grupo: 'Taxas e Obrigações' },
  { value: 'seguro_vida', label: '🛡️ Seguro de vida', grupo: 'Taxas e Obrigações' },
  { value: 'sala_comercial', label: '🏢 Despesas com sala comercial', grupo: 'Taxas e Obrigações' },
  { value: 'taxas_bancarias', label: '🏦 Taxas bancárias e financeiras', grupo: 'Taxas e Obrigações' },
  { value: 'anuidade_cartao', label: '💳 Anuidade de cartão de crédito', grupo: 'Taxas e Obrigações' },
  { value: 'vacinas', label: '💉 Vacinas particulares', grupo: 'Taxas e Obrigações' },

  // 👨‍👩‍👧 DESPESAS COM FAMILIARES
  { value: 'ajuda_parentes', label: '💝 Ajuda financeira a parentes', grupo: 'Familiares' },
  { value: 'presentes_familiares', label: '🎁 Presentes de aniversário de familiares', grupo: 'Familiares' },
];

export const categoriasObjetivo = [
  { value: 'carro', label: 'Carro/Moto' },
  { value: 'casa', label: 'Casa/Imóvel' },
  { value: 'viagem', label: 'Viagem' },
  { value: 'educacao', label: 'Educação' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'emergencia', label: 'Emergência' },
  { value: 'aposentadoria', label: 'Aposentadoria' },
  { value: 'outros', label: 'Outros' },
];

export const iconesObjetivo = [
  { value: '🏍️', label: 'Moto' },
  { value: '🚗', label: 'Carro' },
  { value: '🏠', label: 'Casa' },
  { value: '✈️', label: 'Viagem' },
  { value: '🎓', label: 'Educação' },
  { value: '🛡️', label: 'Emergência' },
  { value: '🏖️', label: 'Aposentadoria' },
  { value: '👶', label: 'Família' },
  { value: '💰', label: 'Dinheiro' },
  { value: '🎯', label: 'Meta' },
];

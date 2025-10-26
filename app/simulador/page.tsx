'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Badge } from '@/components/Badge';

interface Objetivo {
  id: string;
  nome: string;
  valor: number;
}

const objetivos: Objetivo[] = [
  { id: '1', nome: 'Comprar Moto', valor: 20000 },
  { id: '2', nome: 'Tirar CNH', valor: 3300 },
  { id: '3', nome: 'Reserva de Emergência', valor: 50000 },
  { id: '4', nome: 'Viagem Europa', valor: 35000 },
];

export default function SimuladorPage() {
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string>('');

  return (
    <AppLayout
      title="Simulador de Cenários"
      subtitle="Compare estratégias para atingir seus objetivos"
    >
      <div className="p-4 lg:p-8">
        {/* Seletor de Objetivo */}
        <div className="mb-6 lg:mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um objetivo
            </label>
            <select
              value={objetivoSelecionado}
              onChange={(e) => setObjetivoSelecionado(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um objetivo...</option>
              {objetivos.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.nome} (R$ {obj.valor.toLocaleString('pt-BR')})
                </option>
              ))}
            </select>
          </div>

          {/* Cenários - Mostrar apenas se "Comprar Moto" estiver selecionado */}
          {objetivoSelecionado === '1' && (
            <>
              {/* Grid de Cenários */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                {/* CENÁRIO A: POUPAR MENSALMENTE */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-green-900">
                      CENÁRIO A: POUPAR MENSALMENTE
                    </h3>
                    <Badge variant="success">RECOMENDADO</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-green-800 mb-1">Estratégia</p>
                      <p className="text-lg font-semibold text-green-900">
                        Poupar R$ 1.174,67/mês
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-1">Tempo</p>
                        <p className="text-lg font-semibold text-green-900">17 meses</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-1">Data prevista</p>
                        <p className="text-lg font-semibold text-green-900">Maio 2026</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-green-800 mb-2">Impactos</p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-green-900">
                          <span className="mr-2">✅</span>
                          <span>Sem venda de ativos</span>
                        </li>
                        <li className="flex items-start text-green-900">
                          <span className="mr-2">✅</span>
                          <span>Patrimônio mantido</span>
                        </li>
                        <li className="flex items-start text-green-900">
                          <span className="mr-2">✅</span>
                          <span>Renda passiva preservada</span>
                        </li>
                        <li className="flex items-start text-green-900">
                          <span className="mr-2">✅</span>
                          <span>Baixo impacto emocional</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-green-800 mb-2">Outros objetivos</p>
                      <ul className="space-y-1 text-green-900">
                        <li>• CNH: Mantém em 1 mês</li>
                        <li>• Reserva: Inicia em 18 meses</li>
                      </ul>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      Selecionar este cenário
                    </button>
                  </div>
                </div>

                {/* CENÁRIO B: VENDER CARRO */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-yellow-900">
                      CENÁRIO B: VENDER CARRO
                    </h3>
                    <Badge variant="warning">AVALIAR</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Estratégia</p>
                      <p className="text-lg font-semibold text-yellow-900">
                        Vender carro (R$ 80.000)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-yellow-800 mb-1">Tempo</p>
                        <p className="text-lg font-semibold text-yellow-900">IMEDIATO</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800 mb-1">Sobra</p>
                        <p className="text-lg font-semibold text-yellow-900">R$ 58.400</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-2">Impactos</p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-yellow-900">
                          <span className="mr-2">⚠️</span>
                          <span>Perde mobilidade própria</span>
                        </li>
                        <li className="flex items-start text-yellow-900">
                          <span className="mr-2">⚠️</span>
                          <span>Precisa usar Uber (~R$ 800/mês)</span>
                        </li>
                        <li className="flex items-start text-yellow-900">
                          <span className="mr-2">✅</span>
                          <span>Economia: R$ 400/mês</span>
                        </li>
                        <li className="flex items-start text-yellow-900">
                          <span className="mr-2">✅</span>
                          <span>Sobra para outros objetivos</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Score</p>
                      <p className="text-lg font-semibold text-yellow-900">6/10</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-2">Outros objetivos</p>
                      <ul className="space-y-1 text-yellow-900">
                        <li>• CNH: IMEDIATO</li>
                        <li>• Reserva: IMEDIATO (sobra R$ 55k)</li>
                      </ul>
                    </div>

                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      Selecionar este cenário
                    </button>
                  </div>
                </div>

                {/* CENÁRIO C: RESGATAR INVESTIMENTO */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-red-900">
                      CENÁRIO C: RESGATAR INVESTIMENTO
                    </h3>
                    <Badge variant="danger">NÃO RECOMENDADO</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Estratégia</p>
                      <p className="text-lg font-semibold text-red-900">
                        Resgatar Tesouro Direto (R$ 50.000)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-red-800 mb-1">Tempo</p>
                        <p className="text-lg font-semibold text-red-900">IMEDIATO (D+1)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800 mb-1">Sobra</p>
                        <p className="text-lg font-semibold text-red-900">R$ 30.000</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-red-800 mb-2">Impactos</p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-red-900">
                          <span className="mr-2">⚠️</span>
                          <span>Perde R$ 500/mês de renda passiva</span>
                        </li>
                        <li className="flex items-start text-red-900">
                          <span className="mr-2">⚠️</span>
                          <span>Em 1 ano: -R$ 6.000 de juros</span>
                        </li>
                        <li className="flex items-start text-red-900">
                          <span className="mr-2">⚠️</span>
                          <span>ROI 12% a.a. é bom para manter</span>
                        </li>
                        <li className="flex items-start text-red-900">
                          <span className="mr-2">✅</span>
                          <span>Libera para outros objetivos</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Score</p>
                      <p className="text-lg font-semibold text-red-900">4/10</p>
                    </div>

                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      Selecionar este cenário
                    </button>
                  </div>
                </div>

                {/* CENÁRIO D: DOWNGRADE DA CASA */}
                <div className="bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-900 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      CENÁRIO D: DOWNGRADE DA CASA
                    </h3>
                    <Badge variant="danger">EXTREMO</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-200 mb-1">Estratégia</p>
                      <p className="text-lg font-semibold text-white">
                        Vender casa (R$ 2.8M), comprar menor (R$ 1.5M)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-red-200 mb-1">Tempo</p>
                        <p className="text-lg font-semibold text-white">3-6 meses</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-200 mb-1">Sobra</p>
                        <p className="text-lg font-semibold text-white">R$ 1.076.000</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-red-200 mb-2">Impactos</p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-white">
                          <span className="mr-2">🔴</span>
                          <span>ALTO impacto emocional (mudar família)</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="mr-2">⚠️</span>
                          <span>Custos de mudança: ~R$ 10k</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="mr-2">⚠️</span>
                          <span>Possível piora de localização</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="mr-2">✅</span>
                          <span>Resolve TODOS objetivos</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="mr-2">✅</span>
                          <span>Sobra R$ 1M para investir</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-950 bg-opacity-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-200 mb-1">Score</p>
                      <p className="text-lg font-semibold text-white mb-2">2/10</p>
                      <p className="text-sm text-red-100">Só em caso de EXTREMA necessidade</p>
                    </div>

                    <div className="bg-red-950 bg-opacity-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-200 mb-2">
                        Com R$ 1M investido a 1% a.m.:
                      </p>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Renda passiva: R$ 10.000/mês</li>
                        <li>• Aumenta capacidade em 851%!</li>
                      </ul>
                    </div>

                    <button className="w-full bg-red-950 hover:bg-black text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      Selecionar este cenário
                    </button>
                  </div>
                </div>
              </div>

              {/* Recomendação da IA */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      RECOMENDAÇÃO DA IA
                    </h3>
                    <p className="text-blue-900 leading-relaxed">
                      Para objetivo de R$ 20.000, o <strong>CENÁRIO A</strong> é o mais sensato.
                      17 meses é tempo razoável sem impactos negativos na vida familiar.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Mensagem quando nenhum objetivo está selecionado */}
          {!objetivoSelecionado && (
            <div className="text-center py-8 lg:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-full mb-3 lg:mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-base lg:text-lg">
                Selecione um objetivo acima para comparar cenários
              </p>
            </div>
          )}
      </div>
    </AppLayout>
  );
}

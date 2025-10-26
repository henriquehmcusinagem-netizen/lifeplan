'use client';

import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { AlertCard } from '@/components/AlertCard';
import { NovoAtivoModal } from '@/components/modals';
import { Home, TrendingUp, Car, Plus, Edit, DollarSign, Building2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAtivos } from '@/hooks/useAtivos';

export default function PatrimonioPage() {
  const [isNovoAtivoModalOpen, setIsNovoAtivoModalOpen] = useState(false);

  const { ativos, loading, error, refetch } = useAtivos();

  // Agrupar ativos por tipo
  const ativosPorTipo = useMemo(() => {
    return {
      imovel: ativos.filter((a) => a.tipo === 'imovel'),
      veiculo: ativos.filter((a) => a.tipo === 'veiculo'),
      investimento: ativos.filter((a) => a.tipo === 'investimento'),
    };
  }, [ativos]);

  // Calcular totais
  const totais = useMemo(() => {
    const totalGeral = ativos.reduce((sum, a) => sum + Number(a.valor_estimado), 0);
    const totalImoveis = ativosPorTipo.imovel.reduce((sum, a) => sum + Number(a.valor_estimado), 0);
    const totalVeiculos = ativosPorTipo.veiculo.reduce((sum, a) => sum + Number(a.valor_estimado), 0);
    const totalInvestimentos = ativosPorTipo.investimento.reduce((sum, a) => sum + Number(a.valor_estimado), 0);

    // Considerar investimentos como alta liquidez e imóveis/veículos como baixa liquidez
    const altaLiquidez = totalInvestimentos;
    const baixaLiquidez = totalImoveis + totalVeiculos;

    return {
      totalGeral,
      totalImoveis,
      totalVeiculos,
      totalInvestimentos,
      altaLiquidez,
      baixaLiquidez,
    };
  }, [ativos, ativosPorTipo]);

  // Formatar valor em Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para obter badge de vendabilidade
  const getVendabilidadeBadge = (vendabilidade: string) => {
    switch (vendabilidade) {
      case 'vendavel':
        return (
          <Badge variant="success" icon="🟢">
            Vendável
          </Badge>
        );
      case 'condicional':
        return (
          <Badge variant="warning" icon="🟡">
            Vendável com planejamento
          </Badge>
        );
      case 'nao_vendavel':
        return (
          <Badge variant="danger" icon="🔴">
            Não Vendável
          </Badge>
        );
      default:
        return null;
    }
  };

  // Calcular valorização (se houver dados no metadados)
  const calcularValorizacao = (ativo: any) => {
    const metadados = ativo.metadados || {};
    const valorPago = metadados.valorPago;
    const valorAtual = Number(ativo.valor_estimado);

    if (valorPago && valorPago > 0) {
      const percentual = ((valorAtual - valorPago) / valorPago) * 100;
      return percentual.toFixed(2);
    }
    return null;
  };

  // Handler para quando modal fechar
  const handleModalClose = () => {
    setIsNovoAtivoModalOpen(false);
    refetch(); // Atualizar lista de ativos
  };

  return (
    <AppLayout
      title="Patrimônio"
      subtitle="Gerencie seus ativos e investimentos"
    >
      <div className="p-4 lg:p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 lg:mb-6">
            <AlertCard
              type="warning"
              title="Erro ao carregar ativos"
              message={error.message || 'Ocorreu um erro ao buscar seus ativos. Tente novamente.'}
            />
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <StatCard
                  label="Total"
                  value={formatCurrency(totais.totalGeral)}
                  icon={<DollarSign className="w-6 h-6" />}
                />

                <StatCard
                  label="Alta Liquidez"
                  value={formatCurrency(totais.altaLiquidez)}
                  icon={<TrendingUp className="w-6 h-6" />}
                  variant="success"
                />

                <StatCard
                  label="Baixa Liquidez"
                  value={formatCurrency(totais.baixaLiquidez)}
                  icon={<Home className="w-6 h-6" />}
                  variant="warning"
                />
              </div>

              {/* Add Asset Button */}
              <div className="flex justify-end mb-4 lg:mb-6">
                <button
                  onClick={() => setIsNovoAtivoModalOpen(true)}
                  className="btn-primary flex items-center gap-2 text-sm lg:text-base w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Ativo
                </button>
              </div>

              {/* Empty State */}
              {ativos.length === 0 && (
                <div className="text-center py-8 lg:py-12">
                  <Building2 className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4" />
                  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                    Nenhum ativo cadastrado
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 mb-4 lg:mb-6">
                    Comece adicionando seu primeiro ativo para acompanhar seu patrimônio
                  </p>
                  <button
                    onClick={() => setIsNovoAtivoModalOpen(true)}
                    className="btn-primary inline-flex items-center gap-2 text-sm lg:text-base"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Ativo
                  </button>
                </div>
              )}

              {/* IMÓVEIS Section */}
              {ativosPorTipo.imovel.length > 0 && (
                <div className="mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                    <Home className="w-6 h-6 text-gray-700" />
                    Imóveis
                    <span className="text-gray-500 font-normal text-base ml-2">
                      ({formatCurrency(totais.totalImoveis)})
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {ativosPorTipo.imovel.map((imovel) => {
                      const metadados = imovel.metadados || {};
                      const valorizacao = calcularValorizacao(imovel);

                      return (
                        <div key={imovel.id} className="card">
                          {/* Asset Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{imovel.nome}</h3>
                              <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(Number(imovel.valor_estimado))}
                              </p>
                            </div>
                            {getVendabilidadeBadge(imovel.vendabilidade)}
                          </div>

                          {/* Description */}
                          {imovel.descricao && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">{imovel.descricao}</p>
                            </div>
                          )}

                          {/* Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm text-gray-500">Tipo</p>
                              <p className="text-base font-semibold text-gray-900 capitalize">
                                {metadados.tipoImovel || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Metragem</p>
                              <p className="text-base font-semibold text-gray-900">
                                {metadados.metragem ? `${metadados.metragem} m²` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ano</p>
                              <p className="text-base font-semibold text-gray-900">
                                {metadados.ano || 'N/A'}
                              </p>
                            </div>
                            {metadados.endereco && (
                              <div className="md:col-span-3">
                                <p className="text-sm text-gray-500">Endereço</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {metadados.endereco}
                                </p>
                              </div>
                            )}
                            {valorizacao && (
                              <div>
                                <p className="text-sm text-gray-500">Valorização</p>
                                <p className={`text-base font-semibold ${Number(valorizacao) > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                                  {Number(valorizacao) > 0 ? '+' : ''}{valorizacao}%
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* INVESTIMENTOS Section */}
              {ativosPorTipo.investimento.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-gray-700" />
                    Investimentos
                    <span className="text-gray-500 font-normal text-base ml-2">
                      ({formatCurrency(totais.totalInvestimentos)})
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {ativosPorTipo.investimento.map((investimento) => {
                      const metadados = investimento.metadados || {};

                      return (
                        <div key={investimento.id} className="card">
                          {/* Asset Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{investimento.nome}</h3>
                              <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(Number(investimento.valor_estimado))}
                              </p>
                            </div>
                            {getVendabilidadeBadge(investimento.vendabilidade)}
                          </div>

                          {/* Description */}
                          {investimento.descricao && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">{investimento.descricao}</p>
                            </div>
                          )}

                          {/* Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm text-gray-500">Tipo</p>
                              <p className="text-base font-semibold text-gray-900 capitalize">
                                {metadados.tipoInvestimento?.replace('_', ' ') || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Instituição</p>
                              <p className="text-base font-semibold text-gray-900">
                                {metadados.instituicao || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Rentabilidade</p>
                              <p className={`text-base font-semibold ${metadados.rentabilidadeAnual >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                                {metadados.rentabilidadeAnual ? `${metadados.rentabilidadeAnual}% a.a.` : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VEÍCULOS Section */}
              {ativosPorTipo.veiculo.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Car className="w-6 h-6 text-gray-700" />
                    Veículos
                    <span className="text-gray-500 font-normal text-base ml-2">
                      ({formatCurrency(totais.totalVeiculos)})
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {ativosPorTipo.veiculo.map((veiculo) => {
                      const metadados = veiculo.metadados || {};

                      return (
                        <div key={veiculo.id} className="card">
                          {/* Asset Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{veiculo.nome}</h3>
                              <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(Number(veiculo.valor_estimado))}
                              </p>
                            </div>
                            {getVendabilidadeBadge(veiculo.vendabilidade)}
                          </div>

                          {/* Description */}
                          {veiculo.descricao && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">{veiculo.descricao}</p>
                            </div>
                          )}

                          {/* Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm text-gray-500">Tipo</p>
                              <p className="text-base font-semibold text-gray-900 capitalize">
                                {metadados.tipoVeiculo || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Modelo</p>
                              <p className="text-base font-semibold text-gray-900">
                                {metadados.modelo || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ano</p>
                              <p className="text-base font-semibold text-gray-900">
                                {metadados.ano || 'N/A'}
                              </p>
                            </div>
                            {metadados.placa && (
                              <div>
                                <p className="text-sm text-gray-500">Placa</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {metadados.placa}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
      </div>

      {/* Modal Novo Ativo */}
      <NovoAtivoModal
        isOpen={isNovoAtivoModalOpen}
        onClose={handleModalClose}
      />
    </AppLayout>
  );
}

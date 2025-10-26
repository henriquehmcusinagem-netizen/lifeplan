'use client';

import { AppLayout } from '@/components/AppLayout';
import {
  User,
  DollarSign,
  Bell,
  Shield,
  Info,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Github
} from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <AppLayout
      title="Configurações"
      subtitle="Personalize sua experiência"
    >
      <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
          {/* PERFIL DO USUÁRIO */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Perfil do Usuário</h2>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-700">H</span>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Alterar foto
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="Henrique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="henrique@exemplo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-primary-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </section>

          {/* PREFERÊNCIAS FINANCEIRAS */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Preferências Financeiras</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa de rentabilidade padrão
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    % ao mês
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="BRL">BRL - Real Brasileiro</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserva de emergência ideal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="6"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    meses
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margem de segurança
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* NOTIFICAÇÕES */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Alertas de objetivos próximos de concluir
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Avisos sobre reserva de emergência
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Recomendações mensais de otimização
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Lembretes de revisão de patrimônio
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Newsletter semanal
                </span>
              </label>
            </div>
          </section>

          {/* DADOS E PRIVACIDADE */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Dados e Privacidade</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exportar dados (JSON/Excel)
              </button>

              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Importar planilha (Excel)
              </button>

              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                <Trash2 className="w-4 h-4" />
                Limpar cache
              </button>

              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 font-medium hover:bg-danger-100 transition-colors">
                <AlertTriangle className="w-4 h-4" />
                Excluir conta
              </button>
            </div>
          </section>

          {/* SOBRE */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Sobre</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Versão</span>
                <span className="text-sm font-medium text-gray-900">LifePlan v0.1.0</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Framework</span>
                <span className="text-sm font-medium text-gray-900">Next.js 15.5.6</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Desenvolvido com</span>
                <span className="text-sm font-medium text-gray-900">IA</span>
              </div>

              <div className="pt-4 space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Documentação
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Reportar bug
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </section>
      </div>
    </AppLayout>
  );
}

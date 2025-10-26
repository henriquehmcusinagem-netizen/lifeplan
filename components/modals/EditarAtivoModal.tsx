'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import {
  imovelSchema,
  veiculoSchema,
  investimentoSchema,
} from '@/lib/validations';
import { useAtivos } from '@/hooks/useAtivos';
import { Trash2 } from 'lucide-react';

interface Ativo {
  id?: string;
  tipo: 'imovel' | 'veiculo' | 'investimento';
  nome: string;
  valorEstimado: number;
  vendabilidade: string;
  descricao?: string;
  // Campos específicos de imóvel
  endereco?: string;
  tipoImovel?: string;
  metragem?: number;
  ano?: number;
  // Campos específicos de veículo
  tipoVeiculo?: string;
  modelo?: string;
  placa?: string;
  // Campos específicos de investimento
  tipoInvestimento?: string;
  instituicao?: string;
  rentabilidadeAnual?: number;
}

interface EditarAtivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ativo: Ativo;
  onSuccess?: () => void;
}

export function EditarAtivoModal({ isOpen, onClose, ativo, onSuccess }: EditarAtivoModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showToast } = useToast();
  const { updateAtivo, deleteAtivo } = useAtivos();

  // Função para obter o schema correto baseado no tipo
  const getSchema = () => {
    switch (ativo.tipo) {
      case 'imovel':
        return imovelSchema;
      case 'veiculo':
        return veiculoSchema;
      case 'investimento':
        return investimentoSchema;
      default:
        return imovelSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema()),
  });

  // Preencher formulário com dados do ativo
  useEffect(() => {
    if (ativo && isOpen) {
      reset(ativo as any);
    }
  }, [ativo, isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateAtivo(ativo.id!, data);

      showToast('success', 'Ativo atualizado com sucesso!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao editar ativo:', error);

      let errorMessage = 'Erro ao atualizar ativo. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error?.message?.includes('unauthorized')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error?.code === 'PGRST116') {
        errorMessage = 'Ativo não encontrado.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAtivo(ativo.id!);
      showToast('success', 'Ativo excluído com sucesso!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir ativo:', error);

      let errorMessage = 'Erro ao excluir ativo. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error?.code === '23503') {
        errorMessage = 'Não é possível excluir. Existem registros relacionados.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const getTipoLabel = () => {
    switch (ativo.tipo) {
      case 'imovel':
        return 'Imóvel';
      case 'veiculo':
        return 'Veículo';
      case 'investimento':
        return 'Investimento';
      default:
        return 'Ativo';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Editar ${getTipoLabel()}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos comuns a todos os tipos */}
          <div className="md:col-span-2">
            <Input
              label="Nome do ativo"
              placeholder={
                ativo.tipo === 'imovel'
                  ? 'Ex: Apartamento Centro'
                  : ativo.tipo === 'veiculo'
                  ? 'Ex: Honda CB 500'
                  : 'Ex: Tesouro Direto'
              }
              {...register('nome')}
              error={errors.nome?.message as string}
              required
            />
          </div>

          <input type="hidden" {...register('tipo')} value={ativo.tipo} />

          <Input
            label="Valor estimado"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('valorEstimado', { valueAsNumber: true })}
            error={errors.valorEstimado?.message as string}
            required
          />

          <Select
            label="Vendabilidade"
            options={[
              { value: '', label: 'Selecione' },
              { value: 'vendavel', label: 'Vendável' },
              { value: 'condicional', label: 'Condicional' },
              { value: 'nao_vendavel', label: 'Não vendável' },
            ]}
            {...register('vendabilidade')}
            error={errors.vendabilidade?.message as string}
            helperText="Indica se o ativo pode ser vendido facilmente"
            required
          />

          {/* Campos específicos por tipo */}
          {ativo.tipo === 'imovel' && (
            <>
              <div className="md:col-span-2">
                <Input
                  label="Endereço"
                  placeholder="Rua, número, bairro, cidade"
                  {...register('endereco')}
                  error={(errors as any).endereco?.message as string}
                  required
                />
              </div>

              <Select
                label="Tipo de Imóvel"
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'casa', label: 'Casa' },
                  { value: 'apartamento', label: 'Apartamento' },
                  { value: 'terreno', label: 'Terreno' },
                  { value: 'comercial', label: 'Comercial' },
                  { value: 'outro', label: 'Outro' },
                ]}
                {...register('tipoImovel')}
                error={(errors as any).tipoImovel?.message as string}
                required
              />

              <Input
                label="Metragem (m²)"
                type="number"
                step="0.01"
                placeholder="100"
                {...register('metragem', { valueAsNumber: true })}
                error={(errors as any).metragem?.message as string}
                required
              />

              <Input
                label="Ano de construção"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
                {...register('ano', { valueAsNumber: true })}
                error={(errors as any).ano?.message as string}
                required
              />
            </>
          )}

          {ativo.tipo === 'veiculo' && (
            <>
              <Select
                label="Tipo de Veículo"
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'carro', label: 'Carro' },
                  { value: 'moto', label: 'Moto' },
                  { value: 'caminhao', label: 'Caminhão' },
                  { value: 'outro', label: 'Outro' },
                ]}
                {...register('tipoVeiculo')}
                error={(errors as any).tipoVeiculo?.message as string}
                required
              />

              <Input
                label="Modelo"
                placeholder="Ex: Honda CB 500F"
                {...register('modelo')}
                error={(errors as any).modelo?.message as string}
                required
              />

              <Input
                label="Placa (opcional)"
                placeholder="ABC1D23"
                maxLength={7}
                {...register('placa')}
                error={(errors as any).placa?.message as string}
                helperText="Formato novo: ABC1D23"
              />

              <Input
                label="Ano"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2023"
                {...register('ano', { valueAsNumber: true })}
                error={(errors as any).ano?.message as string}
                required
              />
            </>
          )}

          {ativo.tipo === 'investimento' && (
            <>
              <Select
                label="Tipo de Investimento"
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'renda_fixa', label: 'Renda Fixa' },
                  { value: 'renda_variavel', label: 'Renda Variável' },
                  { value: 'cripto', label: 'Criptomoedas' },
                  { value: 'outro', label: 'Outro' },
                ]}
                {...register('tipoInvestimento')}
                error={(errors as any).tipoInvestimento?.message as string}
                required
              />

              <Input
                label="Instituição (opcional)"
                placeholder="Ex: Banco XYZ"
                {...register('instituicao')}
                error={(errors as any).instituicao?.message as string}
              />

              <Input
                label="Rentabilidade anual (%) - opcional"
                type="number"
                step="0.01"
                placeholder="8.5"
                {...register('rentabilidadeAnual', { valueAsNumber: true })}
                error={(errors as any).rentabilidadeAnual?.message as string}
                helperText="Rentabilidade esperada ao ano"
              />
            </>
          )}

          {/* Descrição (opcional para todos) */}
          <div className="md:col-span-2">
            <Textarea
              label="Descrição (opcional)"
              placeholder="Informações adicionais sobre o ativo..."
              rows={3}
              {...register('descricao')}
              error={errors.descricao?.message as string}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting}
            size="md"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Ativo
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Excluir Ativo"
        description={`Tem certeza que deseja excluir o ativo "${ativo.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </Modal>
  );
}

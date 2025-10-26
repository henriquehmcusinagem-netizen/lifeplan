'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import {
  imovelSchema,
  veiculoSchema,
  investimentoSchema,
  ImovelFormData,
  VeiculoFormData,
  InvestimentoFormData,
} from '@/lib/validations';
import { useAtivos } from '@/hooks/useAtivos';

interface NovoAtivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TipoAtivo = 'imovel' | 'veiculo' | 'investimento';

export function NovoAtivoModal({ isOpen, onClose }: NovoAtivoModalProps) {
  const [tipoAtivo, setTipoAtivo] = useState<TipoAtivo>('imovel');
  const { showToast } = useToast();
  const { createAtivo } = useAtivos();

  // Função para obter o schema correto baseado no tipo
  const getSchema = () => {
    switch (tipoAtivo) {
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

  const onSubmit = async (data: any) => {
    try {
      await createAtivo(data);

      showToast('success', 'Ativo criado com sucesso!');
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar ativo:', error);
      showToast('error', 'Erro ao criar ativo. Tente novamente.');
    }
  };

  const handleClose = () => {
    reset();
    setTipoAtivo('imovel');
    onClose();
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoAtivo(e.target.value as TipoAtivo);
    reset(); // Limpar formulário ao mudar tipo
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Ativo" >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tipo de Ativo */}
        <Select
          label="Tipo de Ativo"
          options={[
            { value: 'imovel', label: 'Imóvel' },
            { value: 'veiculo', label: 'Veículo' },
            { value: 'investimento', label: 'Investimento' },
          ]}
          value={tipoAtivo}
          onChange={handleTipoChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos comuns a todos os tipos */}
          <div className="md:col-span-2">
            <Input
              label="Nome do ativo"
              placeholder={
                tipoAtivo === 'imovel'
                  ? 'Ex: Apartamento Centro'
                  : tipoAtivo === 'veiculo'
                  ? 'Ex: Honda CB 500'
                  : 'Ex: Tesouro Direto'
              }
              {...register('nome')}
              error={errors.nome?.message as string}
              required
            />
          </div>

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
          {tipoAtivo === 'imovel' && (
            <>
              <input type="hidden" {...register('tipo')} value="imovel" />
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

          {tipoAtivo === 'veiculo' && (
            <>
              <input type="hidden" {...register('tipo')} value="veiculo" />
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

          {tipoAtivo === 'investimento' && (
            <>
              <input type="hidden" {...register('tipo')} value="investimento" />
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
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
            Adicionar Ativo
          </Button>
        </div>
      </form>
    </Modal>
  );
}

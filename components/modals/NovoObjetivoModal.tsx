'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { objetivoSchema, ObjetivoFormData, categoriasObjetivo, iconesObjetivo } from '@/lib/validations';
import { useObjetivos } from '@/hooks/useObjetivos';

interface NovoObjetivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NovoObjetivoModal({ isOpen, onClose, onSuccess }: NovoObjetivoModalProps) {
  const { showToast } = useToast();
  const { createObjetivo } = useObjetivos();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(objetivoSchema),
    defaultValues: {
      valorAtual: 0,
      prioridade: 5,
    },
  });

  const onSubmit = async (data: ObjetivoFormData) => {
    try {
      await createObjetivo(data);

      showToast('success', 'Objetivo criado com sucesso!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar objetivo:', error);

      // Tratamento específico de erros
      let errorMessage = 'Erro ao criar objetivo. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error?.message?.includes('unauthorized')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error?.code === '23505') {
        errorMessage = 'Já existe um objetivo com esse nome.';
      } else if (error?.code === 'PGRST301') {
        errorMessage = 'Dados inválidos. Verifique os campos.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Objetivo" className="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="md:col-span-2">
            <Input
              label="Nome do objetivo"
              placeholder="Ex: Comprar Moto"
              {...register('nome')}
              error={errors.nome?.message}
              required
            />
          </div>

          {/* Categoria */}
          <Select
            label="Categoria"
            options={[
              { value: '', label: 'Selecione uma categoria' },
              ...categoriasObjetivo,
            ]}
            {...register('categoria')}
            error={errors.categoria?.message}
            required
          />

          {/* Ícone */}
          <Select
            label="Ícone"
            options={[
              { value: '', label: 'Selecione um ícone' },
              ...iconesObjetivo,
            ]}
            {...register('icone')}
            error={errors.icone?.message}
          />

          {/* Valor Total */}
          <Input
            label="Valor total"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('valor', { valueAsNumber: true })}
            error={errors.valor?.message}
            required
          />

          {/* Valor Atual */}
          <Input
            label="Valor já economizado"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('valorAtual', { valueAsNumber: true })}
            error={errors.valorAtual?.message}
            helperText="Quanto já foi economizado para este objetivo"
          />

          {/* Prioridade */}
          <Input
            label="Prioridade"
            type="number"
            min="1"
            max="10"
            placeholder="1-10"
            {...register('prioridade', { valueAsNumber: true })}
            error={errors.prioridade?.message}
            helperText="1 = Baixa prioridade, 10 = Alta prioridade"
            required
          />

          {/* Prazo */}
          <Input
            label="Data do prazo"
            type="date"
            {...register('prazo', {
              setValueAs: (value) => value ? new Date(value) : undefined
            })}
            error={errors.prazo?.message}
            required
          />
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            Criar Objetivo
          </Button>
        </div>
      </form>
    </Modal>
  );
}

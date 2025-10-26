'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { objetivoSchema, ObjetivoFormData, categoriasObjetivo, iconesObjetivo } from '@/lib/validations';
import { useObjetivos } from '@/hooks/useObjetivos';
import { Trash2 } from 'lucide-react';

interface Objetivo {
  id?: string;
  nome: string;
  valor: number;
  valorAtual?: number;
  prioridade: number;
  prazo: Date | string;
  categoria: string;
  icone?: string;
}

interface EditarObjetivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  objetivo: Objetivo;
  onSuccess?: () => void;
}

export function EditarObjetivoModal({ isOpen, onClose, objetivo, onSuccess }: EditarObjetivoModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showToast } = useToast();
  const { updateObjetivo, deleteObjetivo } = useObjetivos();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(objetivoSchema),
  });

  // Preencher formulário com dados do objetivo
  useEffect(() => {
    if (objetivo && isOpen) {
      reset({
        nome: objetivo.nome,
        valor: objetivo.valor,
        valorAtual: objetivo.valorAtual || 0,
        prioridade: objetivo.prioridade,
        prazo: typeof objetivo.prazo === 'string'
          ? new Date(objetivo.prazo)
          : objetivo.prazo,
        categoria: objetivo.categoria,
        icone: objetivo.icone || '',
      });
    }
  }, [objetivo, isOpen, reset]);

  const onSubmit = async (data: ObjetivoFormData) => {
    try {
      await updateObjetivo(objetivo.id!, data);

      showToast('success', 'Objetivo atualizado com sucesso!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao editar objetivo:', error);

      // Tratamento específico de erros
      let errorMessage = 'Erro ao atualizar objetivo. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error?.message?.includes('unauthorized')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error?.code === 'PGRST116') {
        errorMessage = 'Objetivo não encontrado.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteObjetivo(objetivo.id!);
      showToast('success', 'Objetivo excluído com sucesso!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir objetivo:', error);

      let errorMessage = 'Erro ao excluir objetivo. Tente novamente.';

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Objetivo" className="max-w-3xl">
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
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting}
            size="md"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Objetivo
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
        title="Excluir Objetivo"
        description={`Tem certeza que deseja excluir o objetivo "${objetivo.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </Modal>
  );
}

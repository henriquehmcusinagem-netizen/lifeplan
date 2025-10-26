'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { lancamentoSchema, LancamentoFormData, categoriasReceita, categoriasDespesa } from '@/lib/validations';
import { useLancamentos } from '@/hooks/useLancamentos';
import { Trash2 } from 'lucide-react';

export interface Lancamento {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: Date;
  descricao: string;
  recorrente?: boolean;
  parcelas?: number;
}

interface EditarLancamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lancamento: Lancamento | null;
}

export function EditarLancamentoModal({ isOpen, onClose, lancamento }: EditarLancamentoModalProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState<'receita' | 'despesa'>('despesa');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showToast } = useToast();
  const { updateLancamento, deleteLancamento } = useLancamentos();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: {
      tipo: 'despesa' as const,
      recorrente: false,
      data: new Date(),
    },
  });

  // Preencher formulário quando o lançamento mudar
  useEffect(() => {
    if (lancamento && isOpen) {
      setValue('tipo', lancamento.tipo);
      setValue('categoria', lancamento.categoria);
      setValue('valor', lancamento.valor);
      setValue('data', lancamento.data);
      setValue('descricao', lancamento.descricao);
      setValue('recorrente', lancamento.recorrente ?? false);
      if (lancamento.parcelas) {
        setValue('parcelas', lancamento.parcelas);
      }
      setTipoSelecionado(lancamento.tipo);
    }
  }, [lancamento, isOpen, setValue]);

  // Observar mudanças no tipo
  const tipo = watch('tipo');
  const recorrente = watch('recorrente');

  const onSubmit = async (data: LancamentoFormData) => {
    try {
      await updateLancamento(lancamento!.id, data);

      showToast('success', 'Lançamento atualizado com sucesso!');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Erro ao editar lançamento:', error);

      // Tratamento específico de erros
      let errorMessage = 'Erro ao atualizar lançamento. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error?.message?.includes('unauthorized')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error?.code === 'PGRST116') {
        errorMessage = 'Lançamento não encontrado.';
      } else if (error?.code === '23505') {
        errorMessage = 'Já existe um lançamento com esses dados.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLancamento(lancamento!.id);
      showToast('success', 'Lançamento excluído com sucesso!');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir lançamento:', error);

      let errorMessage = 'Erro ao excluir lançamento. Tente novamente.';

      if (error?.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      showToast('error', errorMessage);
    }
  };

  const handleClose = () => {
    reset();
    setTipoSelecionado('despesa');
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoTipo = e.target.value as 'receita' | 'despesa';
    setTipoSelecionado(novoTipo);
  };

  // Categorias dinâmicas baseadas no tipo
  const categorias = tipo === 'receita' ? categoriasReceita : categoriasDespesa;

  if (!lancamento) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Lançamento">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo */}
          <Select
            label="Tipo"
            options={[
              { value: 'receita', label: 'Receita' },
              { value: 'despesa', label: 'Despesa' },
            ]}
            {...register('tipo', { onChange: handleTipoChange })}
            error={errors.tipo?.message}
            required
          />

          {/* Categoria */}
          <Select
            label="Categoria"
            options={[
              { value: '', label: 'Selecione uma categoria' },
              ...categorias,
            ]}
            {...register('categoria')}
            error={errors.categoria?.message}
            required
          />

          {/* Valor */}
          <Input
            label="Valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('valor', { valueAsNumber: true })}
            error={errors.valor?.message}
            required
          />

          {/* Data */}
          <Input
            label="Data"
            type="date"
            {...register('data', {
              setValueAs: (value) => value ? new Date(value) : undefined
            })}
            error={errors.data?.message}
            required
          />

          {/* Descrição */}
          <div className="md:col-span-2">
            <Textarea
              label="Descrição"
              placeholder="Descreva o lançamento..."
              rows={3}
              {...register('descricao')}
              error={errors.descricao?.message}
              required
            />
          </div>

          {/* Recorrente */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('recorrente')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lançamento recorrente
              </span>
            </label>
          </div>

          {/* Parcelas (apenas se recorrente) */}
          {recorrente && (
            <Input
              label="Número de parcelas"
              type="number"
              min="1"
              max="360"
              placeholder="12"
              {...register('parcelas', { valueAsNumber: true })}
              error={errors.parcelas?.message}
              helperText="Quantidade de meses que se repetirá"
            />
          )}
        </div>

        {/* Preview do valor */}
        <div className={`p-4 rounded-lg ${tipo === 'receita' ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tipo === 'receita' ? 'Receita' : 'Despesa'}:
            </span>
            <span className={`text-xl font-bold ${tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {tipo === 'receita' ? '+' : '-'} R$ {watch('valor')?.toFixed(2) || '0,00'}
            </span>
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
            Excluir Lançamento
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
        title="Excluir Lançamento"
        description={`Tem certeza que deseja excluir este lançamento de ${lancamento?.tipo === 'receita' ? 'receita' : 'despesa'}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </Modal>
  );
}

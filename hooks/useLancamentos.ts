'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LancamentoFormData } from '@/lib/validations';

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchLancamentos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });

      if (error) throw error;
      setLancamentos(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLancamentos();
  }, [user]);

  const createLancamento = async (data: LancamentoFormData) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newLancamento, error } = await supabase
      .from('lancamentos')
      .insert({
        user_id: user.id,
        tipo: data.tipo,
        categoria: data.categoria,
        valor: data.valor,
        data: data.data.toISOString(),
        descricao: data.descricao,
        recorrente: data.recorrente ?? false,
        parcelas: data.parcelas,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchLancamentos();
    return newLancamento;
  };

  const updateLancamento = async (id: string, data: Partial<LancamentoFormData>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData: any = { ...data };
    if (updateData.data && updateData.data instanceof Date) {
      updateData.data = updateData.data.toISOString();
    }

    const { error } = await supabase
      .from('lancamentos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchLancamentos();
  };

  const deleteLancamento = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('lancamentos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchLancamentos();
  };

  return {
    lancamentos,
    loading,
    error,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    refetch: fetchLancamentos,
  };
}

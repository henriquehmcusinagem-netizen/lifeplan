'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ObjetivoFormData } from '@/lib/validations';

export function useObjetivos() {
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchObjetivos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('objetivos')
        .select('*')
        .eq('user_id', user.id)
        .order('prioridade', { ascending: false });

      if (error) throw error;
      setObjetivos(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjetivos();
  }, [user]);

  const createObjetivo = async (data: ObjetivoFormData) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newObjetivo, error } = await supabase
      .from('objetivos')
      .insert({
        user_id: user.id,
        nome: data.nome,
        valor: data.valor,
        prioridade: data.prioridade,
        prazo: data.prazo.toISOString(),
        categoria: data.categoria,
        icone: data.icone,
        valor_atual: data.valorAtual ?? 0,
        status: 'ativo',
      })
      .select()
      .single();

    if (error) throw error;
    await fetchObjetivos();
    return newObjetivo;
  };

  const updateObjetivo = async (id: string, data: Partial<ObjetivoFormData>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData: any = { ...data };
    if (updateData.prazo && updateData.prazo instanceof Date) {
      updateData.prazo = updateData.prazo.toISOString();
    }
    if (updateData.valorAtual !== undefined) {
      updateData.valor_atual = updateData.valorAtual;
      delete updateData.valorAtual;
    }

    const { error } = await supabase
      .from('objetivos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchObjetivos();
  };

  const deleteObjetivo = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('objetivos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchObjetivos();
  };

  return {
    objetivos,
    loading,
    error,
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    refetch: fetchObjetivos,
  };
}

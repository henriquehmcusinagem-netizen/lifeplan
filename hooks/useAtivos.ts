'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AtivoFormData } from '@/lib/validations';

export function useAtivos() {
  const [ativos, setAtivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchAtivos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ativos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAtivos(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtivos();
  }, [user]);

  const createAtivo = async (data: AtivoFormData) => {
    if (!user) throw new Error('User not authenticated');

    // Converter camelCase para snake_case para o Supabase
    const dataToInsert: any = {
      user_id: user.id,
      nome: data.nome,
      valor_estimado: data.valorEstimado,
      vendabilidade: data.vendabilidade,
      tipo: data.tipo,
      descricao: data.descricao,
    };

    // Adicionar metadados específicos por tipo
    const metadados: any = {};
    if (data.tipo === 'imovel') {
      metadados.endereco = data.endereco;
      metadados.metragem = data.metragem;
      metadados.ano = data.ano;
      metadados.tipoImovel = data.tipoImovel;
    } else if (data.tipo === 'veiculo') {
      metadados.modelo = data.modelo;
      metadados.placa = data.placa;
      metadados.ano = data.ano;
      metadados.tipoVeiculo = data.tipoVeiculo;
    } else if (data.tipo === 'investimento') {
      metadados.tipoInvestimento = data.tipoInvestimento;
      metadados.rentabilidadeAnual = data.rentabilidadeAnual;
      metadados.instituicao = data.instituicao;
    }

    dataToInsert.metadados = metadados;

    const { data: newAtivo, error } = await supabase
      .from('ativos')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;
    await fetchAtivos();
    return newAtivo;
  };

  const updateAtivo = async (id: string, data: Partial<AtivoFormData>) => {
    if (!user) throw new Error('User not authenticated');

    // Converter camelCase para snake_case para o Supabase
    const dataToUpdate: any = {
      nome: data.nome,
      valor_estimado: data.valorEstimado,
      vendabilidade: data.vendabilidade,
      tipo: data.tipo,
      descricao: data.descricao,
    };

    // Adicionar metadados específicos por tipo
    const metadados: any = {};
    if (data.tipo === 'imovel') {
      metadados.endereco = data.endereco;
      metadados.metragem = data.metragem;
      metadados.ano = data.ano;
      metadados.tipoImovel = data.tipoImovel;
    } else if (data.tipo === 'veiculo') {
      metadados.modelo = data.modelo;
      metadados.placa = data.placa;
      metadados.ano = data.ano;
      metadados.tipoVeiculo = data.tipoVeiculo;
    } else if (data.tipo === 'investimento') {
      metadados.tipoInvestimento = data.tipoInvestimento;
      metadados.rentabilidadeAnual = data.rentabilidadeAnual;
      metadados.instituicao = data.instituicao;
    }

    dataToUpdate.metadados = metadados;

    const { error } = await supabase
      .from('ativos')
      .update(dataToUpdate)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchAtivos();
  };

  const deleteAtivo = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('ativos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchAtivos();
  };

  return {
    ativos,
    loading,
    error,
    createAtivo,
    updateAtivo,
    deleteAtivo,
    refetch: fetchAtivos,
  };
}

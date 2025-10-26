import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Buscar todos os lançamentos recorrentes ativos
    const { data: recorrentes, error: fetchError } = await supabaseClient
      .from('lancamentos_recorrentes')
      .select('*')
      .eq('ativo', true)

    if (fetchError) throw fetchError

    const processados = []
    const hoje = new Date()
    const mesAtual = hoje.getMonth()
    const anoAtual = hoje.getFullYear()

    // 2. Para cada recorrente, verificar se deve gerar parcela
    for (const recorrente of recorrentes || []) {
      const dataInicio = new Date(recorrente.data_inicio)
      const mesesDesdeInicio = (anoAtual - dataInicio.getFullYear()) * 12 + (mesAtual - dataInicio.getMonth())

      // Se já passou meses suficientes e ainda não gerou todas as parcelas
      if (mesesDesdeInicio >= recorrente.parcelas_geradas && recorrente.parcelas_geradas < recorrente.parcelas_total) {
        // Verificar se já existe lançamento deste mês para este recorrente
        const dataLancamento = new Date(anoAtual, mesAtual, dataInicio.getDate())

        const { data: existente } = await supabaseClient
          .from('lancamentos')
          .select('id')
          .eq('lancamento_pai_id', recorrente.id)
          .eq('data', dataLancamento.toISOString().split('T')[0])
          .single()

        if (!existente) {
          // 3. Criar novo lançamento
          const { data: novoLancamento, error: insertError } = await supabaseClient
            .from('lancamentos')
            .insert({
              user_id: recorrente.user_id,
              tipo: recorrente.tipo,
              categoria: recorrente.categoria,
              descricao: recorrente.descricao,
              valor: recorrente.valor,
              data: dataLancamento.toISOString().split('T')[0],
              recorrente: true,
              lancamento_pai_id: recorrente.id,
            })
            .select()
            .single()

          if (insertError) throw insertError

          // 4. Incrementar parcelas_geradas
          const novasParcelas = recorrente.parcelas_geradas + 1
          const deveFinalizar = novasParcelas >= recorrente.parcelas_total

          await supabaseClient
            .from('lancamentos_recorrentes')
            .update({
              parcelas_geradas: novasParcelas,
              ativo: !deveFinalizar,
            })
            .eq('id', recorrente.id)

          processados.push({
            recorrente_id: recorrente.id,
            lancamento_id: novoLancamento.id,
            parcela: novasParcelas,
            finalizado: deveFinalizar,
          })
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processados: processados.length,
        detalhes: processados,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

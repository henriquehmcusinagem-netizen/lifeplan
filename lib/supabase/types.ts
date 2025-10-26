export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ativos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          metadados: Json
          nome: string
          tipo: Database["public"]["Enums"]["tipo_ativo"]
          updated_at: string
          user_id: string
          valor_estimado: number
          vendabilidade: Database["public"]["Enums"]["vendabilidade_ativo"]
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          metadados?: Json
          nome: string
          tipo: Database["public"]["Enums"]["tipo_ativo"]
          updated_at?: string
          user_id: string
          valor_estimado: number
          vendabilidade: Database["public"]["Enums"]["vendabilidade_ativo"]
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          metadados?: Json
          nome?: string
          tipo?: Database["public"]["Enums"]["tipo_ativo"]
          updated_at?: string
          user_id?: string
          valor_estimado?: number
          vendabilidade?: Database["public"]["Enums"]["vendabilidade_ativo"]
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria: string
          created_at: string
          data: string
          descricao: string
          id: string
          lancamento_pai_id: string | null
          parcelas: number | null
          recorrente: boolean
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data: string
          descricao: string
          id?: string
          lancamento_pai_id?: string | null
          parcelas?: number | null
          recorrente?: boolean
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          lancamento_pai_id?: string | null
          parcelas?: number | null
          recorrente?: boolean
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_lancamento_pai_id_fkey"
            columns: ["lancamento_pai_id"]
            isOneToOne: false
            referencedRelation: "lancamentos_recorrentes"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_recorrentes: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          data_inicio: string
          descricao: string
          id: string
          parcelas_geradas: number
          parcelas_total: number
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          data_inicio: string
          descricao: string
          id?: string
          parcelas_geradas?: number
          parcelas_total: number
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          data_inicio?: string
          descricao?: string
          id?: string
          parcelas_geradas?: number
          parcelas_total?: number
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      objetivos: {
        Row: {
          categoria: string
          created_at: string
          icone: string | null
          id: string
          nome: string
          prazo: string
          prioridade: number
          status: Database["public"]["Enums"]["status_objetivo"]
          updated_at: string
          user_id: string
          valor: number
          valor_atual: number
        }
        Insert: {
          categoria: string
          created_at?: string
          icone?: string | null
          id?: string
          nome: string
          prazo: string
          prioridade: number
          status?: Database["public"]["Enums"]["status_objetivo"]
          updated_at?: string
          user_id: string
          valor: number
          valor_atual?: number
        }
        Update: {
          categoria?: string
          created_at?: string
          icone?: string | null
          id?: string
          nome?: string
          prazo?: string
          prioridade?: number
          status?: Database["public"]["Enums"]["status_objetivo"]
          updated_at?: string
          user_id?: string
          valor?: number
          valor_atual?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nome_completo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nome_completo: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nome_completo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_dashboard_mensal: {
        Row: {
          ano: number | null
          despesas: number | null
          mes: number | null
          receitas: number | null
          resultado: number | null
          total_despesas_count: number | null
          total_receitas_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_objetivos_progresso: {
        Row: {
          categoria: string | null
          created_at: string | null
          dias_restantes: number | null
          icone: string | null
          id: string | null
          nome: string | null
          prazo: string | null
          prioridade: number | null
          progresso_percentual: number | null
          status: Database["public"]["Enums"]["status_objetivo"] | null
          status_prazo: string | null
          updated_at: string | null
          user_id: string | null
          valor: number | null
          valor_atual: number | null
          valor_mensal_necessario: number | null
          valor_restante: number | null
        }
        Relationships: []
      }
      v_patrimonio_total: {
        Row: {
          patrimonio_total: number | null
          percentual_vendavel: number | null
          quantidade_imoveis: number | null
          quantidade_investimentos: number | null
          quantidade_veiculos: number | null
          total_ativos: number | null
          total_condicional: number | null
          total_imoveis: number | null
          total_investimentos: number | null
          total_nao_vendavel: number | null
          total_veiculos: number | null
          total_vendavel: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calcular_progresso_objetivo: {
        Args: { objetivo_id: string }
        Returns: number
      }
      gerar_lancamento_recorrente: {
        Args: { recorrente_id: string }
        Returns: string
      }
      processar_lancamentos_recorrentes: {
        Args: Record<PropertyKey, never>
        Returns: {
          lancamentos_criados: number
          recorrente_id: string
        }[]
      }
      resultado_mes: {
        Args: { p_ano: number; p_mes: number; p_user_id: string }
        Returns: number
      }
      total_despesas_mes: {
        Args: { p_ano: number; p_mes: number; p_user_id: string }
        Returns: number
      }
      total_receitas_mes: {
        Args: { p_ano: number; p_mes: number; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      status_objetivo: "ativo" | "concluido" | "cancelado"
      tipo_ativo: "imovel" | "veiculo" | "investimento"
      tipo_lancamento: "receita" | "despesa"
      vendabilidade_ativo: "vendavel" | "condicional" | "nao_vendavel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

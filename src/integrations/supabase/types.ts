export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      carrossel_home: {
        Row: {
          ativo: boolean;
          created_at: string;
          descricao: string | null;
          id: string;
          imagem_url: string;
          ordem: number;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          descricao?: string | null;
          imagem_url: string;
          ordem?: number;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          descricao?: string | null;
          imagem_url?: string;
          ordem?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      gatos: {
        Row: {
          caracteristicas: string | null;
          castrado: boolean;
          created_at: string;
          data_ultima_vacinacao: string | null;
          fotos: string[] | null;
          id: string;
          local_encontrado: string | null;
          nome: string;
          protetor_id: string | null;
          sexo: Database["public"]["Enums"]["cat_sex"];
          status: Database["public"]["Enums"]["cat_status"];
          updated_at: string;
          vacinado: boolean;
          data_adocao_falecimento: string | null;
          mensagem: string | null;
        };
        Insert: {
          caracteristicas?: string | null;
          castrado?: boolean;
          created_at?: string;
          data_ultima_vacinacao?: string | null;
          fotos?: string[] | null;
          id: string;
          local_encontrado?: string | null;
          nome: string;
          protetor_id: string | null;
          sexo?: Database["public"]["Enums"]["cat_sex"];
          status?: Database["public"]["Enums"]["cat_status"];
          updated_at?: string;
          vacinado?: boolean;
          data_adocao_falecimento: string | null;
          mensagem: string | null;
        };
        Update: {
          caracteristicas?: string | null;
          castrado?: boolean;
          created_at?: string;
          data_ultima_vacinacao?: string | null;
          fotos?: string[] | null;
          id: string;
          local_encontrado?: string | null;
          nome?: string;
          protetor_id: string | null;
          sexo?: Database["public"]["Enums"]["cat_sex"];
          status?: Database["public"]["Enums"]["cat_status"];
          updated_at?: string;
          vacinado?: boolean;
          data_adocao_falecimento: string | null;
          mensagem: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gatos_protetor_id_fkey";
            columns: ["protetor_id"];
            isOneToOne: false;
            referencedRelation: "protetores";
            referencedColumns: ["id"];
          }
        ];
      };
      pedidos_adocao: {
        Row: {
          contato_candidato: string;
          created_at: string;
          data_pedido: string;

          id: string;
          nome_candidato: string;
          status: string;
          termo_compromisso_aceito: boolean;
        };
        Insert: {
          contato_candidato: string;
          created_at?: string;
          data_pedido?: string;

          id: string;
          nome_candidato: string;
          status?: string;
          termo_compromisso_aceito?: boolean;
        };
        Update: {
          contato_candidato?: string;
          created_at?: string;
          data_pedido?: string;

          id: string;
          nome_candidato?: string;
          status?: string;
          termo_compromisso_aceito?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "pedidos_adocao_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "gatos";
            referencedColumns: ["id"];
          }
        ];
      };
      protetor_atividade_historico: {
        Row: {
          created_at: string;
          data_referencia: string;
          gatos_cadastrados_mes: number;
          gatos_editados_mes: number;
          id: number;
          novos_protetores_cadastrados_mes: number;
          protetor_id: string;
        };
        Insert: {
          created_at?: string;
          data_referencia: string;
          gatos_cadastrados_mes?: number;
          gatos_editados_mes?: number;
          id: number;
          novos_protetores_cadastrados_mes?: number;
          protetor_id: string;
        };
        Update: {
          created_at?: string;
          data_referencia?: string;
          gatos_cadastrados_mes?: number;
          gatos_editados_mes?: number;
          id: number;
          novos_protetores_cadastrados_mes?: number;
          protetor_id: string;
        };
        Relationships: [
          {
            foreignKeyName: "protetor_atividade_historico_protetor_id_fkey";
            columns: ["protetor_id"];
            isOneToOne: false;
            referencedRelation: "protetores";
            referencedColumns: ["id"];
          }
        ];
      };
      protetores: {
        Row: {
          campus: string;
          created_at: string;
          data_cadastro: string;
          email: string;
          forma_de_contato: string | null;
          foto_url: string | null;
          gatos_cadastrados: number;
          gatos_editados: number;
          id: string;
          is_admin: boolean;
          nome: string;
          updated_at: string;
        };
        Insert: {
          campus: string;
          created_at?: string;
          data_cadastro?: string;
          email: string;
          forma_de_contato?: string | null;
          foto_url?: string | null;
          gatos_cadastrados?: number;
          gatos_editados?: number;
          id: string;
          is_admin?: boolean;
          nome: string;
          updated_at?: string;
        };
        Update: {
          campus?: string;
          created_at?: string;
          data_cadastro?: string;
          email?: string;
          forma_de_contato?: string | null;
          foto_url?: string | null;
          gatos_cadastrados?: number;
          gatos_editados?: number;
          id: string;
          is_admin?: boolean;
          nome?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          created_at?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          created_at?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      cat_sex: "macho" | "femea" | "desconhecido";
      cat_status:
        | "no_campus"
        | "em_tratamento"
        | "adotado"
        | "falecido"
        | "desconhecido";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      cat_sex: ["macho", "femea", "desconhecido"],
      cat_status: [
        "no_campus",
        "em_tratamento",
        "adotado",
        "falecido",
        "desconhecido",
      ],
    },
  },
} as const;

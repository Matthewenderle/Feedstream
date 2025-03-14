export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      feature_request_comments: {
        Row: {
          comment: string;
          created_at: string | null;
          created_by: string;
          feature_request_id: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          comment: string;
          created_at?: string | null;
          created_by: string;
          feature_request_id: string;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          comment?: string;
          created_at?: string | null;
          created_by?: string;
          feature_request_id?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'feature_request_comments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_view';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feature_request_comments_feature_request_id_fkey';
            columns: ['feature_request_id'];
            isOneToOne: false;
            referencedRelation: 'feature_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feature_request_comments_feature_request_id_fkey';
            columns: ['feature_request_id'];
            isOneToOne: false;
            referencedRelation: 'feature_requests_view';
            referencedColumns: ['id'];
          },
        ];
      };
      feature_request_votes: {
        Row: {
          created_at: string | null;
          created_by: string;
          feature_request_id: string;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          feature_request_id: string;
          id?: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          feature_request_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feature_request_votes_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_view';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feature_request_votes_feature_request_id_fkey';
            columns: ['feature_request_id'];
            isOneToOne: false;
            referencedRelation: 'feature_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feature_request_votes_feature_request_id_fkey';
            columns: ['feature_request_id'];
            isOneToOne: false;
            referencedRelation: 'feature_requests_view';
            referencedColumns: ['id'];
          },
        ];
      };
      feature_requests: {
        Row: {
          created_at: string | null;
          created_by: string;
          id: string;
          request_description: string;
          request_title: string;
          status: Database['public']['Enums']['feature_request_status'] | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          id?: string;
          request_description: string;
          request_title: string;
          status?: Database['public']['Enums']['feature_request_status'] | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          id?: string;
          request_description?: string;
          request_title?: string;
          status?: Database['public']['Enums']['feature_request_status'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_feature_requests_created_by';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_view';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          created_at: string | null;
          email: string;
          first_name: string | null;
          last_name: string | null;
          onboarded: boolean | null;
          profile_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          onboarded?: boolean | null;
          profile_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          onboarded?: boolean | null;
          profile_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_profiles_user_id';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_profile_view';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      all_profile_ids: {
        Row: {
          profile_id: string | null;
        };
        Insert: {
          profile_id?: string | null;
        };
        Update: {
          profile_id?: string | null;
        };
        Relationships: [];
      };
      feature_requests_view: {
        Row: {
          comment_details: Json | null;
          created_at: string | null;
          created_by: string | null;
          creator: Json | null;
          id: string | null;
          request_description: string | null;
          request_title: string | null;
          status: Database['public']['Enums']['feature_request_status'] | null;
          total_comments: number | null;
          total_votes: number | null;
          updated_at: string | null;
          vote_details: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_feature_requests_created_by';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_view';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profile_view: {
        Row: {
          email: string | null;
          first_name: string | null;
          id: string | null;
          last_name: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      generate_custom_id: {
        Args: {
          prefix: string;
          table_name: string;
        };
        Returns: string;
      };
      generate_profile_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      feature_request_status: 'In Progress' | 'In Review' | 'Completed' | 'Pending' | 'Rejected';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

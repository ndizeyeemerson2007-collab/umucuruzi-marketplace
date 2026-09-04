// ---------------------------------------------------------------------------
// Hand-authored types mirroring the `umucuruziltd` Supabase project schema
// (public schema). Kept in sync manually with the SQL migrations run against
// that project. If you add/change columns there, update this file too.
// ---------------------------------------------------------------------------

export interface OpeningHoursEntry {
  days: string[];
  opens: string; // "08:00"
  closes: string; // "22:00"
}

type Json = Record<string, unknown>;

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          icon: string | null;
          description: string | null;
          seo_title: string | null;
          seo_description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          icon?: string | null;
          description?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      restaurants: {
        Row: {
          id: string;
          pos_restaurant_id: string | null;
          source: "manual" | "pos";
          slug: string;
          name: string;
          description: string | null;
          cover_image_url: string | null;
          logo_url: string | null;
          phone: string | null;
          email: string | null;
          address_line: string | null;
          city: string;
          state: string | null;
          country: string;
          postal_code: string | null;
          latitude: number | null;
          longitude: number | null;
          google_place_id: string | null;
          price_range: string | null;
          rating: number;
          review_count: number;
          delivery_time_min: number | null;
          delivery_time_max: number | null;
          delivery_fee: number;
          min_order: number | null;
          is_open: boolean;
          is_featured: boolean;
          is_verified: boolean;
          status: "active" | "inactive" | "pending";
          opening_hours: OpeningHoursEntry[];
          social_links: Record<string, string>;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          created_at: string;
          updated_at: string;
          published_at: string;
        };
        Insert: {
          id?: string;
          pos_restaurant_id?: string | null;
          source?: "manual" | "pos";
          slug: string;
          name: string;
          description?: string | null;
          cover_image_url?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address_line?: string | null;
          city?: string;
          state?: string | null;
          country?: string;
          postal_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          google_place_id?: string | null;
          price_range?: string | null;
          rating?: number;
          review_count?: number;
          delivery_time_min?: number | null;
          delivery_time_max?: number | null;
          delivery_fee?: number;
          min_order?: number | null;
          is_open?: boolean;
          is_featured?: boolean;
          is_verified?: boolean;
          status?: "active" | "inactive" | "pending";
          opening_hours?: OpeningHoursEntry[];
          social_links?: Record<string, string>;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: [];
      };
      restaurant_categories: {
        Row: {
          restaurant_id: string;
          category_id: string;
        };
        Insert: {
          restaurant_id: string;
          category_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurant_categories"]["Insert"]>;
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          pos_product_id: string | null;
          restaurant_id: string;
          slug: string | null;
          name: string;
          description: string | null;
          price: number;
          currency: string;
          image_url: string | null;
          menu_category: string;
          is_bestseller: boolean;
          is_featured: boolean;
          available: boolean;
          stock_quantity: number | null;
          rating: number;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pos_product_id?: string | null;
          restaurant_id: string;
          slug?: string | null;
          name: string;
          description?: string | null;
          price: number;
          currency?: string;
          image_url?: string | null;
          menu_category?: string;
          is_bestseller?: boolean;
          is_featured?: boolean;
          available?: boolean;
          stock_quantity?: number | null;
          rating?: number;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          restaurant_id: string | null;
          title: string;
          subtitle: string | null;
          code: string | null;
          color: "blue" | "green" | "yellow" | "navy";
          icon: string | null;
          starts_at: string | null;
          ends_at: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          title: string;
          subtitle?: string | null;
          code?: string | null;
          color?: "blue" | "green" | "yellow" | "navy";
          icon?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          customer_name: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          customer_name: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          restaurant_id: string;
          customer_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          status:
            | "confirmed"
            | "preparing"
            | "driver_assigned"
            | "on_the_way"
            | "delivered"
            | "cancelled";
          subtotal: number;
          delivery_fee: number;
          total: number;
          delivery_address: string | null;
          delivery_latitude: number | null;
          delivery_longitude: number | null;
          payment_method: "mtn_momo" | "airtel_money" | "cash_on_delivery" | null;
          notes: string | null;
          source: "marketplace" | "pos";
          pos_order_id: string | null;
          placed_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          restaurant_id: string;
          customer_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          status?:
            | "confirmed"
            | "preparing"
            | "driver_assigned"
            | "on_the_way"
            | "delivered"
            | "cancelled";
          subtotal: number;
          delivery_fee?: number;
          total: number;
          delivery_address?: string | null;
          delivery_latitude?: number | null;
          delivery_longitude?: number | null;
          payment_method?: "mtn_momo" | "airtel_money" | "cash_on_delivery" | null;
          notes?: string | null;
          source?: "marketplace" | "pos";
          pos_order_id?: string | null;
          placed_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          price: number;
          special_instructions: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          quantity: number;
          price: number;
          special_instructions?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      pos_sync_logs: {
        Row: {
          id: string;
          sync_type: "restaurant_upsert" | "menu_upsert" | "full_sync";
          pos_restaurant_id: string | null;
          status: "success" | "failed" | "partial";
          payload_summary: Json | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sync_type: "restaurant_upsert" | "menu_upsert" | "full_sync";
          pos_restaurant_id?: string | null;
          status: "success" | "failed" | "partial";
          payload_summary?: Json | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pos_sync_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

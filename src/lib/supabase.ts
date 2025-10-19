import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Criminal {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  address: string;
  status: 'Incarcerated' | 'On Parole' | 'Released' | 'Wanted';
  photo_url: string;
  last_seen: string;
  physical: {
    height: string;
    weight: string;
    hair: string;
    eyes: string;
  };
  offenses: Array<{
    crime: string;
    date: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }>;
  created_at: string;
  updated_at: string;
}

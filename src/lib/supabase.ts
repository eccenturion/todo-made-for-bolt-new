import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Todo {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  completed: boolean;
  created_at: string;
}
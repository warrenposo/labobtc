import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqrdcbfbypdytfkwahwe.supabase.co';
const supabaseAnonKey = 'sb_publishable_ll0h0EBUjPqeKAB1bgwz7Q_3kMpN64Z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


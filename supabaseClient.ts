import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bdimsucrfuzdvfshsnry.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_f2EOzMlW6IFgBBbUZ7HtiA_5d_PVPIh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

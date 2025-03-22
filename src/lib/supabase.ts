
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgzhlkikpsyyqfihcxwh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnemhsa2lrcHN5eXFmaWhjeHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjkzNTMsImV4cCI6MjA1Nzc0NTM1M30.ElkQq4VcIvq9RnYyX7Xt2YFuJSW0JQXbv2Cj4nAYbWc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

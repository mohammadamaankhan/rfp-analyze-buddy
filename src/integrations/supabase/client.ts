
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zgzhlkikpsyyqfihcxwh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnemhsa2lrcHN5eXFmaWhjeHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjkzNTMsImV4cCI6MjA1Nzc0NTM1M30.ElkQq4VcIvq9RnYyX7Xt2YFuJSW0JQXbv2Cj4nAYbWc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

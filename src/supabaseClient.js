import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fahxrgbxughwoeaqqwbx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaHhyZ2J4dWdod29lYXFxd2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTU2NTMsImV4cCI6MjA4NzE3MTY1M30.ILllKRuA-mwNEwBFuETMYXgM-1f1pxpEg8emN2wikoY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://fradmvdqiqrxluepqhml.supabase.co";
const supabaseKey = "sb_publishable_DpqOC8WFXI1k73AjoCIDeg_6SEYPICA";

export const supabase = createClient(supabaseUrl, supabaseKey);
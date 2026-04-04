import { supabase } from './supabase.js';

export async function getCars() {
  const { data, error } = await supabase
    .from("car_data")
    .select("*");

  if (error) throw error;

  return data;
}
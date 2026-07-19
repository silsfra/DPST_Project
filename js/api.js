import { supabase } from './supabase.js';

export async function getCars() {
  const { data, error } = await supabase
    .from("car_data_5")
    .select("*");

  if (error) {
    console.error("Failed to fetch cars:", error);
    throw new Error("Unable to load car data");
  }

  return data ?? [];
}
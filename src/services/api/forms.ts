
import { supabase } from "@/integrations/supabase/client";

export interface Form {
  id: number;
  title: string;
  alias: string;
  published: string;
  elements?: any; // JSON data
  params?: any;   // JSON data
}

// Fetch forms from the chronoforms8 table
export const getForms = async (): Promise<Form[]> => {
  const { data, error } = await supabase
    .from('owc_chronoforms8')
    .select('*');

  if (error) {
    console.error('Error fetching forms:', error);
    return [];
  }

  return data || [];
};

// Get a specific form by alias
export const getFormByAlias = async (alias: string): Promise<Form | null> => {
  const { data, error } = await supabase
    .from('owc_chronoforms8')
    .select('*')
    .eq('alias', alias)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching form ${alias}:`, error);
    return null;
  }

  return data;
};

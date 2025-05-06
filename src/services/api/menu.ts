
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: number;
  menutype: string;
  title: string;
  alias: string;
  path: string;
  link: string;
  parent_id: string;
  published: number;
}

export interface MenuType {
  id: number;
  menutype: string;
  title: string;
  description: string;
  client_id: string;
  asset_id: number;
}

// Fetch menu items for a specific menu type
export const getMenuItems = async (menuType: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('owc_menu')
    .select('*')
    .eq('menutype', menuType)
    .order('id');

  if (error) {
    console.error(`Error fetching menu items for ${menuType}:`, error);
    return [];
  }

  return data || [];
};

// Get menu types
export const getMenuTypes = async (): Promise<MenuType[]> => {
  const { data, error } = await supabase
    .from('owc_menu_types')
    .select('*');

  if (error) {
    console.error('Error fetching menu types:', error);
    return [];
  }

  return data || [];
};

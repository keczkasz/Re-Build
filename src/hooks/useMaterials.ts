import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          profiles:seller_id (
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('available', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

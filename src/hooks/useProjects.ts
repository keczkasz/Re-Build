import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:created_by (
            full_name,
            company_name,
            email,
            phone
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

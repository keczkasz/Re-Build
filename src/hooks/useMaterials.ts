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
    // Performance optimizations
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnReconnect: true, // Refetch when connection is restored
  });
};

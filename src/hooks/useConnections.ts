import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useConnections = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          requester:requester_id (
            id,
            full_name,
            company_name,
            user_type,
            location,
            bio,
            avatar_url
          ),
          recipient:recipient_id (
            id,
            full_name,
            company_name,
            user_type,
            location,
            bio,
            avatar_url
          )
        `)
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    // Performance optimizations
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnReconnect: true, // Refetch when connection is restored
  });
};

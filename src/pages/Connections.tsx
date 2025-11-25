import { Navigation } from "@/components/Navigation";
import { ConnectionCard } from "@/components/ConnectionCard";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  user_type: string;
  location: string;
  specialties: string[];
  bio: string;
  company_name?: string;
}

const Connections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (recipientId: string, recipientName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with others",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if connection already exists
      const { data: existing } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .single();

      if (existing) {
        toast({
          title: "Already connected",
          description: "You already have a connection request with this user",
        });
        return;
      }

      // Create connection request
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          recipient_id: recipientId,
          message: `Hi! I'd like to connect with you on Re:Build.`
        });

      if (error) throw error;

      toast({
        title: "Connection request sent",
        description: `Your connection request has been sent to ${recipientName}`,
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const handleMessage = useCallback(async (recipientId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    // Navigate to messages page
    navigate('/messages');
  }, [user, toast, navigate]);

  // Memoize search term change handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize filtered profiles to avoid recalculation on every render
  const filteredProfiles = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return profiles.filter(profile => 
      profile.full_name?.toLowerCase().includes(searchLower) ||
      profile.location?.toLowerCase().includes(searchLower) ||
      profile.user_type?.toLowerCase().includes(searchLower) ||
      profile.specialties?.some(s => s.toLowerCase().includes(searchLower))
    );
  }, [profiles, searchTerm]);

  // Memoize filtered profiles by type
  const contractorProfiles = useMemo(() => 
    filteredProfiles.filter(p => 
      p.user_type?.toLowerCase().includes('contractor') || 
      p.user_type?.toLowerCase().includes('developer')
    ), [filteredProfiles]);

  const designerProfiles = useMemo(() => 
    filteredProfiles.filter(p => 
      p.user_type?.toLowerCase().includes('designer') || 
      p.user_type?.toLowerCase().includes('architect') || 
      p.user_type?.toLowerCase().includes('studio')
    ), [filteredProfiles]);

  const recyclerProfiles = useMemo(() => 
    filteredProfiles.filter(p => 
      p.user_type?.toLowerCase().includes('recycler')
    ), [filteredProfiles]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
          <p className="text-muted-foreground">Find partners, suppliers, and collaborators in the circular economy</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, location, or specialty..." 
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Connections</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="designers">Designers</TabsTrigger>
            <TabsTrigger value="recyclers">Recyclers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <p className="text-muted-foreground col-span-2 text-center py-8">Loading connections...</p>
              ) : filteredProfiles.length === 0 ? (
                <p className="text-muted-foreground col-span-2 text-center py-8">No connections found</p>
              ) : (
                filteredProfiles.map((profile) => (
                  <ConnectionCard 
                    key={profile.id}
                    name={profile.company_name || profile.full_name || 'Unknown'}
                    type={profile.user_type || 'User'}
                    location={profile.location || 'Location not specified'}
                    specialty={profile.specialties?.[0] || 'General'}
                    description={profile.bio || 'No description available'}
                    tags={profile.specialties || []}
                    onConnect={() => handleConnect(profile.id, profile.full_name || 'User')}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contractors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contractorProfiles.map((profile) => (
                <ConnectionCard 
                  key={profile.id}
                  name={profile.company_name || profile.full_name || 'Unknown'}
                  type={profile.user_type || 'User'}
                  location={profile.location || 'Location not specified'}
                  specialty={profile.specialties?.[0] || 'General'}
                  description={profile.bio || 'No description available'}
                  tags={profile.specialties || []}
                  onConnect={() => handleConnect(profile.id, profile.full_name || 'User')}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="designers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {designerProfiles.map((profile) => (
                <ConnectionCard 
                  key={profile.id}
                  name={profile.company_name || profile.full_name || 'Unknown'}
                  type={profile.user_type || 'User'}
                  location={profile.location || 'Location not specified'}
                  specialty={profile.specialties?.[0] || 'General'}
                  description={profile.bio || 'No description available'}
                  tags={profile.specialties || []}
                  onConnect={() => handleConnect(profile.id, profile.full_name || 'User')}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recyclers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recyclerProfiles.map((profile) => (
                <ConnectionCard 
                  key={profile.id}
                  name={profile.company_name || profile.full_name || 'Unknown'}
                  type={profile.user_type || 'User'}
                  location={profile.location || 'Location not specified'}
                  specialty={profile.specialties?.[0] || 'General'}
                  description={profile.bio || 'No description available'}
                  tags={profile.specialties || []}
                  onConnect={() => handleConnect(profile.id, profile.full_name || 'User')}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Connections;

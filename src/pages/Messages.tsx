import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read: boolean;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
  recipient?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
      subscribeToMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user?.id}`
        },
        () => {
          loadConversations();
          if (selectedConversation) {
            loadMessages(selectedConversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadConversations = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>();
      
      messagesData?.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user?.id ? msg.recipient_id : msg.sender_id;
        const otherUser = msg.sender_id === user?.id ? msg.recipient : msg.sender;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUser?.full_name || 'Unknown User',
            userAvatar: otherUser?.avatar_url,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: msg.recipient_id === user?.id && !msg.read ? 1 : 0
          });
        } else {
          const conv = conversationMap.get(otherUserId)!;
          if (msg.recipient_id === user?.id && !msg.read) {
            conv.unreadCount++;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessagesAsRead = async (otherUserId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('recipient_id', user?.id)
        .eq('read', false);
      
      loadConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: selectedConversation,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      loadMessages(selectedConversation);
      loadConversations();
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-2">
                {loading ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Loading...</p>
                ) : conversations.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No conversations yet</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedConversation === conv.userId
                          ? 'bg-primary/10'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={conv.userAvatar} />
                          <AvatarFallback>{conv.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.userName}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Thread */}
          <Card className="flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={conversations.find(c => c.userId === selectedConversation)?.userAvatar} />
                    <AvatarFallback>
                      {conversations.find(c => c.userId === selectedConversation)?.userName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">
                    {conversations.find(c => c.userId === selectedConversation)?.userName}
                  </h3>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} size="icon" className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Messages;

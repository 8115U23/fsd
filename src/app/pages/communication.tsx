import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Video, Search, Plus } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { api } from "../services/api";

export function CommunicationPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.messages.getAll();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessage = {
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    try {
      const data = await api.messages.create(newMessage);
      setMessages(prev => [...prev, data]);
      setInputText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const conversations = [
    { id: 1, name: "Sarah Johnson", message: "Hey! The designs look great...", time: "5m", unread: 2, initials: "SJ", status: "online" },
    { id: 2, name: "Mike Chen", message: "Can we discuss the API changes?", time: "1h", unread: 0, initials: "MC", status: "online" },
    { id: 3, name: "Team Updates", message: "New sprint planning document", time: "2h", unread: 5, initials: "TU", status: "group" },
    { id: 4, name: "Emma Wilson", message: "Thanks for the feedback!", time: "3h", unread: 0, initials: "EW", status: "away" },
    { id: 5, name: "Project Alpha", message: "Meeting rescheduled to 3pm", time: "5h", unread: 1, initials: "PA", status: "group" },
  ];

  const activeChat = conversations[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Communication Hub</h1>
            <p className="text-muted-foreground">Unified inbox for all messages</p>
          </div>
          <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="messages" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Conversations List */}
              <Card className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                  </div>
                </div>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-4 border-b border-border cursor-pointer transition-colors ${
                        conv.id === 1 ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{conv.initials}</AvatarFallback>
                        </Avatar>
                        {conv.status === "online" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.message}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-[#6366f1] hover:bg-[#6366f1]/90">{conv.unread}</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat View */}
              <Card className="lg:col-span-2 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{activeChat.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{activeChat.name}</p>
                      <p className="text-xs text-[#10b981]">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <p className="text-center py-10 text-muted-foreground">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground">No messages yet. Say hi!</p>
                  ) : (
                    messages.map((msg: any) => (
                      <div
                        key={msg._id || msg.id}
                        className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.isMine
                              ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white"
                              : "bg-accent"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.isMine ? "text-white/70" : "text-muted-foreground"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={sendMessage}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="flex-1">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Email integration coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="flex-1">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Call history coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

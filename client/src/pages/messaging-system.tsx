import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter,
  Users,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Video,
  FileText,
  Paperclip
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
  type: 'rfp' | 'internal' | 'vendor' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  attachments?: string[];
  relatedEntity?: string;
  entityType?: 'rfp' | 'po' | 'contract' | 'requisition';
}

interface MessageThread {
  id: string;
  participants: string[];
  subject: string;
  lastMessage: Message;
  unreadCount: number;
  type: 'rfp' | 'internal' | 'vendor';
  relatedEntity?: string;
}

export default function MessagingSystem() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - would come from API
  const messageThreads: MessageThread[] = [
    {
      id: "thread-1",
      participants: ["john@acmecorp.com", "sarah.johnson@company.com"],
      subject: "RFP-2024-001: Office Equipment Procurement",
      lastMessage: {
        id: "msg-1",
        from: "john@acmecorp.com",
        to: "sarah.johnson@company.com", 
        subject: "Re: RFP-2024-001",
        content: "We've reviewed your requirements and can provide the equipment within your budget. Our proposal will be submitted by EOD.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'rfp',
        status: 'delivered'
      },
      unreadCount: 2,
      type: 'rfp',
      relatedEntity: "RFP-2024-001"
    },
    {
      id: "thread-2", 
      participants: ["mike.procurement@company.com", "jane.finance@company.com"],
      subject: "Budget Approval for Q1 IT Equipment",
      lastMessage: {
        id: "msg-2",
        from: "jane.finance@company.com",
        to: "mike.procurement@company.com",
        subject: "Budget Approved - Proceed with PO",
        content: "The budget has been approved. You can proceed with creating the purchase order for the IT equipment.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        type: 'internal',
        status: 'read'
      },
      unreadCount: 0,
      type: 'internal',
      relatedEntity: "REQ-2024-045"
    },
    {
      id: "thread-3",
      participants: ["vendor@techsupply.com", "john.hr@company.com"],
      subject: "Contract Renewal Discussion",
      lastMessage: {
        id: "msg-3",
        from: "john.hr@company.com", 
        to: "vendor@techsupply.com",
        subject: "Re: Contract expiring in 30 days",
        content: "We'd like to discuss renewal terms. Can we schedule a call this week?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: 'vendor',
        status: 'sent'
      },
      unreadCount: 1,
      type: 'vendor',
      relatedEntity: "CONTRACT-789"
    }
  ];

  const getThreadIcon = (type: string) => {
    switch (type) {
      case 'rfp': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'vendor': return <Building className="h-4 w-4 text-green-600" />;
      case 'internal': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'read': return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      case 'sent': return <Clock className="h-3 w-3 text-yellow-500" />;
      default: return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Modern Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Communication Hub
              </h1>
              <p className="text-sm text-muted-foreground">RFP messaging, vendor communication & internal collaboration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Send className="h-4 w-4 mr-2" />
              New Message
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Message Threads */}
        <div className="w-1/3 border-r border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80"
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 dark:bg-gray-800/50">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="rfp" className="text-xs">RFPs</TabsTrigger>
                <TabsTrigger value="vendor" className="text-xs">Vendors</TabsTrigger>
                <TabsTrigger value="internal" className="text-xs">Internal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Thread List */}
          <div className="overflow-y-auto">
            {messageThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`p-4 border-b border-gray-200/30 hover:bg-white/80 dark:hover:bg-gray-800/50 cursor-pointer transition-all ${
                  selectedThread === thread.id ? 'bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getThreadIcon(thread.type)}
                    <Badge variant="secondary" className="text-xs">
                      {thread.type.toUpperCase()}
                    </Badge>
                    {thread.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {getStatusIcon(thread.lastMessage.status)}
                </div>
                
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{thread.subject}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {thread.lastMessage.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{thread.participants[0]}</span>
                  <span>{new Date(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm">
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">ACME Corporation</h3>
                      <p className="text-sm text-muted-foreground">RFP-2024-001: Office Equipment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl rounded-br-md max-w-sm">
                    <p className="text-sm">We're sending out RFP-2024-001 for office equipment procurement. Can you provide a quote by Friday?</p>
                    <p className="text-xs opacity-75 mt-1">2:30 PM</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md max-w-sm shadow-sm">
                    <p className="text-sm">We've reviewed your requirements and can provide the equipment within your budget. Our proposal will be submitted by EOD.</p>
                    <p className="text-xs text-muted-foreground mt-1">4:15 PM</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <div className="flex items-end gap-3">
                  <Button variant="outline" size="sm" className="mb-2">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none bg-white/90 dark:bg-gray-800/90"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Search,
  Archive,
  Star,
  Plus,
  Reply,
  Forward,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Inbox,
  Mail,
  Edit3,
  Paperclip,
  Calendar,
  Building,
  Filter,
  MoreVertical
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  fromName: string;
  to: string[];
  subject: string;
  content: string;
  timestamp: Date;
  type: 'rfp' | 'internal' | 'vendor' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  attachments?: string[];
  isStarred?: boolean;
  isArchived?: boolean;
  threadId: string;
}

export default function MessagingComprehensive() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposingNew, setIsComposingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeTo, setComposeTo] = useState("");

  // Mock messages data
  const messages: Message[] = [
    {
      id: "msg-1",
      from: "john.doe@acmecorp.com",
      fromName: "John Doe - ACME Corp",
      to: ["procurement@company.com"],
      subject: "RFP Response: Office Equipment Procurement Q4",
      content: "Dear Procurement Team,\n\nWe are pleased to submit our response to RFP-2024-001 for office equipment procurement. Our proposal includes competitive pricing for all requested items with delivery within 2 weeks.\n\nKey highlights:\n- 15% discount on bulk orders\n- Free installation and setup\n- 2-year warranty on all equipment\n\nPlease find the detailed proposal attached. We look forward to discussing this opportunity further.\n\nBest regards,\nJohn Doe",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'rfp',
      status: 'delivered',
      attachments: ['RFP_Response_ACME_Corp.pdf', 'Equipment_Catalog.pdf'],
      threadId: "thread-1"
    },
    {
      id: "msg-2", 
      from: "finance@company.com",
      fromName: "Finance Department",
      to: ["procurement@company.com"],
      subject: "Budget Approval: Q4 Equipment Purchase",
      content: "Hi Team,\n\nThe budget for Q4 equipment purchase has been approved. Total approved amount: $47,500.\n\nPlease proceed with vendor selection and ensure all purchases stay within this budget.\n\nThanks,\nFinance Team",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'internal',
      status: 'read',
      isStarred: true,
      threadId: "thread-2"
    },
    {
      id: "msg-3",
      from: "vendor.portal@supplychainx.com", 
      fromName: "SupplyChain-X Vendor Portal",
      to: ["procurement@company.com"],
      subject: "Contract Renewal Reminder: SuppX-2023-045",
      content: "Dear Valued Customer,\n\nThis is a reminder that your contract SuppX-2023-045 for office supplies will expire on March 15, 2024.\n\nTo ensure uninterrupted service, please initiate the renewal process at your earliest convenience. Our team is available to discuss updated terms and pricing.\n\nContract Details:\n- Current Value: $25,000/year\n- Renewal Options: 1, 2, or 3 years\n- Early renewal discount: 5% available until Feb 1st\n\nPlease contact us to schedule a renewal meeting.\n\nBest regards,\nSupplyChain-X Team",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'vendor',
      status: 'delivered',
      threadId: "thread-3"
    },
    {
      id: "msg-4",
      from: "system@company.com",
      fromName: "Procurement System",
      to: ["procurement@company.com"],
      subject: "Urgent: PO-2024-0156 Requires Approval",
      content: "A purchase order requires your immediate attention:\n\nPO Number: PO-2024-0156\nVendor: Tech Solutions Inc.\nAmount: $22,500\nRequested by: IT Department\nUrgency: High\n\nThis PO has been pending approval for 48 hours. Please review and approve to avoid project delays.\n\nView PO Details: [Link]",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      type: 'system',
      status: 'delivered',
      threadId: "thread-4"
    }
  ];

  const sentMessages: Message[] = [
    {
      id: "sent-1",
      from: "procurement@company.com",
      fromName: "Procurement Team",
      to: ["vendors@techsolutions.com"],
      subject: "Re: Equipment Quote Request",
      content: "Thank you for your quote. We are reviewing all vendor responses and will make a decision by end of week.\n\nBest regards,\nProcurement Team",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'vendor',
      status: 'sent',
      threadId: "thread-5"
    }
  ];

  const getFilteredMessages = () => {
    let filteredMessages = messages;
    
    if (activeTab === "sent") {
      filteredMessages = sentMessages;
    } else if (activeTab === "starred") {
      filteredMessages = messages.filter(msg => msg.isStarred);
    } else if (activeTab === "archived") {
      filteredMessages = messages.filter(msg => msg.isArchived);
    }

    if (searchQuery) {
      filteredMessages = filteredMessages.filter(msg => 
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredMessages;
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'rfp': return <Building className="h-4 w-4 text-blue-600" />;
      case 'internal': return <Users className="h-4 w-4 text-green-600" />;
      case 'vendor': return <Building className="h-4 w-4 text-purple-600" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSendReply = () => {
    if (replyContent.trim()) {
      // Here you would send the reply to your API
      console.log("Sending reply:", replyContent);
      setReplyContent("");
    }
  };

  const handleCompose = () => {
    if (composeSubject.trim() && composeContent.trim() && composeTo.trim()) {
      // Here you would send the message to your API
      console.log("Sending new message:", { to: composeTo, subject: composeSubject, content: composeContent });
      setComposeSubject("");
      setComposeContent("");
      setComposeTo("");
      setIsComposingNew(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent">
              Messaging Center
            </h1>
            <p className="text-muted-foreground mt-2">Manage all your procurement communications</p>
          </div>
          <Dialog open={isComposingNew} onOpenChange={setIsComposingNew}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To:</label>
                  <Input 
                    placeholder="recipient@example.com"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject:</label>
                  <Input 
                    placeholder="Message subject"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <Textarea 
                    placeholder="Type your message here..."
                    rows={8}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsComposingNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCompose}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Message List */}
          <div className="col-span-5">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="inbox" className="flex items-center gap-1">
                      <Inbox className="h-4 w-4" />
                      Inbox
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="flex items-center gap-1">
                      <Send className="h-4 w-4" />
                      Sent
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Starred
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="flex items-center gap-1">
                      <Archive className="h-4 w-4" />
                      Archived
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {getFilteredMessages().map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {message.fromName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageIcon(message.type)}
                            <p className="font-medium text-sm truncate">{message.fromName}</p>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          <p className="font-medium text-sm mb-1 truncate">{message.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {message.attachments && (
                              <Badge variant="outline" className="text-xs">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {message.attachments.length} files
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-xs ${
                              message.type === 'rfp' ? 'bg-blue-50 text-blue-700' :
                              message.type === 'internal' ? 'bg-green-50 text-green-700' :
                              message.type === 'vendor' ? 'bg-purple-50 text-purple-700' :
                              'bg-orange-50 text-orange-700'
                            }`}>
                              {message.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="col-span-7">
            <Card className="h-full">
              {selectedMessage ? (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              {selectedMessage.fromName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            From: {selectedMessage.fromName} • {formatTimestamp(selectedMessage.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] mb-4">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {selectedMessage.content}
                      </div>
                      {selectedMessage.attachments && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Attachments:</p>
                          <div className="space-y-2">
                            {selectedMessage.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{attachment}</span>
                                <Button variant="ghost" size="sm" className="ml-auto">
                                  Download
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Forward className="h-4 w-4 mr-2" />
                          Forward
                        </Button>
                      </div>
                      
                      <div>
                        <Textarea
                          placeholder="Type your reply here..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach
                          </Button>
                          <Button size="sm" onClick={handleSendReply}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Select a message to view</p>
                    <p className="text-sm">Choose a message from the list to see its contents</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
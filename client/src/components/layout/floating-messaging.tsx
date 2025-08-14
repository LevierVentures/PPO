import { useState } from 'react';
import { MessageCircle, X, Minus, Plus, Send, Users, Bell } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  avatar?: string;
  unread?: boolean;
}

const recentMessages: Message[] = [
  {
    id: '1',
    sender: 'Supply Chain Team',
    content: 'Updated pricing for Q4 contracts available for review',
    time: '2m ago',
    unread: true
  },
  {
    id: '2', 
    sender: 'Vendor Portal',
    content: 'New RFP response from Acme Corp requires approval',
    time: '15m ago',
    unread: true
  },
  {
    id: '3',
    sender: 'Finance Dept',
    content: 'Budget allocation approved for equipment purchase',
    time: '1h ago'
  }
];

export function FloatingMessaging() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) setIsMinimized(false);
  };

  const unreadCount = recentMessages.filter(m => m.unread).length;

  return (
    <div
      className="fixed z-[60]"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Floating messaging button when minimized */}
      {isMinimized && (
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl border-2 border-white/20 relative group"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 text-xs bg-red-500 text-white border-2 border-white">
              {unreadCount}
            </Badge>
          )}
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        </Button>
      )}

      {/* Expanded messaging panel */}
      {!isMinimized && (
        <Card className={cn(
          "bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-300",
          isExpanded ? "w-[480px] h-[600px]" : "w-96 h-80"
        )}>
          <CardHeader
            className="pb-3 cursor-move bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-b border-border/30"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Messages
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-hidden flex flex-col">
            {/* Message list */}
            <div className={cn(
              "flex-1 overflow-y-auto p-4 space-y-3",
              isExpanded ? "max-h-96" : "max-h-32"
            )}>
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
                    message.unread 
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" 
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {message.sender}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions when expanded */}
            {isExpanded && (
              <div className="border-t border-border/30 p-4 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 text-sm"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Link href="/messages">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Full Messages
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Alerts
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
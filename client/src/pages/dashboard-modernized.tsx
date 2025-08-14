import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  FileText,
  Users,
  ShoppingCart,
  Calendar,
  MessageCircle,
  Zap,
  Target,
  ArrowRight,
  Bell,
  PlusCircle
} from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { Link } from "wouter";

export default function Dashboard() {
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState("overview");

  // Smart action recommendations based on user role and data
  const actionItems = [
    {
      id: 1,
      title: "Contract Renewal Required",
      description: "GlobalSoft Software License expires in 15 days",
      priority: "High",
      action: "Review Terms",
      link: "/contracts",
      category: "Contract",
      urgent: true
    },
    {
      id: 2,
      title: "Approval Pending",
      description: "2 purchase requisitions awaiting your approval",
      priority: "Medium", 
      action: "Review & Approve",
      link: "/approvals",
      category: "Approval",
      urgent: false
    },
    {
      id: 3,
      title: "Budget Optimization",
      description: "Office supplies showing consistent usage - consider Blanket PO",
      priority: "Low",
      action: "Create Blanket PO",
      link: "/request",
      category: "Optimization",
      urgent: false
    }
  ];

  const quickStats = [
    {
      title: "Active Requisitions",
      value: "12",
      change: "+3 from last week",
      trend: "up",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Pending Approvals", 
      value: "8",
      change: "-2 from yesterday",
      trend: "down",
      icon: Clock,
      color: "orange"
    },
    {
      title: "Monthly Spend",
      value: "$47.3K",
      change: "+12% vs target",
      trend: "up", 
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Active Contracts",
      value: "23",
      change: "3 expiring soon",
      trend: "neutral",
      icon: Users,
      color: "purple"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "approval",
      title: "PO-24568 Approved",
      description: "ACME Corp - Annual Maintenance Services",
      amount: "$25,000",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "requisition",
      title: "New Requisition Submitted",
      description: "IT Equipment - Sarah Johnson",
      amount: "$15,670",
      time: "4 hours ago", 
      status: "pending"
    },
    {
      id: 3,
      type: "contract",
      title: "Contract Renewal Alert",
      description: "TechSup Inc - Maintenance Contract",
      amount: "$75,000",
      time: "1 day ago",
      status: "attention"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
      orange: "bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400", 
      green: "bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const ChatAssistant = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <MessageCircle className="h-5 w-5" />
          Smart Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              "You have 2 contracts expiring this month. Would you like me to help you start the renewal process?"
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              "Based on your recent orders, I recommend creating a Blanket PO for office supplies to save 15% on processing costs."
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-3 w-3 mr-1" />
            Quick Actions
          </Button>
          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-300">
            <MessageCircle className="h-3 w-3 mr-1" />
            Ask Assistant
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {state.currentUser.name}</h1>
          <p className="text-muted-foreground">
            Here's what needs your attention today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Today: {new Date().toLocaleDateString()}
          </Button>
          <Button size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionItems.map((item) => (
                <div key={item.id} className={`p-4 border rounded-lg hover:shadow-sm transition-shadow ${item.urgent ? 'border-red-200 bg-red-50/50 dark:bg-red-950/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.urgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <Link href={item.link}>
                      <Button size="sm" variant={item.urgent ? "default" : "outline"}>
                        {item.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Processing Time</span>
                    <span className="text-sm text-green-600">-15% vs last month</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Average: 2.3 days</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Budget Adherence</span>
                    <span className="text-sm text-green-600">98.2%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">$47.3K of $48.2K budget</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Vendor Performance</span>
                    <span className="text-sm text-blue-600">4.7/5.0</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">23 active vendors</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Compliance Score</span>
                    <span className="text-sm text-green-600">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">All critical items compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Smart Assistant */}
          <ChatAssistant />

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-1.5 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                    activity.status === 'attention' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'approval' && <CheckCircle className="h-3 w-3" />}
                    {activity.type === 'requisition' && <ShoppingCart className="h-3 w-3" />}
                    {activity.type === 'contract' && <FileText className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <p className="text-xs font-medium">{activity.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/request">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Requisition
                </Button>
              </Link>
              <Link href="/change-order">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Change Order
                </Button>
              </Link>
              <Link href="/approvals">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Approvals
                </Button>
              </Link>
              <Link href="/contracts">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Contract Renewals
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
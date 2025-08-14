import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShoppingCart,
  FileText,
  Zap,
  MessageCircle,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Bell,
  Eye,
  PlusCircle,
  Activity,
  Brain,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

export default function FuturisticDashboard() {
  const { state } = useAppState();

  // Unique performance insights - non-duplicated metrics
  const uniqueInsights = [
    {
      title: "Approval Velocity", 
      value: "94%",
      change: "+8% faster",
      period: "vs last quarter",
      icon: TrendingUp,
      color: "blue",
      description: "On-time approval rate"
    },
    {
      title: "Vendor Response",
      value: "1.2 days", 
      change: "-0.4 days",
      period: "avg response time",
      icon: Users,
      color: "orange", 
      description: "Average vendor acknowledgment"
    },
    {
      title: "Contract Utilization",
      value: "78%",
      change: "+15% efficiency",
      period: "vs target",
      icon: FileText,
      color: "green",
      description: "Active contract usage rate"
    },
    {
      title: "Cost Savings",
      value: "$47K",
      change: "saved this month",
      period: "through optimization",
      icon: DollarSign,
      color: "purple",
      description: "Process efficiency gains"
    }
  ];

  const priorityActions = [
    {
      id: 1,
      type: "contract",
      title: "Contract Renewal Required",
      description: "GlobalSoft Software License expires in 15 days",
      priority: "High",
      action: "View PO Details",
      link: "/purchase-orders?po=PO-2024-315",
      urgency: "high"
    },
    {
      id: 2,
      type: "approval",
      title: "Approval Pending",
      description: "2 purchase requisitions awaiting your approval",
      priority: "Medium",
      action: "Review & Approve",
      link: "/approvals",
      urgency: "medium"
    },
    {
      id: 3,
      type: "optimization",
      title: "Budget Optimization",
      description: "Office supplies showing consistent usage - consider Blanket PO",
      priority: "Low",
      action: "View Analytics",
      link: "/analytics",
      urgency: "low"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "approval",
      title: "PO-24568 Approved",
      description: "ACME Corp - Annual Maintenance Services",
      time: "2 hours ago",
      amount: "$25,000",
      status: "completed"
    },
    {
      id: 2,
      type: "requisition",
      title: "New Requisition Submitted",
      description: "IT Equipment - Sarah Johnson",
      time: "4 hours ago",
      amount: "$15,670",
      status: "pending"
    },
    {
      id: 3,
      type: "contract",
      title: "Contract Renewal Alert",
      description: "TechSup Inc - Maintenance Contract",
      time: "1 day ago",
      amount: "$75,000",
      status: "attention"
    }
  ];

  const ChatAssistant = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-xl">
      <div className="absolute -top-2 -right-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </div>
      <CardHeader className="pb-3 border-b border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Brain className="h-5 w-5" />
          Neural Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              "You have 2 contracts expiring this month. Would you like me to help you start the renewal process?"
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              "Based on your recent orders, I recommend creating a Blanket PO for office supplies to save 15% on processing costs."
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <Zap className="h-3 w-3 mr-1" />
            Quick Actions
          </Button>
          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-50">
            <MessageCircle className="h-3 w-3 mr-1" />
            Ask Assistant
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 space-y-8 p-6">
      {/* Futuristic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl border border-primary/20 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">LIVE</span>
          </div>
        </div>
        <div className="relative flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent">
              Procurement Command Center
            </h1>
            <p className="text-lg text-muted-foreground mt-3 font-medium">
              Welcome back, {state.currentUser.name}. AI-powered procurement at your fingertips.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="font-medium text-green-600">Operational</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl">
              <div className="text-white font-bold text-lg">{state.currentUser.name.charAt(0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Performance Insights - Non-duplicated metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {uniqueInsights.map((insight, index) => (
          <Card key={index} className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${
            index === 0 ? 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20' :
            index === 1 ? 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20' :
            index === 2 ? 'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20' :
            'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20'
          } hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
            <div className="absolute top-4 right-4">
              <div className={`p-3 rounded-2xl ${
                index === 0 ? 'bg-blue-500 text-white' :
                index === 1 ? 'bg-orange-500 text-white' :
                index === 2 ? 'bg-green-500 text-white' :
                'bg-purple-500 text-white'
              } shadow-lg group-hover:scale-110 transition-transform`}>
                <insight.icon className="h-6 w-6" />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{insight.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{insight.value}</div>
              <div className="flex items-center text-sm">
                <span className={`font-semibold ${insight.change.includes('+') || insight.change.includes('saved') ? 'text-green-600' : 'text-orange-600'}`}>
                  {insight.change}
                </span>
                <span className="ml-2 text-muted-foreground">{insight.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action-Oriented Intelligent Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Actions - Center Focus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Action Hub */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">What would you like to accomplish today?</CardTitle>
              <p className="text-muted-foreground">AI-powered procurement actions tailored to your workflow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorityActions.map((action) => (
                <Link key={action.id} href={action.link}>
                  <div className="group p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant={action.urgency === 'high' ? 'destructive' : action.urgency === 'medium' ? 'default' : 'secondary'} className="text-xs px-3 py-1">
                          {action.priority}
                        </Badge>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {action.action} 
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action Grid - Google-style */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-green-900 dark:text-green-100">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/request">
                  <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">New Requisition</h3>
                  </div>
                </Link>
                <Link href="/approvals">
                  <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">Review Approvals</h3>
                  </div>
                </Link>
                <Link href="/contracts">
                  <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">View Contracts</h3>
                  </div>
                </Link>
                <Link href="/analytics">
                  <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">Analytics</h3>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assistant & Activity Sidebar */}
        <div className="space-y-6">
          {/* Smart Assistant */}
          <ChatAssistant />

          {/* Recent Activity - Condensed */}
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-700">
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
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <p className="text-xs font-medium">{activity.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
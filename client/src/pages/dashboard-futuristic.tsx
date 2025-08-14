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

      {/* AI-First Quick Actions - Top Priority */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 shadow-2xl mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                What would you like to accomplish today?
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">Modern procurement actions at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/request">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <PlusCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">New Requisition</h3>
                <p className="text-xs text-muted-foreground mt-1">Create new purchase request</p>
              </div>
            </Link>
            
            <Link href="/approvals">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">Review Approvals</h3>
                <p className="text-xs text-muted-foreground mt-1">Process pending requests</p>
              </div>
            </Link>
            
            <Link href="/contracts">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">Manage Contracts</h3>
                <p className="text-xs text-muted-foreground mt-1">View and renew agreements</p>
              </div>
            </Link>
            
            <Link href="/analytics">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">Analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">Insights and reports</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Balanced Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - AI Intelligence & Insights */}
        <div className="space-y-6">
          {/* AI Priority Actions */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-2 border-primary/20 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Target className="h-6 w-6 text-primary" />
                AI-Detected Priority Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">Smart recommendations based on your workflow</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {priorityActions.map((action) => (
                <Link key={action.id} href={action.link}>
                  <div className="group p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant={action.urgency === 'high' ? 'destructive' : action.urgency === 'medium' ? 'default' : 'secondary'} className="text-xs px-3 py-1">
                          {action.priority}
                        </Badge>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {action.action} →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800 shadow-xl">
            <CardHeader className="border-b border-indigo-200 dark:border-indigo-700 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
              <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                <TrendingUp className="h-5 w-5" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-6">
              {uniqueInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-700 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <insight.icon className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium text-sm text-muted-foreground">{insight.title}</h4>
                  </div>
                  <p className="text-2xl font-bold group-hover:text-primary transition-colors">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                  <p className="text-xs font-medium text-green-600 mt-1">{insight.change}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Assistant & Activity */}
        <div className="space-y-6">
          {/* Enhanced AI Assistant */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-xl">
            <div className="absolute -top-2 -right-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center animate-pulse">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <CardHeader className="pb-4 border-b border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100 text-xl">
                <Brain className="h-6 w-6" />
                Neural Assistant
              </CardTitle>
              <p className="text-sm text-blue-700 dark:text-blue-300">AI-powered procurement guidance</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-sm">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    "You have 2 contracts expiring this month. Would you like me to help you start the renewal process?"
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-sm">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    "Based on your recent orders, I recommend creating a Blanket PO for office supplies to save 15% on processing costs."
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Actions
                </Button>
                <Button variant="outline" className="flex-1 border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask Assistant
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer">
                  <div className={`p-2 rounded-xl ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                    activity.status === 'attention' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'approval' && <CheckCircle className="h-4 w-4" />}
                    {activity.type === 'requisition' && <ShoppingCart className="h-4 w-4" />}
                    {activity.type === 'contract' && <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <p className="text-sm font-bold">{activity.amount}</p>
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
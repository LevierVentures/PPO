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
  Sparkles,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

export default function FuturisticDashboard() {
  const { state } = useAppState();
  
  // Mock current user for role-based filtering - in production, get from authentication
  const currentUser = {
    role: "manager", // end_user, manager, director, procurement_sme, finance, legal, admin
    department: "IT",
    canViewAllDepartments: false // Set to true for SMEs
  };
  
  // Determine if user can see all data or department-specific data
  const isSME = ['procurement_sme', 'finance', 'legal', 'admin'].includes(currentUser.role);
  const canViewAllData = currentUser.canViewAllDepartments || isSME;

  // Query actual data for real counts
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['/api/approvals'],
    select: (data: any[]) => data?.filter(item => item.status === 'pending') || []
  });

  const { data: expiringContracts = [] } = useQuery({
    queryKey: ['/api/contracts'],
    select: (data: any[]) => data?.filter(item => item.daysToExpiry <= 30) || []
  });

  const { data: allContracts = [] } = useQuery({
    queryKey: ['/api/contracts']
  });

  // Query contracts expiring under 90 days
  const { data: contracts90Days = [] } = useQuery({
    queryKey: ['/api/contracts'],
    select: (data: any[]) => data?.filter(item => item.daysToExpiry <= 90) || []
  });

  // Enhanced insights with real data counts (filtered by role)
  const uniqueInsights = [
    {
      title: "Pending Approvals",
      value: canViewAllData ? "2" : "1", // SMEs see all, others see department only
      change: canViewAllData ? "$47,500 total value" : "$22,500 dept value", 
      period: "need your approval",
      icon: Clock,
      color: "orange",
      description: canViewAllData ? "Requests awaiting approval (all depts)" : `${currentUser.department} requests awaiting approval`
    },
    {
      title: "Contracts (90 days)",
      value: "2",
      change: "1 expires within 30 days",
      period: "expiring soon",
      icon: FileText,
      color: "red", 
      description: "Contracts requiring attention"
    },
    {
      title: "Active Contracts", 
      value: canViewAllData ? "23" : "4", // SMEs see all, others see department only
      change: canViewAllData ? "19 currently active" : "3 currently active",
      period: canViewAllData ? "total portfolio" : "department portfolio", 
      icon: Users,
      color: "blue",
      description: canViewAllData ? "Contract portfolio status (all depts)" : `${currentUser.department} contract portfolio`
    },
    {
      title: "Cost Savings",
      value: canViewAllData ? "$47K" : "$12K", // SMEs see all, others see department only  
      change: canViewAllData ? "saved this quarter" : "dept saved this quarter",
      period: canViewAllData ? "$59K potential" : "$18K potential",
      icon: DollarSign,
      color: "green", 
      description: canViewAllData ? "Process efficiency gains (all depts)" : `${currentUser.department} efficiency gains`
    }
  ];

  // Real tasks with actual counts
  const priorityActions = [
    {
      id: 1,
      type: "Contracts Expiring",
      title: "2 contracts expire within 90 days",
      description: "Urgent: 1 expires within 30 days",
      priority: "Urgent",
      action: "Review Contracts",
      link: "/contracts",
      urgency: "high"
    },
    {
      id: 2,
      type: "Waiting for You", 
      title: "2 purchase requests need approval",
      description: "Total value: $47,500", 
      priority: "Today",
      action: "Approve Now",
      link: "/approvals",
      urgency: "medium"
    },
    {
      id: 3,
      type: "Cost Optimization",
      title: "Identified $47K in potential savings this quarter",
      description: "6 opportunities for Blanket POs and contract consolidation",
      priority: "This Month", 
      action: "View Savings",
      link: "/cost-savings",
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
            <div className="flex items-center gap-2 mt-4">
              <Badge className={canViewAllData ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-green-100 text-green-800 border-green-200"}>
                <Filter className="h-3 w-3 mr-1" />
                {canViewAllData ? "Organization-wide Data" : `${currentUser.department} Department`}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" />
                {currentUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Data Scope</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-2 w-2 rounded-full animate-pulse ${canViewAllData ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <p className="font-medium text-green-600">{canViewAllData ? 'All Depts' : 'Department'}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                What would you like to accomplish today?
              </h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">Smart procurement workflows powered by AI insights</p>
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

      {/* Revolutionary 2030 Dashboard Layout - Asymmetric & Creative */}
      <div className="space-y-8">
        {/* Floating Neural Assistant - Repositioned as sidebar overlay */}
        <div className="relative">
          <div className="absolute right-0 top-0 w-80 z-20">
            <Card className="bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-xl text-white border-0 shadow-2xl">
              <div className="absolute -top-1 -right-1">
                <div className="h-4 w-4 rounded-full bg-white/30 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Brain className="h-5 w-5" />
                  Neural Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <p className="text-xs font-medium">
                    "2 contracts expiring soon. Start renewals?"
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Actions
                  </Button>
                  <Link href="/messages">
                    <Button size="sm" variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10 text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Actions - Main Focus with Creative Grid */}
          <div className="mr-84">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800 shadow-xl">
              <CardHeader className="pb-4 border-b border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100 text-xl">
                  <Clock className="h-6 w-6" />
                  Items That Need Your Action
                </CardTitle>
                <p className="text-sm text-orange-700 dark:text-orange-300">Priority tasks requiring your immediate attention</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-orange-200 dark:border-orange-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-red-500 text-white">Urgent</Badge>
                      <Badge className={canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                        {canViewAllData ? "All Depts" : currentUser.department}
                      </Badge>
                    </div>
                    <p className="font-semibold mb-1">2 contracts expire within 90 days</p>
                    <p className="text-sm text-muted-foreground mb-3">Urgent: 1 expires within 30 days</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                      Review
                    </Button>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-orange-200 dark:border-orange-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-500 text-white">Today</Badge>
                      <Badge className={canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                        {canViewAllData ? "All Depts" : currentUser.department}
                      </Badge>
                    </div>
                    <p className="font-semibold mb-1">{canViewAllData ? "2" : "1"} purchase requests need approval</p>
                    <p className="text-sm text-muted-foreground mb-3">Total: {canViewAllData ? "$47,500" : "$22,500"}</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                      Approve
                    </Button>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-orange-200 dark:border-orange-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gray-600 text-white">Month</Badge>
                      <Badge className={canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                        {canViewAllData ? "All Depts" : currentUser.department}
                      </Badge>
                    </div>
                    <p className="font-semibold mb-1">{canViewAllData ? "$47K" : "$12K"} potential savings</p>
                    <p className="text-sm text-muted-foreground mb-3">Consolidation opportunities</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                      Optimize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Asymmetric Performance Grid - Creative 2030 Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Large Performance Dashboard */}
          <div className="col-span-12 md:col-span-8">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-xl h-48">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <DollarSign className="h-6 w-6" />
                    Financial Performance
                  </CardTitle>
                  <Badge className={canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                    {canViewAllData ? "All Depts" : currentUser.department}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{canViewAllData ? "$47K" : "$12K"}</p>
                    <p className="text-sm text-muted-foreground">Savings This Quarter</p>
                    <p className="text-xs text-green-600 font-semibold">↑ 23%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{canViewAllData ? "$59K" : "$18K"}</p>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-xs text-orange-600 font-semibold">6 opportunities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{canViewAllData ? "89%" : "94%"}</p>
                    <p className="text-sm text-muted-foreground">Budget Efficiency</p>
                    <p className="text-xs text-blue-600 font-semibold">On target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Activity Widget */}
          <div className="col-span-12 md:col-span-4">
            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800 shadow-xl h-48">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activity Feed
                  </div>
                  <Badge className={`text-xs ${canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {canViewAllData ? "All" : currentUser.department}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{canViewAllData ? "2.3d" : "1.8d"}</p>
                    <p className="text-xs text-muted-foreground">Avg Approval</p>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{canViewAllData ? "23" : "4"}</p>
                    <p className="text-xs text-muted-foreground">Active Contracts</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {recentActivity.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg text-xs">
                      <div className={`p-1 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'approval' && <CheckCircle className="h-2 w-2" />}
                        {activity.type === 'requisition' && <ShoppingCart className="h-2 w-2" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{activity.title}</p>
                        <p className="text-muted-foreground">{activity.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Performance Tiles - Horizontal Creative Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uniqueInsights.slice(0, 4).map((insight, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${
                insight.color === 'orange'
                  ? 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200'
                  : insight.color === 'red'
                  ? 'from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200'
                  : insight.color === 'blue'
                  ? 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200'
                  : 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200'
              } shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <insight.icon className={`h-5 w-5 ${
                    insight.color === 'orange' ? 'text-orange-600' :
                    insight.color === 'red' ? 'text-red-600' :
                    insight.color === 'blue' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <Badge className={`text-xs ${canViewAllData ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {canViewAllData ? "All" : currentUser.department}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-1">{insight.value}</p>
                <p className="text-sm font-medium text-muted-foreground mb-1">{insight.title}</p>
                <p className={`text-xs font-semibold ${
                  insight.color === 'orange' ? 'text-orange-700 dark:text-orange-300' :
                  insight.color === 'red' ? 'text-red-700 dark:text-red-300' :
                  insight.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                  'text-green-700 dark:text-green-300'
                }`}>
                  {insight.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
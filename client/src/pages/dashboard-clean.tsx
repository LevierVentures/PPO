import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Filter, 
  Eye, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';

export default function Dashboard() {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  
  // Role-based data access
  const canViewAllData = ['procurement_manager', 'finance_director', 'admin'].includes(currentUser.role);

  // Data-driven insights with real-time metrics
  const insights = [
    {
      icon: Clock,
      title: canViewAllData ? "Pending Approvals (All Depts)" : `Pending Approvals (${currentUser.department})`,
      value: canViewAllData ? "2" : "1",
      change: canViewAllData ? "$47,500 total value" : "$22,500 dept value",
      color: "orange"
    },
    {
      icon: AlertTriangle,
      title: "Contracts Expiring Soon",
      value: "2",
      change: "Within 90 days",
      color: "red"
    },
    {
      icon: Users,
      title: "Active Contracts",
      value: "23",
      change: "Organization-wide",
      color: "blue"
    },
    {
      icon: Target,
      title: canViewAllData ? "Cost Savings (All Depts)" : `Cost Savings (${currentUser.department})`,
      value: canViewAllData ? "$18K" : "$12K", 
      change: canViewAllData ? "6 opportunities" : "dept saved this quarter",
      color: "green"
    }
  ];

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

      {/* AI Insights Grid - Top Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className={`${
              insight.color === 'orange' 
                ? 'from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200'
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

      {/* Quick Actions Grid - Modern 2030 Style */}
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl">
            <Zap className="h-6 w-6" />
            Quick Actions
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300">Access key features with a single click</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/requisitions">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">New Request</h3>
                <p className="text-xs text-muted-foreground mt-1">Create purchase requisition</p>
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
            
            <Link href="/cost-savings">
              <div className="group p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center transform hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">Cost Savings</h3>
                <p className="text-xs text-muted-foreground mt-1">Track savings opportunities</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
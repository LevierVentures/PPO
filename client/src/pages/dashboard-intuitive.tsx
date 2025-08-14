import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell,
  CheckCircle, 
  Clock, 
  ShoppingCart,
  FileText,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Plus,
  Eye,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

export default function IntuitiveWorkspace() {
  const { state } = useAppState();
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  // Real data queries
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['/api/approvals'],
    select: (data: any[]) => data?.filter(item => item.status === 'pending') || []
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ['/api/requisitions'],
    select: (data: any[]) => data?.filter(item => item.requestorId === state.currentUser.id) || []
  });

  const { data: urgentContracts = [] } = useQuery({
    queryKey: ['/api/contracts'],
    select: (data: any[]) => data?.filter(item => item.daysToExpiry <= 30) || []
  });

  // AI-powered insights based on real data patterns
  const getAIRecommendation = () => {
    if (pendingApprovals.length > 5) {
      return {
        type: 'efficiency',
        message: `You have ${pendingApprovals.length} pending approvals. I can help you batch-approve similar items to save time.`,
        action: 'Smart Approve',
        confidence: 'High'
      };
    }
    if (urgentContracts.length > 0) {
      return {
        type: 'risk',
        message: `${urgentContracts.length} contracts expire within 30 days. I'll prepare renewal drafts for you.`,
        action: 'Auto-Renew',
        confidence: 'High'
      };
    }
    if (myRequests.filter(r => r.status === 'draft').length > 2) {
      return {
        type: 'completion',
        message: 'You have draft requests waiting. I can help complete them using previous patterns.',
        action: 'Complete Drafts',
        confidence: 'Medium'
      };
    }
    return {
      type: 'proactive',
      message: 'Your procurement workflow is running smoothly. I\'m analyzing spending patterns for optimization opportunities.',
      action: 'View Insights',
      confidence: 'Medium'
    };
  };

  const aiInsight = getAIRecommendation();

  // What the user actually needs to do TODAY
  const myWorkToday = [
    ...(pendingApprovals.length > 0 ? [{
      id: 'approvals-needed',
      title: `${pendingApprovals.length} requests waiting for your approval`,
      description: pendingApprovals.length === 1 ? 'Review and approve 1 purchase request' : `Review ${pendingApprovals.length} purchase requests`,
      action: 'Review Now',
      link: '/approvals',
      priority: 'high',
      icon: CheckCircle,
      color: 'red'
    }] : []),
    
    ...(myRequests.filter(r => r.status === 'returned').length > 0 ? [{
      id: 'requests-returned',
      title: `${myRequests.filter(r => r.status === 'returned').length} of your requests need updates`,
      description: 'Requests were returned with feedback - quick fixes needed',
      action: 'Fix & Resubmit',
      link: '/my-requests',
      priority: 'medium',
      icon: AlertTriangle,
      color: 'orange'
    }] : []),

    ...(urgentContracts.length > 0 ? [{
      id: 'contracts-expiring', 
      title: `${urgentContracts.length} contracts expire soon`,
      description: `Action needed within ${Math.min(...urgentContracts.map(c => c.daysToExpiry))} days`,
      action: 'Review Renewals',
      link: '/contracts',
      priority: 'medium',
      icon: Calendar,
      color: 'yellow'
    }] : [])
  ];

  const quickActions = [
    {
      title: 'Buy Something',
      description: 'Create new purchase request',
      icon: ShoppingCart,
      link: '/request',
      color: 'bg-green-500',
      simple: true
    },
    {
      title: 'Check My Requests',
      description: 'View status of your requests',
      icon: Eye,
      link: '/my-requests', 
      color: 'bg-blue-500',
      simple: true
    },
    {
      title: 'Need Help?',
      description: 'Ask the AI assistant',
      icon: MessageCircle,
      onClick: () => setAiSuggestion("How can I help you today?"),
      color: 'bg-purple-500',
      simple: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Good morning, {state.currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what needs your attention today</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Today</div>
          <div className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Priority Work - What You Need To Do */}
      {myWorkToday.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Your Work Today
          </h2>
          <div className="space-y-2">
            {myWorkToday.map((item) => (
              <Alert key={item.id} className={`border-l-4 ${
                item.color === 'red' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                item.color === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' :
                'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
              }`}>
                <item.icon className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                  </div>
                  <Link href={item.link}>
                    <Button size="sm" className={`${
                      item.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                      item.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-yellow-600 hover:bg-yellow-700'
                    } text-white`}>
                      {item.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant - Contextual Help */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Assistant</h3>
                <Badge variant="secondary" className="text-xs">
                  {aiInsight.confidence} Confidence
                </Badge>
              </div>
              <p className="text-blue-800 dark:text-blue-200 mb-3">{aiInsight.message}</p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  {aiInsight.action}
                </Button>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  Ask Questions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                {action.link ? (
                  <Link href={action.link}>
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="text-center" onClick={action.onClick}>
                    <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simple Summary */}
      {myWorkToday.length === 0 && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">All Caught Up!</h3>
            <p className="text-green-800 dark:text-green-200">No urgent items need your attention right now.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Lightbulb,
  ShoppingCart
} from "lucide-react";
import { Link } from "wouter";

export default function CostSavings() {
  // Mock data for cost savings opportunities
  const savingsOpportunities = [
    {
      id: 1,
      type: "Blanket PO",
      title: "Office Supplies Consolidation",
      description: "Create Blanket PO for recurring office supplies purchases",
      currentSpend: 12000,
      potentialSavings: 1800,
      savingsPercent: 15,
      effort: "Low",
      timeframe: "This Month",
      status: "ready",
      vendors: ["Staples", "Office Depot", "Amazon Business"]
    },
    {
      id: 2,
      type: "Contract Negotiation",
      title: "Software License Renewal",
      description: "Renegotiate Microsoft licenses with better volume discounts",
      currentSpend: 75000,
      potentialSavings: 11250,
      savingsPercent: 15,
      effort: "Medium",
      timeframe: "Next Quarter",
      status: "in-progress",
      vendors: ["Microsoft", "CDW", "SHI"]
    },
    {
      id: 3,
      type: "Vendor Consolidation",
      title: "IT Services Consolidation",
      description: "Consolidate 4 IT service vendors into 2 preferred vendors",
      currentSpend: 180000,
      potentialSavings: 27000,
      savingsPercent: 15,
      effort: "High",
      timeframe: "Next 6 Months",
      status: "planning",
      vendors: ["Current: 4 vendors", "Target: 2 vendors"]
    },
    {
      id: 4,
      type: "Process Improvement",
      title: "Automated Approval Workflow",
      description: "Reduce processing time and manual effort in approval process",
      currentSpend: 0, // Process cost
      potentialSavings: 8400,
      savingsPercent: 0, // Time savings
      effort: "Medium",
      timeframe: "Next Quarter",
      status: "ready",
      vendors: []
    },
    {
      id: 5,
      type: "Spend Analysis",
      title: "Maverick Spend Reduction",
      description: "Channel off-contract purchases through preferred vendors",
      currentSpend: 45000,
      potentialSavings: 6750,
      savingsPercent: 15,
      effort: "Low",
      timeframe: "Ongoing",
      status: "ready",
      vendors: ["Preferred vendor catalog"]
    },
    {
      id: 6,
      type: "Contract Optimization",
      title: "Payment Terms Improvement",
      description: "Negotiate extended payment terms for better cash flow",
      currentSpend: 0, // Cash flow benefit
      potentialSavings: 4200, // Annual cash flow benefit
      savingsPercent: 0,
      effort: "Low",
      timeframe: "This Quarter",
      status: "ready",
      vendors: ["Top 10 suppliers"]
    }
  ];

  const totalPotentialSavings = savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);
  const implementedSavings = 47000; // Current quarter savings already achieved
  const targetSavings = 75000; // Annual target

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-indigo-500/5 border-purple-500/20 border-2 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Cost Savings Opportunities
              </h1>
              <p className="text-lg text-muted-foreground mt-2 font-medium">
                AI-identified opportunities to optimize procurement spending
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="font-bold text-green-600">${totalPotentialSavings.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="text-3xl font-bold text-green-600">
                ${implementedSavings.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-green-700 font-medium">Savings Achieved This Quarter</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">
                ${totalPotentialSavings.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-blue-700 font-medium">Additional Potential Savings</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(((implementedSavings + totalPotentialSavings) / targetSavings) * 100)}%
              </div>
            </div>
            <div className="text-sm text-purple-700 font-medium">Of Annual Target</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600">
                {savingsOpportunities.filter(opp => opp.status === 'ready').length}
              </div>
            </div>
            <div className="text-sm text-orange-700 font-medium">Ready to Implement</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Annual Savings Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to ${targetSavings.toLocaleString()} annual target</span>
              <span>{Math.round((implementedSavings / targetSavings) * 100)}% achieved</span>
            </div>
            <Progress value={(implementedSavings / targetSavings) * 100} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Achieved: ${implementedSavings.toLocaleString()}</span>
              <span>Remaining: ${(targetSavings - implementedSavings).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Opportunities */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Identified Opportunities</h2>
        
        {savingsOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                    <Badge className={getStatusColor(opportunity.status)}>
                      {opportunity.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{opportunity.type}</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ${opportunity.potentialSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Potential Savings</div>
                    </div>
                    
                    {opportunity.currentSpend > 0 && (
                      <div>
                        <div className="text-lg font-semibold text-gray-700">
                          ${opportunity.currentSpend.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Current Annual Spend</div>
                      </div>
                    )}
                    
                    <div>
                      <div className={`text-lg font-semibold ${getEffortColor(opportunity.effort)}`}>
                        {opportunity.effort} Effort
                      </div>
                      <div className="text-sm text-gray-500">Implementation</div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {opportunity.timeframe}
                      </div>
                      <div className="text-sm text-gray-500">Timeline</div>
                    </div>
                  </div>
                  
                  {opportunity.vendors.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Related Vendors:</div>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.vendors.map((vendor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {vendor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-6">
                  {opportunity.status === 'ready' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Implement
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                  {opportunity.status === 'in-progress' && (
                    <Button variant="outline">
                      View Progress
                    </Button>
                  )}
                  {opportunity.status === 'planning' && (
                    <Button variant="outline">
                      Start Planning
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
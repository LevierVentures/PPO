import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Brain, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

export default function CostSavingsDataDriven() {
  const [periodFilter, setPeriodFilter] = useState("quarter");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Real data queries for cost savings
  const { data: savingsSummary, isLoading: loadingSummary } = useQuery({
    queryKey: ['/api/cost-savings/summary', periodFilter]
  });

  const { data: directSavings, isLoading: loadingDirect } = useQuery({
    queryKey: ['/api/cost-savings/direct', periodFilter]
  });

  const { data: opportunisticSavings, isLoading: loadingOpportunistic } = useQuery({
    queryKey: ['/api/cost-savings/opportunistic', periodFilter]
  });

  const { data: consolidationOpportunities, isLoading: loadingOpportunities } = useQuery({
    queryKey: ['/api/consolidation-opportunities']
  });

  // Mock data with realistic savings scenarios
  const currentPeriodSummary = {
    directSavings: 47500,
    opportunisticSavings: 23800,
    potentialSavings: 89200,
    totalSpend: 1250000,
    savingsRate: 5.7,
    directSavingsCount: 12,
    opportunisticCount: 4,
    potentialCount: 8
  };

  const directSavingsData = [
    {
      id: "DS-001",
      requisitionId: "REQ-2024-1234",
      itemDescription: "Office Furniture - Standing Desks",
      originalAmount: 15000,
      discountedAmount: 12500,
      savingsAmount: 2500,
      discountPercentage: 16.7,
      savingsCategory: "negotiated_discount",
      vendorName: "ErgoFurn Solutions",
      dateCaptured: "2024-12-10",
      status: "actualized"
    },
    {
      id: "DS-002", 
      requisitionId: "REQ-2024-1456",
      itemDescription: "IT Hardware - Laptops (10 units)",
      originalAmount: 25000,
      discountedAmount: 21500,
      savingsAmount: 3500,
      discountPercentage: 14.0,
      savingsCategory: "volume_discount",
      vendorName: "TechSupply Pro",
      dateCaptured: "2024-12-08",
      status: "actualized"
    },
    {
      id: "DS-003",
      requisitionId: "REQ-2024-1789",
      itemDescription: "Marketing Services - Q1 Campaign",
      originalAmount: 50000,
      discountedAmount: 42000,
      savingsAmount: 8000,
      discountPercentage: 16.0,
      savingsCategory: "contract_savings",
      vendorName: "Creative Marketing Inc",
      dateCaptured: "2024-12-05",
      status: "actualized"
    }
  ];

  const aiOpportunities = [
    {
      id: "AO-001",
      opportunityType: "vendor_consolidation",
      category: "Office Supplies",
      currentVendors: ["OfficeMax", "Staples", "Amazon Business"],
      recommendedVendor: "OfficeMax",
      currentSpend: 45000,
      potentialSavings: 6750,
      savingsPercentage: 15.0,
      aiConfidence: 0.87,
      dataPoints: 156,
      status: "under_review",
      implementationEffort: "medium",
      similarItems: [
        "Paper Products", "Writing Supplies", "Desk Accessories"
      ],
      analysisMethod: "spend_analysis"
    },
    {
      id: "AO-002",
      opportunityType: "volume_discount",
      category: "IT Services",
      currentVendors: ["TechCorp", "ServiceNow"],
      recommendedVendor: "TechCorp", 
      currentSpend: 120000,
      potentialSavings: 18000,
      savingsPercentage: 15.0,
      aiConfidence: 0.92,
      dataPoints: 89,
      status: "identified",
      implementationEffort: "low",
      similarItems: [
        "Cloud Storage", "Technical Support", "Software Licenses"
      ],
      analysisMethod: "category_matching"
    },
    {
      id: "AO-003",
      opportunityType: "contract_renewal",
      category: "Facilities Management",
      currentVendors: ["FacilityPro"],
      recommendedVendor: "FacilityPro",
      currentSpend: 95000,
      potentialSavings: 14250,
      savingsPercentage: 15.0,
      aiConfidence: 0.78,
      dataPoints: 24,
      status: "identified",
      implementationEffort: "high",
      similarItems: [
        "Cleaning Services", "Maintenance", "Security Services"
      ],
      analysisMethod: "text_similarity"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actualized": return "bg-green-100 text-green-800 border-green-200";
      case "under_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "identified": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Professional 2030 Header - Cost Savings */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100/40 via-amber-50/60 to-amber-100/40 border-2 border-amber-200/30 shadow-2xl dark:from-amber-900/20 dark:via-amber-800/25 dark:to-amber-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 bg-clip-text text-transparent mb-3">
                Cost Savings Intelligence
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                Enterprise cost optimization with machine learning consolidation opportunities and predictive savings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">This Quarter</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></div>
                  <p className="font-bold text-amber-700">${currentPeriodSummary.directSavings.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-amber-700 animate-pulse"></div>
                  <p className="font-bold text-amber-800">{currentPeriodSummary.savingsRate}%</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Direct Savings</p>
                <p className="text-3xl font-bold text-green-700">
                  ${currentPeriodSummary.directSavings.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {currentPeriodSummary.directSavingsCount} requisitions
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">AI Opportunities</p>
                <p className="text-3xl font-bold text-blue-700">
                  ${currentPeriodSummary.opportunisticSavings.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {currentPeriodSummary.opportunisticCount} actualized
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Potential Savings</p>
                <p className="text-3xl font-bold text-purple-700">
                  ${currentPeriodSummary.potentialSavings.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {currentPeriodSummary.potentialCount} identified
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impact</p>
                <p className="text-3xl font-bold text-gray-700">
                  ${(currentPeriodSummary.directSavings + currentPeriodSummary.opportunisticSavings).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  of ${currentPeriodSummary.totalSpend.toLocaleString()} spend
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="office_supplies">Office Supplies</SelectItem>
                <SelectItem value="it_services">IT Services</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground ml-auto">
              Period: {periodFilter} | Last updated: Just now
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="direct-savings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="direct-savings">Direct Savings</TabsTrigger>
          <TabsTrigger value="ai-opportunities">AI Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="direct-savings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Direct Savings - Captured from Requisitions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Actual discounts and savings captured directly during the requisition process
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requisition</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>Final Amount</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directSavingsData.map((saving) => (
                    <TableRow key={saving.id}>
                      <TableCell className="font-mono text-sm">{saving.requisitionId}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="font-medium">{saving.itemDescription}</p>
                        <p className="text-sm text-muted-foreground">{saving.dateCaptured}</p>
                      </TableCell>
                      <TableCell>{saving.vendorName}</TableCell>
                      <TableCell className="font-mono">${saving.originalAmount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">${saving.discountedAmount.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${saving.savingsAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {saving.discountPercentage}%
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {saving.savingsCategory.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(saving.status)}>
                          {saving.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-opportunities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI-Powered Consolidation Opportunities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Machine learning analysis identifies consolidation potential based on similar products and spending patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getEffortColor(opportunity.implementationEffort)}>
                              {opportunity.implementationEffort} effort
                            </Badge>
                            <Badge className={getStatusColor(opportunity.status)}>
                              {opportunity.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">|</span>
                            <span className={`text-sm font-medium ${getConfidenceColor(opportunity.aiConfidence)}`}>
                              {(opportunity.aiConfidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg">
                              {opportunity.category} - {opportunity.opportunityType.replace('_', ' ')}
                            </h3>
                            <p className="text-muted-foreground">
                              Current vendors: {opportunity.currentVendors.join(', ')}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Current Spend</p>
                              <p className="font-bold text-lg">${opportunity.currentSpend.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Potential Savings</p>
                              <p className="font-bold text-lg text-green-600">
                                ${opportunity.potentialSavings.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Savings Rate</p>
                              <p className="font-bold text-lg text-green-600">
                                {opportunity.savingsPercentage}%
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Similar Items Identified:</p>
                            <div className="flex flex-wrap gap-2">
                              {opportunity.similarItems.map((item, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Analysis: {opportunity.analysisMethod.replace('_', ' ')} • 
                            Data points: {opportunity.dataPoints} • 
                            Recommended: {opportunity.recommendedVendor}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Savings Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Direct Savings Progress</span>
                    <span className="font-medium">67% of target</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>AI Opportunities Actualized</span>
                    <span className="font-medium">40% of identified</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Consolidation Success Rate</span>
                    <span className="font-medium">85% implementation</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>IT Services</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div className="w-3/4 bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="font-medium">$28.5K</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Office Supplies</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div className="w-1/2 bg-green-600 h-2 rounded-full"></div>
                      </div>
                      <span className="font-medium">$18.2K</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-purple-200 rounded-full h-2">
                        <div className="w-2/3 bg-purple-600 h-2 rounded-full"></div>
                      </div>
                      <span className="font-medium">$22.8K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Search, 
  Save, 
  Download, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Bookmark
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { mockAnalyticsAnomalies, mockSavedFilters } from "@/lib/mock-data";

export default function Analytics() {
  const [searchField, setSearchField] = useState("");
  const [selectedSKU, setSelectedSKU] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [timeWindow, setTimeWindow] = useState("12-months");
  const { toast } = useToast();

  const { data: requisitions = [] } = useQuery({
    queryKey: ["/api/requisitions"],
    queryFn: api.requisitions.getAll,
  });

  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ["/api/purchase-orders"],
    queryFn: api.purchaseOrders.getAll,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: api.invoices.getAll,
  });

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: "Analytics data has been updated based on your filter criteria.",
    });
  };

  const handleSaveFilterSet = () => {
    const filterName = prompt("Enter a name for this filter set:");
    if (filterName) {
      // In a real implementation, this would save to localStorage or backend
      toast({
        title: "Filter Set Saved",
        description: `Filter set "${filterName}" has been saved successfully.`,
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Analytics data export has been initiated. You will receive a download link shortly.",
    });
  };

  const handleLoadFilter = (filterName: string) => {
    toast({
      title: "Filter Loaded",
      description: `Loaded filter set: "${filterName}"`,
    });
  };

  const handleAnomalyAction = (anomaly: any) => {
    toast({
      title: "Action Initiated",
      description: `${anomaly.action} workflow has been started.`,
    });
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "info":
        return <Info className="h-12 w-12 text-blue-500" />;
      default:
        return <Info className="h-12 w-12 text-gray-500" />;
    }
  };

  const getAnomalyButtonVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "secondary";
      case "success":
        return "default";
      case "info":
        return "outline";
      default:
        return "outline";
    }
  };

  // Calculate some basic analytics from the data
  const totalSpend = invoices.reduce((sum, invoice) => 
    sum + parseFloat(invoice.amount), 0
  );

  const averageOrderValue = purchaseOrders.length > 0 
    ? purchaseOrders.reduce((sum, po) => sum + parseFloat(po.amount), 0) / purchaseOrders.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Futuristic 2030 Header - Analytics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500/10 via-orange-500/15 to-red-500/10 border-2 border-red-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent mb-3">
                Analytics Intelligence Center
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                Advanced procurement analytics with AI-powered anomaly detection and predictive insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Active Anomalies</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <p className="font-bold text-red-600">{mockAnalyticsAnomalies.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <p className="font-bold text-orange-600">${totalSpend.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Field</label>
                <Input
                  placeholder="Enter SKU, vendor, or keyword"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">SKU</label>
                <Select value={selectedSKU} onValueChange={setSelectedSKU}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All SKUs</SelectItem>
                    <SelectItem value="SKU-12345">SKU-12345</SelectItem>
                    <SelectItem value="SKU-67890">SKU-67890</SelectItem>
                    <SelectItem value="SKU-55-9876">SKU-55-9876</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="R&D">R&D</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Window</label>
                <Select value={timeWindow} onValueChange={setTimeWindow}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 months</SelectItem>
                    <SelectItem value="6-months">6 months</SelectItem>
                    <SelectItem value="12-months">12 months</SelectItem>
                    <SelectItem value="24-months">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApplyFilters}>
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="secondary" onClick={handleSaveFilterSet}>
                <Save className="h-4 w-4 mr-2" />
                Save Filter Set
              </Button>
              <Button variant="secondary" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <div className="kpi-value">${totalSpend.toLocaleString()}</div>
          <div className="kpi-label">Total Spend (YTD)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">${Math.round(averageOrderValue).toLocaleString()}</div>
          <div className="kpi-label">Average Order Value</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{requisitions.length}</div>
          <div className="kpi-label">Total Requisitions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">
            {Math.round((requisitions.filter(r => r.status === "approved").length / Math.max(requisitions.length, 1)) * 100)}%
          </div>
          <div className="kpi-label">Approval Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Seasonal Pattern Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-placeholder">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Chart showing seasonal spending patterns would appear here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on current data: Q4 shows 40% increase in marketing spend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Department Spend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-placeholder">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Pie chart showing spend by department would appear here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Top departments: IT (35%), Marketing (28%), Operations (22%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Anomaly Detection & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsAnomalies.map((anomaly, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  anomaly.type === "warning"
                    ? "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
                    : anomaly.type === "success"
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start gap-4">
                  {getAnomalyIcon(anomaly.type)}
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{anomaly.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {anomaly.description}
                    </p>
                    <Button
                      variant={getAnomalyButtonVariant(anomaly.type)}
                      size="sm"
                      onClick={() => handleAnomalyAction(anomaly)}
                    >
                      {anomaly.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Filter Sets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Filter Sets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSavedFilters.map((filter, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{filter.name}</h4>
                  <p className="text-sm text-muted-foreground">{filter.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadFilter(filter.name)}
                >
                  Load Filter
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

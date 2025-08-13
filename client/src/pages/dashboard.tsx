import { Plus, Check, BarChart3, AlertTriangle, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { mockKPIData, mockWorkloadData, mockAnalyticsAnomalies } from "@/lib/mock-data";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAnomalyVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive" as const;
      case "success":
        return "default" as const;
      default:
        return "secondary" as const;
    }
  };

  const handleAnomalyAction = (anomaly: any) => {
    switch (anomaly.action) {
      case "Review Contract Renewal":
        if (anomaly.poId) {
          setLocation(`/purchase-orders?highlight=${anomaly.poId}`);
        } else {
          setLocation("/purchase-orders");
        }
        break;
      case "Create Blanket PO":
        setLocation("/request?type=blanket");
        break;
      case "Review Vendor Status":
        if (anomaly.vendorId) {
          setLocation(`/vendors?highlight=${anomaly.vendorId}`);
        } else {
          setLocation("/vendors");
        }
        break;
      default:
        setLocation("/analytics");
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => setLocation("/request")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
        <Button variant="secondary" onClick={() => setLocation("/approvals")} className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          My Approvals
        </Button>
        <Button variant="secondary" onClick={() => setLocation("/analytics")} className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="kpi-card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setLocation("/approvals")}
        >
          <div className="kpi-value">{mockKPIData.myApprovals}</div>
          <div className="kpi-label">My Approvals</div>
        </div>
        <div 
          className="kpi-card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setLocation("/purchase-orders")}
        >
          <div className="kpi-value">{mockKPIData.posInFlight}</div>
          <div className="kpi-label">POs in Flight</div>
        </div>
        <div 
          className="kpi-card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setLocation("/invoices")}
        >
          <div className="kpi-value">{mockKPIData.apInvoiceRouting}</div>
          <div className="kpi-label">AP Invoice Routing</div>
        </div>
        <div 
          className="kpi-card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setLocation("/invoices")}
        >
          <div className="kpi-value">{mockKPIData.threeWayMatchPending}</div>
          <div className="kpi-label">3-Way Match Pending</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Panel */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-accent/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold text-primary">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Priority Actions Dashboard
            </CardTitle>
            <p className="text-sm text-muted-foreground">Critical items requiring immediate attention</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-primary">Urgent Requests</h4>
                <Badge variant="secondary" className="text-xs">{mockWorkloadData.urgentRequests.length}</Badge>
              </div>
              <div className="space-y-2">
                {mockWorkloadData.urgentRequests.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-all bg-gradient-to-r from-background to-accent/20"
                    onClick={() => setLocation("/request")}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-medium text-sm">{item.id}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="font-semibold text-primary">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Requested by: {item.requestedBy}</span>
                      <span>Delivery: {item.deliveryDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-primary">POs Pending Approval</h4>
                <Badge variant="secondary" className="text-xs">{mockWorkloadData.pendingPOs.length}</Badge>
              </div>
              <div className="space-y-2">
                {mockWorkloadData.pendingPOs.map((po, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-all bg-gradient-to-r from-background to-yellow-50 dark:to-yellow-900/20"
                    onClick={() => setLocation(`/po-summary?id=${po.poId}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{po.poNumber}</p>
                      <span className="font-semibold text-primary">${po.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{po.vendor} - {po.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{po.status}</Badge>
                      <span className="text-xs text-muted-foreground">{po.daysInWorkflow} days in workflow</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-destructive">Contracts Expiring</h4>
                <Badge variant="destructive" className="text-xs">{mockWorkloadData.contractsExpiring.length}</Badge>
              </div>
              <div className="space-y-2">
                {mockWorkloadData.contractsExpiring.map((contract, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-all bg-gradient-to-r from-background to-red-50 dark:to-red-900/20 border-red-200 dark:border-red-800"
                    onClick={() => setLocation(`/po-summary?id=${contract.poId}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{contract.poNumber}</p>
                      <Badge variant="destructive" className="text-xs">
                        {contract.daysLeft} days
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{contract.vendor} - {contract.service}</p>
                    <p className="text-xs text-muted-foreground">Agreement: {contract.agreementDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Smart Insights & Recommendations
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/analytics")}
                className="flex items-center gap-1"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsAnomalies.slice(0, 3).map((anomaly, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                    anomaly.type === "warning"
                      ? "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-800 dark:hover:bg-orange-900"
                      : anomaly.type === "success"
                      ? "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:hover:bg-blue-900"
                  }`}
                  onClick={() => handleAnomalyAction(anomaly)}
                >
                  <div className="flex items-start gap-3">
                    {getAnomalyIcon(anomaly.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{anomaly.title}</h4>
                        <Badge variant={getAnomalyVariant(anomaly.type)} className="text-xs">
                          {anomaly.type === "warning" ? "Alert" : anomaly.type === "success" ? "Opportunity" : "Forecast"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {anomaly.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant={getAnomalyVariant(anomaly.type)}
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnomalyAction(anomaly);
                          }}
                        >
                          {anomaly.action} <ArrowRight className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Click to view details
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

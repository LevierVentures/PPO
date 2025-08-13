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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Workload Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Approvals Due Today</h4>
              <div className="space-y-2">
                {mockWorkloadData.approvalsDueToday.map((item) => (
                  <div 
                    key={item.id} 
                    className="text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors flex items-center justify-between"
                    onClick={() => setLocation("/approvals")}
                  >
                    <span>{item.id} - {item.description}</span>
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Contracts Expiring</h4>
              <div className="space-y-2">
                {mockWorkloadData.contractsExpiring.map((contract, index) => (
                  <div 
                    key={index} 
                    className="text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors flex items-center justify-between"
                    onClick={() => setLocation(`/purchase-orders?highlight=${contract.poId}`)}
                  >
                    <span>{contract.poNumber} - {contract.vendor} ({contract.service})</span>
                    <Badge variant="outline" className="text-xs">
                      {contract.daysLeft} days
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Blanket PO Opportunities</h4>
              <div className="space-y-2">
                {mockWorkloadData.blanketPOOpportunities.map((opportunity, index) => (
                  <div 
                    key={index} 
                    className="text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setLocation("/request?type=blanket")}
                  >
                    {opportunity.description}
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

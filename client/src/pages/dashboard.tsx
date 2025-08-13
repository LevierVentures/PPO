import { Plus, Check, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { mockKPIData, mockWorkloadData, mockRecentActivity } from "@/lib/mock-data";

export default function Dashboard() {
  const [, setLocation] = useLocation();

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
        <div className="kpi-card">
          <div className="kpi-value">{mockKPIData.myApprovals}</div>
          <div className="kpi-label">My Approvals</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{mockKPIData.posInFlight}</div>
          <div className="kpi-label">POs in Flight</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{mockKPIData.apInvoiceRouting}</div>
          <div className="kpi-label">AP Invoice Routing</div>
        </div>
        <div className="kpi-card">
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
                  <div key={item.id} className="text-sm">
                    {item.id} - {item.description} (${item.amount.toLocaleString()})
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Contracts Expiring</h4>
              <div className="space-y-2">
                {mockWorkloadData.contractsExpiring.map((contract, index) => (
                  <div key={index} className="text-sm">
                    {contract.vendor} - {contract.service} ({contract.daysLeft} days)
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Forecasted Spikes</h4>
              <div className="space-y-2">
                {mockWorkloadData.forecastedSpikes.map((spike, index) => (
                  <div key={index} className="text-sm">
                    {spike.description}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

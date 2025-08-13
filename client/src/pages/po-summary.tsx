import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  Circle
} from "lucide-react";
import { dummyPurchaseOrders, getWorkflowStatus } from "@/lib/dummy-pos";

export default function POSummary() {
  const [, setLocation] = useLocation();
  
  // Get PO ID from URL params (simplified for demo)
  const poId = new URLSearchParams(window.location.search).get('id') || 'po-001';
  
  const { data: po, isLoading } = useQuery({
    queryKey: ['/api/purchase-orders', poId],
    queryFn: () => {
      // Find PO from dummy data
      const foundPO = dummyPurchaseOrders.find(p => p.id === poId);
      if (!foundPO) throw new Error('PO not found');
      return foundPO;
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading PO details...</div>;
  }

  if (!po) {
    return <div className="p-6">PO not found</div>;
  }

  const workflowStatus = getWorkflowStatus(po.workflowSteps);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'in-progress': return 'secondary';
      default: return 'outline';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/purchase-orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{po.poNumber}</h1>
            <p className="text-muted-foreground">{po.description}</p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(po.status)} className="text-sm">
          {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main PO Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Purchase Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PO Number</label>
                  <p className="text-lg font-mono">{po.poNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {parseFloat(po.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                  <p className="text-lg flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    {po.vendorName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Badge variant={po.isBlanketPO ? "default" : "outline"}>
                    {po.isBlanketPO ? "Blanket PO" : "Standard PO"}
                  </Badge>
                </div>
              </div>

              {po.contractNumber && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Contract Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contract Number</label>
                        <p className="font-mono">{po.contractNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Agreement Date</label>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {po.agreementDate?.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                        <p>{po.contractStartDate?.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">End Date</label>
                        <p>{po.contractEndDate?.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {po.attachments?.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{attachment}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )) || <p className="text-muted-foreground">No attachments</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Matrix */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <div className="flex items-center justify-between text-sm">
                <span>Progress: {workflowStatus.progress}%</span>
                <span>{workflowStatus.completed}/{workflowStatus.total} completed</span>
              </div>
              <Progress value={workflowStatus.progress} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {po.workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <p className="font-medium">{step.step}</p>
                      <p className="text-sm text-muted-foreground">{step.assignee}</p>
                      {step.completedAt && (
                        <p className="text-xs text-muted-foreground">
                          Completed: {step.completedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {workflowStatus.currentStep !== 'Completed' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
                  <p className="text-sm font-medium">Next Step:</p>
                  <p className="text-sm text-muted-foreground">{workflowStatus.currentStep}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, FileText, Building2, User, Eye } from "lucide-react";
import { mockApprovalsData, getApprovalsByPriority } from "@/lib/approvals-data";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";
import { useLocation } from "wouter";

export default function Approvals() {
  const [, setLocation] = useLocation();
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const approvalsByPriority = getApprovalsByPriority();

  const getStatusVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'requisition': return FileText;
      case 'po': return CheckCircle;
      case 'invoice': return Building2;
      default: return FileText;
    }
  };

  const handleApprove = (item: any) => {
    console.log('Approve:', item.id);
    // Here you would make API call to approve the item
  };

  const handleReject = (item: any) => {
    console.log('Reject:', item.id);
    // Here you would make API call to reject the item
  };

  const handlePreview = (item: any) => {
    if (item.type === 'po') {
      // Find the PO details from the dummy data
      const poDetails = dummyPurchaseOrders.find(po => po.id === item.id);
      setSelectedPO(poDetails);
    }
  };

  const POPreview = ({ po }: { po: any }) => (
    <div className="space-y-6">
      {/* PO Header */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Purchase Order Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">PO Number:</span> {po.poNumber}</p>
            <p><span className="font-medium">Vendor:</span> {po.vendorName}</p>
            <p><span className="font-medium">Amount:</span> ${parseFloat(po.amount).toLocaleString()}</p>
            <p><span className="font-medium">Status:</span> {po.status}</p>
            <p><span className="font-medium">Created:</span> {po.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contract Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Contract Number:</span> {po.contractNumber}</p>
            <p><span className="font-medium">Agreement Date:</span> {po.agreementDate?.toLocaleDateString()}</p>
            <p><span className="font-medium">Contract End:</span> {po.contractEndDate?.toLocaleDateString()}</p>
            <p><span className="font-medium">Blanket PO:</span> {po.isBlanketPO ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="text-sm">{po.description}</p>
      </div>

      <Separator />

      {/* Workflow Steps */}
      <div>
        <h4 className="font-semibold mb-3">Approval Workflow</h4>
        <div className="space-y-2">
          {po.workflowSteps.map((step: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  step.status === 'completed' ? 'bg-green-500' : 
                  step.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                }`} />
                <span className="font-medium">{step.step}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>{step.assignee}</span>
                {step.completedAt && (
                  <span className="ml-2">({step.completedAt.toLocaleDateString()})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attachments */}
      {po.attachments && po.attachments.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {po.attachments.map((attachment: string, index: number) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-accent">
                  <FileText className="h-3 w-3 mr-1" />
                  {attachment}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderApprovalRow = (item: any) => {
    const Icon = getTypeIcon(item.type);
    
    return (
      <TableRow key={item.id} className="hover:bg-accent/50">
        <TableCell>
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.requestor}</p>
              <p className="text-xs text-muted-foreground">{item.department}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{item.vendor}</span>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-semibold">${item.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{item.approvalStep}</p>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{item.daysWaiting} days</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(item.priority)}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            {item.type === 'po' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="po-preview-description">
                  <DialogHeader>
                    <DialogTitle>Purchase Order Preview - {selectedPO?.poNumber}</DialogTitle>
                  </DialogHeader>
                  <div id="po-preview-description" className="sr-only">
                    Preview of purchase order details including contract information, workflow steps, and attachments
                  </div>
                  {selectedPO && <POPreview po={selectedPO} />}
                </DialogContent>
              </Dialog>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleApprove(item)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleReject(item)}
            >
              Reject
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval Queue</h1>
        <p className="text-muted-foreground">
          Review and approve pending requisitions, purchase orders, and invoices
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{approvalsByPriority.high.length}</div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{approvalsByPriority.medium.length}</div>
            <div className="text-xs text-muted-foreground">Medium Priority</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{approvalsByPriority.low.length}</div>
            <div className="text-xs text-muted-foreground">Low Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{mockApprovalsData.length}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items ({mockApprovalsData.length})</TabsTrigger>
          <TabsTrigger value="high">High Priority ({approvalsByPriority.high.length})</TabsTrigger>
          <TabsTrigger value="medium">Medium ({approvalsByPriority.medium.length})</TabsTrigger>
          <TabsTrigger value="low">Low ({approvalsByPriority.low.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount & Step</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApprovalsData.map(renderApprovalRow)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">High Priority Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount & Step</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalsByPriority.high.map(renderApprovalRow)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medium" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Medium Priority Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount & Step</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalsByPriority.medium.map(renderApprovalRow)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Low Priority Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount & Step</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalsByPriority.low.map(renderApprovalRow)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
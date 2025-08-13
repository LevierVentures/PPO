import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Receipt, Eye, CheckCheck, AlertTriangle, Info } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";

export default function Invoices() {
  const { toast } = useToast();
  const { state } = useAppState();
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: api.invoices.getAll,
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.invoices.update(id, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Invoice updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update invoice", 
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "paid":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      case "on-hold":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getThreeWayMatchColor = (status: string) => {
    switch (status) {
      case "matched":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "exception":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const handlePerform3WayMatch = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Simulate 3-way matching process
    toast({
      title: "3-Way Match in Progress",
      description: `Performing 3-way match for invoice ${invoice.invoiceNumber}. This would compare invoice to PO, verify receipt/delivery, and check pricing.`,
    });

    // Update invoice with matched status after a delay
    setTimeout(() => {
      updateInvoiceMutation.mutate({
        id: invoiceId,
        data: { 
          threeWayMatchStatus: "matched",
          status: "approved" 
        }
      });
    }, 2000);
  };

  const handleResolveException = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    toast({
      title: "Exception Resolution",
      description: `Opening exception resolution workflow for invoice ${invoice.invoiceNumber}.`,
    });

    // In a real system, this would open a detailed resolution workflow
    setTimeout(() => {
      updateInvoiceMutation.mutate({
        id: invoiceId,
        data: { 
          threeWayMatchStatus: "pending",
          status: "pending" 
        }
      });
    }, 1000);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      toast({
        title: "Invoice Details",
        description: `Viewing details for invoice ${invoice.invoiceNumber}. This would show line items, matching status, and approval history.`,
      });
    }
  };

  // Check if current user is AP Finance role
  const isAPFinanceUser = state.currentUser.role === "AP Finance" || 
                         state.currentUser.department === "Finance";

  if (isLoading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoice Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAPFinanceUser && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                3-way matching features are only available for AP Finance role users.
              </AlertDescription>
            </Alert>
          )}

          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>3-Way Match Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.vendorId}</TableCell>
                    <TableCell>{invoice.poId}</TableCell>
                    <TableCell>
                      ${parseFloat(invoice.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getThreeWayMatchColor(invoice.threeWayMatchStatus)}>
                        {invoice.threeWayMatchStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        
                        {isAPFinanceUser && invoice.threeWayMatchStatus === "pending" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handlePerform3WayMatch(invoice.id)}
                            disabled={updateInvoiceMutation.isPending}
                          >
                            <CheckCheck className="h-4 w-4" />
                            3-Way Match
                          </Button>
                        )}
                        
                        {isAPFinanceUser && invoice.threeWayMatchStatus === "exception" && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleResolveException(invoice.id)}
                            disabled={updateInvoiceMutation.isPending}
                          >
                            <AlertTriangle className="h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

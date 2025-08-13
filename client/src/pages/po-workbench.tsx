import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Receipt } from "lucide-react";
import { api } from "@/lib/api";
import { useLocation } from "wouter";

export default function POWorkbench() {
  const [, setLocation] = useLocation();

  const { data: purchaseOrders = [], isLoading } = useQuery({
    queryKey: ["/api/purchase-orders"],
    queryFn: api.purchaseOrders.getAll,
  });

  const activePOs = purchaseOrders.filter(po => 
    po.status !== "completed" && po.status !== "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "in-progress":
        return "status-in-progress";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const handleViewInvoices = (poNumber: string) => {
    setLocation("/invoices");
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading purchase orders...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Order Workbench
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePOs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active purchase orders found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activePOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{po.vendorId}</TableCell>
                    <TableCell>
                      ${parseFloat(po.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(po.status)}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(po.createdAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoices(po.poNumber)}
                        >
                          <Receipt className="h-4 w-4" />
                          Invoices
                        </Button>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Calendar, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";

export default function PurchaseOrders() {
  const [, setLocation] = useLocation();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "in-progress":
        return "outline";
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Complete history of all purchase orders with contract details
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Orders ({dummyPurchaseOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Details</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount & Type</TableHead>
                <TableHead>Contract Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyPurchaseOrders.map((po) => (
                <TableRow key={po.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">{po.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {po.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{po.vendorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">${parseFloat(po.amount).toLocaleString()}</p>
                      {po.isBlanketPO && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Blanket PO
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {po.contractNumber ? (
                      <div>
                        <p className="text-sm font-mono">{po.contractNumber}</p>
                        {po.agreementDate && (
                          <p className="text-xs text-muted-foreground">
                            Agreement: {po.agreementDate.toLocaleDateString()}
                          </p>
                        )}
                        {po.contractEndDate && (
                          <p className="text-xs text-muted-foreground">
                            Expires: {po.contractEndDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No contract</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(po.status)}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation(`/po-summary?id=${po.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Handshake, Plus, Eye, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Vendors() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["/api/vendors"],
    queryFn: api.vendors.getAll,
  });

  const getIntegrationColor = (type: string) => {
    switch (type) {
      case "cxml":
        return "integration-cxml";
      case "oci":
        return "integration-oci";
      case "hosted":
        return "integration-hosted";
      default:
        return "integration-none";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "inactive":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const handleShopVendor = (vendor: any) => {
    if (vendor.integrationType === "none") {
      toast({
        title: "No Integration",
        description: "This vendor doesn't have catalog integration available.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Simulating PunchOut",
      description: `Opening ${vendor.name} catalog. In a real system, this would integrate with vendor catalogs.`,
    });
  };

  const handleRequestNewVendor = () => {
    setLocation("/new-vendor-request");
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5" />
            Vendor Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button onClick={handleRequestNewVendor}>
              <Plus className="h-4 w-4 mr-2" />
              Request New Vendor
            </Button>
          </div>

          {vendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No vendors found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Integration Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Total Spend (YTD)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge className={getIntegrationColor(vendor.integrationType)}>
                        {vendor.integrationType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.lastOrderDate 
                        ? new Date(vendor.lastOrderDate).toLocaleDateString()
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      ${parseFloat(vendor.totalSpendYtd || "0").toLocaleString()}
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
                          onClick={() => handleShopVendor(vendor)}
                          disabled={vendor.status !== "active"}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Shop
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

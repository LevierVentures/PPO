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
    <div className="space-y-8">
      {/* Futuristic 2030 Header - Vendors */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/10 via-teal-500/15 to-cyan-500/10 border-2 border-cyan-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent mb-3">
                Vendor Partnership Hub
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                AI-powered vendor ecosystem with intelligent catalog integrations and performance analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                  <p className="font-bold text-cyan-600">{vendors.filter(v => v.status === 'active').length}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-xl">
                <Handshake className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

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

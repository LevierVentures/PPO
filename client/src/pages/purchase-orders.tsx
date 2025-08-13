import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Eye, Calendar, Building2, Search, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";

export default function PurchaseOrders() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");

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

  // Filter data based on search and filters
  const uniqueVendors = [...new Set(dummyPurchaseOrders.map(po => po.vendorName))];
  
  const filteredPOs = dummyPurchaseOrders.filter(po => {
    const matchesSearch = searchTerm === "" || 
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (po.contractNumber && po.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    const matchesVendor = vendorFilter === "all" || po.vendorName === vendorFilter;
    
    return matchesSearch && matchesStatus && matchesVendor;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Search and filter purchase orders with advanced capabilities
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PO number, vendor, description, or contract number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-48">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {uniqueVendors.map(vendor => (
                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Orders ({filteredPOs.length} of {dummyPurchaseOrders.length})
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
              {filteredPOs.map((po) => (
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
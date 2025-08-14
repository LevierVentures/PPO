import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Eye, Edit, Calendar, Building2, Search, Filter } from "lucide-react";
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
  const uniqueVendors = Array.from(new Set(dummyPurchaseOrders.map(po => po.vendorName)));
  
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
    <div className="space-y-8">
      {/* Futuristic 2030 Header - Purchase Orders */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500/10 via-blue-500/15 to-indigo-500/10 border-2 border-indigo-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                Purchase Order Hub
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                Advanced order management with predictive delivery tracking and vendor optimization
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="font-bold text-blue-600">{filteredPOs.length}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
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
      
      <Card className="bg-gradient-to-br from-background to-muted/20 border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Purchase Orders</CardTitle>
              <p className="text-sm text-muted-foreground">{filteredPOs.length} active orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5">Live Data</Badge>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/40">
                  <TableHead className="font-semibold">PO Details</TableHead>
                  <TableHead className="font-semibold">Vendor</TableHead>
                  <TableHead className="font-semibold">Amount & Type</TableHead>
                  <TableHead className="font-semibold">Date Approved</TableHead>
                  <TableHead className="font-semibold">Contract Info</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow key={po.id} className="hover:bg-primary/5 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary/30">
                    <TableCell className="py-4">
                      <div>
                        <p className="font-semibold text-primary">{po.poNumber}</p>
                        <p className="text-sm text-muted-foreground">{po.description}</p>
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
                    <div className="text-sm">
                      {po.approvedAt ? (
                        <>
                          <p className="font-medium">{po.approvedAt.toLocaleDateString()}</p>
                          <p className="text-muted-foreground">{po.approvedAt.toLocaleTimeString()}</p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/po-summary?id=${po.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {po.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLocation(`/po-edit?id=${po.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
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
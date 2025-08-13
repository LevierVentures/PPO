import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, Eye, Download } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function InvoiceHistory() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const { toast } = useToast();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: api.invoices.getAll,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["/api/vendors"],
    queryFn: api.vendors.getAll,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "status-approved";
      case "approved":
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

  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) return false;
    if (vendorFilter !== "all" && invoice.vendorId !== vendorFilter) return false;
    
    // In a real implementation, date filtering would be applied here
    // based on the selected date range and invoice dates
    
    return true;
  });

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      toast({
        title: "Invoice Details",
        description: `Viewing historical details for invoice ${invoice.invoiceNumber}.`,
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Invoice history data export has been initiated. You will receive a download link shortly.",
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading invoice history...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Vendor</label>
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleExportData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* History Table */}
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found for the selected criteria
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
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
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.receivedAt 
                        ? new Date(invoice.receivedAt).toLocaleDateString()
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      {invoice.paidAt 
                        ? new Date(invoice.paidAt).toLocaleDateString()
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="kpi-card">
              <div className="kpi-value">
                {filteredInvoices.filter(inv => inv.status === "paid").length}
              </div>
              <div className="kpi-label">Paid Invoices</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">
                ${filteredInvoices
                  .filter(inv => inv.status === "paid")
                  .reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
                  .toLocaleString()}
              </div>
              <div className="kpi-label">Total Paid Amount</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">
                {filteredInvoices.filter(inv => inv.status === "rejected").length}
              </div>
              <div className="kpi-label">Rejected Invoices</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">
                {Math.round(
                  (filteredInvoices.filter(inv => inv.status === "paid").length / 
                   Math.max(filteredInvoices.length, 1)) * 100
                )}%
              </div>
              <div className="kpi-label">Processing Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

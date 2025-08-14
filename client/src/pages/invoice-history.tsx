import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Receipt, Eye, Search, Filter, Building2, FileText, Calendar, DollarSign } from "lucide-react";
import { mockInvoicesData, getInvoicesByStatus } from "@/lib/invoice-data";

export default function InvoiceHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const invoicesByStatus = getInvoicesByStatus();
  const uniqueVendors = [...new Set(mockInvoicesData.map(inv => inv.vendorName))];

  // Filter data based on search and filters
  const filteredInvoices = mockInvoicesData.filter(invoice => {
    const matchesSearch = searchTerm === "" || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesVendor = vendorFilter === "all" || invoice.vendorName === vendorFilter;
    
    return matchesSearch && matchesStatus && matchesVendor;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "approved": return "secondary";
      case "pending": return "outline";
      case "disputed": return "destructive";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600";
      case "approved": return "text-blue-600";
      case "pending": return "text-yellow-600";
      case "disputed": return "text-red-600";
      case "rejected": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const InvoicePreview = ({ invoice }: { invoice: any }) => (
    <div className="space-y-6">
      {/* Invoice Header */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Invoice Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-medium">PO #:</span> {invoice.poNumber}</p>
            <p><span className="font-medium">Invoice Date:</span> {formatDate(invoice.invoiceDate)}</p>
            <p><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            <p><span className="font-medium">Received:</span> {formatDate(invoice.receivedDate)}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Vendor Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Vendor:</span> {invoice.vendorName}</p>
            <p><span className="font-medium">Payment Terms:</span> {invoice.paymentTerms}</p>
            <p><span className="font-medium">Match Status:</span> 
              <span className="ml-2">{invoice.matchStatus}</span>
            </p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Line Items */}
      <div>
        <h4 className="font-semibold mb-3">Line Items</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>GL Code</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.glCode}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${item.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-lg font-semibold">
            Total Amount: <span className="text-green-600">${invoice.amount.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Attachments */}
      {invoice.attachments && invoice.attachments.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {invoice.attachments.map((attachment: string, index: number) => (
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

  return (
    <div className="space-y-8">
      {/* Professional 2030 Header - Invoices */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/20 via-emerald-800/25 to-emerald-900/20 border-2 border-emerald-800/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 bg-clip-text text-transparent mb-3 dark:from-emerald-300 dark:via-emerald-200 dark:to-emerald-300">
                Invoice Management Center
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                Enterprise invoice processing with automated matching and predictive analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-amber-700 animate-pulse"></div>
                  <p className="font-bold text-amber-800">{invoicesByStatus.pending.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-700 animate-pulse"></div>
                  <p className="font-bold text-emerald-800">$1.2M</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center shadow-xl">
                <Receipt className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{invoicesByStatus.paid.length}</div>
            <div className="text-xs text-muted-foreground">Paid</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{invoicesByStatus.approved.length}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{invoicesByStatus.pending.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <Receipt className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{invoicesByStatus.disputed.length}</div>
            <div className="text-xs text-muted-foreground">Disputed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{mockInvoicesData.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoice number, PO number, vendor, or description..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
            <Receipt className="h-5 w-5" />
            Invoices ({filteredInvoices.length} of {mockInvoicesData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Details</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {invoice.vendorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.poNumber}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">${invoice.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(invoice.invoiceDate)}</p>
                      <p className="text-muted-foreground">Due: {formatDate(invoice.dueDate)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Invoice Preview - {invoice.invoiceNumber}</DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
                      </DialogContent>
                    </Dialog>
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
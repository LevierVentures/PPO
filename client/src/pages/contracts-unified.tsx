import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Calendar, 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  Eye,
  Edit,
  Download,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ContractsUnified() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortField, setSortField] = useState("endDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Complete contract data
  const allContracts = [
    {
      id: "CTR-2024-001",
      vendor: "ACME Corporation",
      title: "Office Supplies - Master Agreement",
      value: 125000,
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      status: "Active",
      category: "Supplies",
      riskLevel: "Low",
      daysToExpiry: 45,
      autoRenewal: true,
      lastReviewed: "2024-11-15",
      contactPerson: "Jane Smith",
      description: "Comprehensive office supplies agreement"
    },
    {
      id: "CTR-2024-002", 
      vendor: "TechSup Inc",
      title: "IT Equipment Maintenance",
      value: 75000,
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      status: "Active",
      category: "IT Services",
      riskLevel: "Medium",
      daysToExpiry: 92,
      autoRenewal: false,
      lastReviewed: "2024-12-01",
      contactPerson: "Mike Johnson",
      description: "Annual maintenance contract for IT equipment"
    },
    {
      id: "CTR-2023-015",
      vendor: "GlobalSoft Solutions",
      title: "Software License Agreement", 
      value: 200000,
      startDate: "2023-06-01",
      endDate: "2024-12-31",
      status: "Expiring Soon",
      category: "Software",
      riskLevel: "High",
      daysToExpiry: 15,
      autoRenewal: false,
      lastReviewed: "2024-10-15",
      contactPerson: "Sarah Davis",
      description: "Enterprise software licensing",
      poNumbers: ["PO-2024-1234", "PO-2024-1456"]
    },
    {
      id: "CTR-2024-008",
      vendor: "Professional Services LLC",
      title: "Consulting Services",
      value: 150000,
      startDate: "2024-08-01", 
      endDate: "2025-07-31",
      status: "Active",
      category: "Professional Services",
      riskLevel: "Low",
      daysToExpiry: 180,
      autoRenewal: true,
      lastReviewed: "2024-11-20",
      contactPerson: "Robert Wilson",
      description: "Strategic consulting services",
      poNumbers: ["PO-2024-2789"]
    },
    {
      id: "CTR-2024-012",
      vendor: "SecureNet Systems",
      title: "Cybersecurity Services",
      value: 95000,
      startDate: "2024-05-01",
      endDate: "2025-04-30",
      status: "Active",
      category: "Security",
      riskLevel: "High",
      daysToExpiry: 120,
      autoRenewal: false,
      lastReviewed: "2024-11-01",
      contactPerson: "Lisa Chen",
      description: "Comprehensive cybersecurity monitoring",
      poNumbers: ["PO-2024-3344", "PO-2024-3567"]
    },
    {
      id: "CTR-2023-005",
      vendor: "FacilityPro",
      title: "Facility Management",
      value: 300000,
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      status: "Active",
      category: "Facilities",
      riskLevel: "Medium",
      daysToExpiry: 365,
      autoRenewal: true,
      lastReviewed: "2024-06-15",
      contactPerson: "Tom Anderson",
      description: "Complete facility management services",
      poNumbers: ["PO-2023-9876", "PO-2024-0123"]
    }
  ];

  const filteredContracts = allContracts.filter(contract => {
    const matchesSearch = contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && contract.status === "Active") ||
                         (statusFilter === "expiring" && contract.daysToExpiry <= 30) ||
                         (statusFilter === "upcoming" && contract.daysToExpiry > 30 && contract.daysToExpiry <= 90);
    
    const matchesCategory = categoryFilter === "all" || contract.category === categoryFilter;
    const matchesRisk = riskFilter === "all" || contract.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesRisk;
  }).sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusColor = (status: string, daysToExpiry: number) => {
    if (daysToExpiry <= 15) return "bg-red-100 text-red-800 border-red-200";
    if (daysToExpiry <= 30) return "bg-orange-100 text-orange-800 border-orange-200";
    if (daysToExpiry <= 90) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyIcon = (daysToExpiry: number) => {
    if (daysToExpiry <= 15) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (daysToExpiry <= 30) return <Clock className="h-4 w-4 text-orange-500" />;
    if (daysToExpiry <= 90) return <Calendar className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </Button>
  );

  // Summary stats
  const stats = {
    total: allContracts.length,
    active: allContracts.filter(c => c.status === "Active" && c.daysToExpiry > 30).length,
    expiring: allContracts.filter(c => c.daysToExpiry <= 30).length,
    upcoming: allContracts.filter(c => c.daysToExpiry > 30 && c.daysToExpiry <= 90).length,
    totalValue: allContracts.reduce((sum, c) => sum + c.value, 0)
  };

  return (
    <div className="space-y-8">
      {/* Professional 2030 Header - Contracts */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-100/40 via-violet-50/60 to-violet-100/40 border-2 border-violet-200/30 shadow-2xl dark:from-violet-900/20 dark:via-violet-800/25 dark:to-violet-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-700 via-violet-600 to-violet-700 bg-clip-text text-transparent mb-3">
                Contract Management Hub
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                Enterprise contract intelligence with predictive risk assessment and renewal automation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></div>
                  <p className="font-bold text-amber-700">{stats.expiring}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Contracts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active & Healthy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.upcoming}</div>
            <div className="text-sm text-muted-foreground">Upcoming Renewals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expiring}</div>
            <div className="text-sm text-muted-foreground">Attention Required</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">${(stats.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts, vendors, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="upcoming">Upcoming Renewals</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="IT Services">IT Services</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Professional Services">Professional</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {filteredContracts.length} of {allContracts.length} contracts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <SortButton field="title">Contract</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="vendor">Vendor</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="category">Category</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="value">Value</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="endDate">End Date</SortButton>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Purchase Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id} className="hover:bg-muted/50">
                  <TableCell>
                    {getUrgencyIcon(contract.daysToExpiry)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{contract.title}</p>
                      <p className="text-sm text-muted-foreground font-mono">{contract.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{contract.vendor}</p>
                      <p className="text-sm text-muted-foreground">{contract.contactPerson}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{contract.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${contract.value.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{contract.endDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.daysToExpiry} days remaining
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status, contract.daysToExpiry)}>
                      {contract.daysToExpiry <= 30 ? `${contract.daysToExpiry} days` : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRiskColor(contract.riskLevel)}>
                      {contract.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {(contract.poNumbers || []).map((poNumber, index) => (
                        <Button 
                          key={index}
                          variant="ghost" 
                          size="sm"
                          className="h-6 px-2 text-xs font-mono justify-start"
                          onClick={() => {
                            // Navigate to PO details
                            window.open(`/purchase-orders?search=${poNumber}`, '_blank');
                          }}
                        >
                          {poNumber}
                        </Button>
                      ))}
                      {contract.daysToExpiry <= 30 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                          onClick={() => {
                            // Create change order for expired/expiring contract
                            window.open(`/request?type=change-order&contractId=${contract.id}`, '_blank');
                          }}
                        >
                          Change Order
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="View Contract Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
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
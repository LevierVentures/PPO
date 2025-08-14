import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Grid3X3,
  List,
  Filter,
  Eye,
  Edit,
  Download
} from "lucide-react";

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("active");

  // Enhanced contract data with better categorization
  const contracts = [
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
      description: "Comprehensive office supplies agreement covering standard items"
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
      description: "Annual maintenance contract for all IT hardware and equipment"
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
      description: "Enterprise software licensing for procurement and finance systems"
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
      description: "Strategic consulting and process improvement services"
    }
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "expiring":
        return matchesSearch && contract.daysToExpiry <= 30;
      case "upcoming":
        return matchesSearch && contract.daysToExpiry > 30 && contract.daysToExpiry <= 90;
      case "active":
        return matchesSearch && contract.status === "Active" && contract.daysToExpiry > 90;
      default:
        return matchesSearch;
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

  const ContractCard = ({ contract }: { contract: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1">{contract.title}</CardTitle>
            <p className="text-sm text-muted-foreground font-mono">{contract.id}</p>
          </div>
          <Badge className={getStatusColor(contract.status, contract.daysToExpiry)}>
            {contract.daysToExpiry <= 30 ? `${contract.daysToExpiry} days` : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{contract.vendor}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${contract.value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{contract.endDate}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline" className={getRiskColor(contract.riskLevel)}>
            {contract.riskLevel} Risk
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {contract.daysToExpiry <= 30 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Action Required</span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              {contract.autoRenewal ? "Review renewal terms" : "Initiate renewal process"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ContractRow = ({ contract }: { contract: any }) => (
    <div className="flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors">
      <div className="flex-1 grid grid-cols-5 gap-4 items-center">
        <div>
          <p className="font-medium">{contract.title}</p>
          <p className="text-sm text-muted-foreground">{contract.vendor}</p>
        </div>
        <div>
          <p className="text-sm font-mono">{contract.id}</p>
          <p className="text-xs text-muted-foreground">{contract.category}</p>
        </div>
        <div>
          <p className="font-medium">${contract.value.toLocaleString()}</p>
          <Badge variant="outline" className={getRiskColor(contract.riskLevel)}>
            {contract.riskLevel}
          </Badge>
        </div>
        <div>
          <p className="text-sm">{contract.endDate}</p>
          <p className="text-xs text-muted-foreground">
            {contract.daysToExpiry} days remaining
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(contract.status, contract.daysToExpiry)}>
            {contract.daysToExpiry <= 30 ? `${contract.daysToExpiry} days` : 'Active'}
          </Badge>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-muted-foreground">
            Monitor contract lifecycle and renewal requirements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-80"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="it">IT Services</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-950/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {contracts.filter(c => c.daysToExpiry <= 30).length}
                </p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-950/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {contracts.filter(c => c.daysToExpiry > 30 && c.daysToExpiry <= 90).length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming Renewals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {contracts.filter(c => c.status === "Active" && c.daysToExpiry > 90).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  ${(contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Expiring Soon ({contracts.filter(c => c.daysToExpiry <= 30).length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Renewals ({contracts.filter(c => c.daysToExpiry > 30 && c.daysToExpiry <= 90).length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Active Contracts ({contracts.filter(c => c.status === "Active" && c.daysToExpiry > 90).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                {filteredContracts.map((contract) => (
                  <ContractRow key={contract.id} contract={contract} />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                {filteredContracts.map((contract) => (
                  <ContractRow key={contract.id} contract={contract} />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                {filteredContracts.map((contract) => (
                  <ContractRow key={contract.id} contract={contract} />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
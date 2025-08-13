import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Building2, AlertTriangle, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";

export default function Contracts() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");

  // Filter POs with contract information
  const contractPOs = dummyPurchaseOrders.filter(po => po.contractNumber);
  
  // Get unique vendors for filter
  const uniqueVendors = [...new Set(contractPOs.map(po => po.vendorName))];

  // Filter contracts based on search and filters
  const filteredContracts = contractPOs.filter(contract => {
    const matchesSearch = searchTerm === "" || 
      contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = vendorFilter === "all" || contract.vendorName === vendorFilter;
    
    return matchesSearch && matchesVendor;
  });

  const getDaysUntilExpiry = (endDate: Date | null) => {
    if (!endDate) return null;
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRiskTier = (days: number | null) => {
    if (!days) return 'unknown';
    if (days < 0) return 'expired';
    if (days <= 30) return 'critical';
    if (days <= 90) return 'warning';
    return 'active';
  };

  const getRiskConfig = (tier: string) => {
    switch (tier) {
      case 'expired':
        return {
          label: 'Expired',
          variant: 'destructive' as const,
          bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
          icon: XCircle,
          iconColor: 'text-red-600',
          priority: 0
        };
      case 'critical':
        return {
          label: 'Critical Risk',
          variant: 'destructive' as const,
          bgClass: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          priority: 1
        };
      case 'warning':
        return {
          label: 'Upcoming Expiry',
          variant: 'secondary' as const,
          bgClass: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
          icon: Clock,
          iconColor: 'text-yellow-600',
          priority: 2
        };
      case 'active':
        return {
          label: 'Active',
          variant: 'default' as const,
          bgClass: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          priority: 3
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          bgClass: 'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800',
          icon: FileText,
          iconColor: 'text-gray-600',
          priority: 4
        };
    }
  };

  // Sort contracts by risk tier (highest risk first)
  const sortedContracts = contractPOs
    .map(po => ({
      ...po,
      daysUntilExpiry: getDaysUntilExpiry(po.contractEndDate),
      riskTier: getRiskTier(getDaysUntilExpiry(po.contractEndDate))
    }))
    .sort((a, b) => {
      const configA = getRiskConfig(a.riskTier);
      const configB = getRiskConfig(b.riskTier);
      return configA.priority - configB.priority;
    });

  const contractsByTier = {
    expired: sortedContracts.filter(c => c.riskTier === 'expired'),
    critical: sortedContracts.filter(c => c.riskTier === 'critical'),
    warning: sortedContracts.filter(c => c.riskTier === 'warning'),
    active: sortedContracts.filter(c => c.riskTier === 'active'),
  };

  const renderContractCard = (contract: any) => {
    const config = getRiskConfig(contract.riskTier);
    const Icon = config.icon;

    return (
      <Card key={contract.id} className={`hover:shadow-lg transition-all ${config.bgClass}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
              <div>
                <h3 className="font-semibold text-lg">{contract.poNumber}</h3>
                <p className="text-sm text-muted-foreground">{contract.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {contract.isBlanketPO && (
                <Badge variant="outline" className="text-xs">Blanket PO</Badge>
              )}
              <Badge variant={config.variant} className="text-xs">
                {contract.daysUntilExpiry !== null && contract.daysUntilExpiry >= 0
                  ? `${contract.daysUntilExpiry} days`
                  : contract.daysUntilExpiry !== null && contract.daysUntilExpiry < 0
                  ? `${Math.abs(contract.daysUntilExpiry)} days overdue`
                  : config.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Vendor</p>
                <p className="font-medium">{contract.vendorName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Contract Period</p>
                <p className="font-medium text-sm">
                  {contract.contractStartDate?.toLocaleDateString()} - {contract.contractEndDate?.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Contract Value</p>
                <p className="font-semibold">${parseFloat(contract.amount).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-muted-foreground">Contract Number</p>
                <p className="font-mono text-sm">{contract.contractNumber}</p>
              </div>
              {contract.agreementDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Agreement Date</p>
                  <p className="text-sm">{contract.agreementDate.toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {(contract.riskTier === 'expired' || contract.riskTier === 'critical') && (
                <Button variant="destructive" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Renew Now
                </Button>
              )}
              {contract.riskTier === 'warning' && (
                <Button variant="secondary" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Plan Renewal
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation(`/po-summary?id=${contract.id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <p className="text-muted-foreground">
          Risk-based contract monitoring with expiration alerts and renewal planning
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
                  placeholder="Search contract number, PO number, vendor, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
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

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{contractsByTier.expired.length}</div>
            <div className="text-xs text-muted-foreground">Expired Contracts</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{contractsByTier.critical.length}</div>
            <div className="text-xs text-muted-foreground">Critical Risk (≤30 days)</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{contractsByTier.warning.length}</div>
            <div className="text-xs text-muted-foreground">Upcoming (≤90 days)</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{contractsByTier.active.length}</div>
            <div className="text-xs text-muted-foreground">Active Contracts</div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Sections by Risk Tier */}
      {filteredContracts.length > 0 ? (
        <>
          {filteredContracts.filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'expired').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Expired Contracts - Immediate Action Required
              </h2>
              <div className="grid gap-4">
                {filteredContracts
                  .filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'expired')
                  .map(contract => {
                    const daysUntilExpiry = getDaysUntilExpiry(contract.contractEndDate);
                    const riskTier = getRiskTier(daysUntilExpiry);
                    return renderContractCard({ ...contract, daysUntilExpiry, riskTier });
                  })}
              </div>
            </div>
          )}

          {filteredContracts.filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'critical').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-orange-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Critical Risk - Expiring Within 30 Days
              </h2>
              <div className="grid gap-4">
                {filteredContracts
                  .filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'critical')
                  .map(contract => {
                    const daysUntilExpiry = getDaysUntilExpiry(contract.contractEndDate);
                    const riskTier = getRiskTier(daysUntilExpiry);
                    return renderContractCard({ ...contract, daysUntilExpiry, riskTier });
                  })}
              </div>
            </div>
          )}

          {filteredContracts.filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'warning').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-yellow-600 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Renewals - Within 90 Days
              </h2>
              <div className="grid gap-4">
                {filteredContracts
                  .filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'warning')
                  .map(contract => {
                    const daysUntilExpiry = getDaysUntilExpiry(contract.contractEndDate);
                    const riskTier = getRiskTier(daysUntilExpiry);
                    return renderContractCard({ ...contract, daysUntilExpiry, riskTier });
                  })}
              </div>
            </div>
          )}

          {filteredContracts.filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'active').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Active Contracts
              </h2>
              <div className="grid gap-4">
                {filteredContracts
                  .filter(c => getRiskTier(getDaysUntilExpiry(c.contractEndDate)) === 'active')
                  .map(contract => {
                    const daysUntilExpiry = getDaysUntilExpiry(contract.contractEndDate);
                    const riskTier = getRiskTier(daysUntilExpiry);
                    return renderContractCard({ ...contract, daysUntilExpiry, riskTier });
                  })}
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}

      {contractPOs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground">
              Contract information will appear here when Purchase Orders include agreement dates and contract numbers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Building2, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";

export default function AgreementSummary() {
  const [, setLocation] = useLocation();

  // Filter POs with contract information
  const contractPOs = dummyPurchaseOrders.filter(po => po.contractNumber);

  const getDaysUntilExpiry = (endDate: Date | null) => {
    if (!endDate) return null;
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadgeVariant = (days: number | null) => {
    if (!days) return "outline";
    if (days <= 30) return "destructive";
    if (days <= 90) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agreement Summary</h1>
        <p className="text-muted-foreground">
          Overview of contract agreements and expiration dates from Purchase Orders
        </p>
      </div>
      
      <div className="grid gap-4">
        {contractPOs.map((po) => {
          const daysUntilExpiry = getDaysUntilExpiry(po.contractEndDate);
          
          return (
            <Card key={po.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{po.poNumber}</h3>
                      <p className="text-sm text-muted-foreground">{po.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {po.isBlanketPO && (
                      <Badge variant="default" className="text-xs">Blanket PO</Badge>
                    )}
                    {daysUntilExpiry !== null && (
                      <Badge variant={getExpiryBadgeVariant(daysUntilExpiry)} className="text-xs">
                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vendor</p>
                      <p className="font-medium">{po.vendorName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Agreement Date</p>
                      <p className="font-medium">
                        {po.agreementDate ? po.agreementDate.toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Period</p>
                      <p className="font-medium">
                        {po.contractStartDate?.toLocaleDateString()} - {po.contractEndDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Number</p>
                      <p className="font-mono text-sm">{po.contractNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-semibold">${parseFloat(po.amount).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {daysUntilExpiry !== null && daysUntilExpiry <= 90 && (
                      <Button variant="outline" size="sm" className="text-orange-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Review Renewal
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation(`/po-summary?id=${po.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {contractPOs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Contract Agreements Found</h3>
            <p className="text-muted-foreground">
              Contract information will appear here when Purchase Orders include agreement dates and contract numbers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
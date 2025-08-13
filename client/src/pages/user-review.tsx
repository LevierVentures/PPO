import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  X, 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  Building2,
  Package,
  Clock
} from "lucide-react";
import { dummyPurchaseOrders } from "@/lib/dummy-pos";
import { useState } from "react";

interface ReviewItem {
  id: string;
  type: 'po' | 'invoice';
  title: string;
  amount: number;
  vendor: string;
  dueDate: Date;
  description: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  status: 'pending_review' | 'approved' | 'rejected';
}

const mockReviewItems: ReviewItem[] = [
  {
    id: "po-001",
    type: "po",
    title: "PO-24568",
    amount: 25000,
    vendor: "ACME Corporation",
    dueDate: new Date("2024-12-20"),
    description: "Annual Maintenance Services - Blanket PO",
    status: "pending_review",
    items: [
      { description: "Annual HVAC Maintenance", quantity: 1, unitPrice: 15000, total: 15000 },
      { description: "Electrical System Check", quantity: 1, unitPrice: 10000, total: 10000 }
    ]
  },
  {
    id: "inv-001",
    type: "invoice",
    title: "INV-89041",
    amount: 5750,
    vendor: "Office Solutions Ltd",
    dueDate: new Date("2024-12-18"),
    description: "Monthly office supplies delivery",
    status: "pending_review",
    items: [
      { description: "Copy Paper (Case)", quantity: 50, unitPrice: 25, total: 1250 },
      { description: "Ink Cartridges", quantity: 30, unitPrice: 75, total: 2250 },
      { description: "Office Chairs", quantity: 10, unitPrice: 225, total: 2250 }
    ]
  }
];

export default function UserReview() {
  const [, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [comments, setComments] = useState("");
  
  const handleAction = (action: 'approve' | 'reject', item: ReviewItem) => {
    console.log(`${action} ${item.type}: ${item.id}`, { comments });
    // Here you would make API call to update the item status
    setSelectedItem(null);
    setComments("");
  };

  if (selectedItem) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedItem(null)}
            className="mb-4"
          >
            ← Back to Review Queue
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                {selectedItem.type === 'po' ? <Package className="mr-2" /> : <FileText className="mr-2" />}
                {selectedItem.title}
              </h1>
              <p className="text-muted-foreground">{selectedItem.description}</p>
            </div>
            <Badge variant="secondary">
              {selectedItem.type === 'po' ? 'Purchase Order' : 'Invoice'} Review
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedItem.type === 'po' ? 'Purchase Order Details' : 'Invoice Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {selectedItem.type === 'po' ? 'PO Number' : 'Invoice Number'}
                    </label>
                    <p className="text-lg font-mono">{selectedItem.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                    <p className="text-lg font-semibold flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {selectedItem.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                    <p className="text-lg flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedItem.vendor}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedItem.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedItem.items && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium mb-3">Line Items</h4>
                      <div className="space-y-2">
                        {selectedItem.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-accent/50 rounded">
                            <div className="col-span-2">
                              <p className="font-medium">{item.description}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              <p className="text-sm">${item.unitPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.total.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Review Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Comments (Optional)</label>
                  <Textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add any comments about this review..."
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleAction('approve', selectedItem)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve {selectedItem.type === 'po' ? 'PO' : 'Invoice'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleAction('reject', selectedItem)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject {selectedItem.type === 'po' ? 'PO' : 'Invoice'}
                  </Button>
                </div>

                <div className="mt-6 p-3 bg-muted rounded text-sm">
                  <p className="font-medium mb-1">Review Guidelines:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Verify amounts match your expectations</li>
                    <li>• Check vendor information is correct</li>
                    <li>• Confirm line items are accurate</li>
                    <li>• Add comments for any concerns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Review Queue</h1>
        <p className="text-muted-foreground">
          Items requiring your review and approval
        </p>
      </div>

      <div className="grid gap-4">
        {mockReviewItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.type === 'po' ? 
                    <Package className="h-8 w-8 text-blue-600" /> : 
                    <FileText className="h-8 w-8 text-green-600" />
                  }
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.vendor} • Due: {item.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${item.amount.toLocaleString()}</p>
                  <Badge variant="outline" className="mt-1">
                    Pending Review
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedItem(item)}
                >
                  Review Details
                </Button>
                <Button onClick={() => setSelectedItem(item)}>
                  Quick Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockReviewItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No items currently require your review.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
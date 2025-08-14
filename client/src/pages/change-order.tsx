import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Search, Plus, AlertTriangle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ChangeOrder() {
  const { toast } = useToast();
  const [selectedPO, setSelectedPO] = useState<string>("");
  const [changeType, setChangeType] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Fetch available POs
  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['/api/purchase-orders'],
  });

  const createChangeOrderMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/change-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Change Order Submitted",
        description: "Your change order has been submitted to Procurement for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/change-orders'] });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const changeOrderData = {
      poNumber: selectedPO,
      changeType,
      description: formData.get('description'),
      justification: formData.get('justification'),
      urgency: formData.get('urgency'),
      expectedImpact: formData.get('expectedImpact'),
      requestedBy: "John Smith", // Current user
      submittedDate: new Date().toISOString(),
      status: "Pending Review",
      attachments: uploadedFiles.map(f => f.name),
    };

    createChangeOrderMutation.mutate(changeOrderData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Change Order Request</h1>
        <p className="text-muted-foreground">
          Submit changes to existing Purchase Orders for Procurement review
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PO Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Purchase Order Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="poNumber">Purchase Order Number *</Label>
              <Select value={selectedPO} onValueChange={setSelectedPO} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((po: any) => (
                    <SelectItem key={po.poNumber} value={po.poNumber}>
                      {po.poNumber} - {po.vendor} (${po.totalAmount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPO && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Selected PO Details</h4>
                {(() => {
                  const po = purchaseOrders.find((p: any) => p.poNumber === selectedPO);
                  return po ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Vendor:</span> {po.vendor}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${po.totalAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant="secondary" className="ml-2">{po.status}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {po.dateCreated}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Change Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="changeType">Type of Change *</Label>
              <Select value={changeType} onValueChange={setChangeType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select change type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quantity">Quantity Adjustment</SelectItem>
                  <SelectItem value="pricing">Price Modification</SelectItem>
                  <SelectItem value="delivery">Delivery Date Change</SelectItem>
                  <SelectItem value="specifications">Technical Specifications</SelectItem>
                  <SelectItem value="vendor">Vendor Change</SelectItem>
                  <SelectItem value="cancellation">Partial/Full Cancellation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Detailed Description of Change *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe exactly what needs to be changed..."
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="justification">Business Justification *</Label>
              <Textarea
                id="justification"
                name="justification"
                placeholder="Explain why this change is necessary..."
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select name="urgency" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Standard Processing</SelectItem>
                    <SelectItem value="medium">Medium - Within 3 Days</SelectItem>
                    <SelectItem value="high">High - Within 24 Hours</SelectItem>
                    <SelectItem value="critical">Critical - Immediate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expectedImpact">Expected Financial Impact</Label>
                <Input
                  id="expectedImpact"
                  name="expectedImpact"
                  placeholder="e.g., +$5,000 or -$2,500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supporting Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Supporting Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fileUpload">Upload Supporting Files</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Files (PDF, DOC, XLS, Images)
                </Button>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Recommended Documentation:</strong> Vendor quotes, technical specifications, 
                approval emails, budget impact analysis, or any other relevant supporting materials.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={!selectedPO || !changeType || createChangeOrderMutation.isPending}
          >
            {createChangeOrderMutation.isPending ? "Submitting..." : "Submit Change Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
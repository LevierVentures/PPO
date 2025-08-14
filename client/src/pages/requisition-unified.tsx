import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Send, ShoppingCart, FileText, Upload } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const requestFormSchema = z.object({
  requestType: z.enum(["new-purchase", "change-order", "blanket-po"]),
  itemType: z.enum(["goods", "services", "mixed"]).optional(),
  department: z.string().min(1, "Department is required"),
  businessJustification: z.string().min(1, "Business justification is required"),
  dateNeededBy: z.string().min(1, "Date needed by is required"),
  vendorId: z.string().optional(),
  shippingAddress: z.string().optional(),
  contractNumber: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  poNumber: z.string().optional(), // For change orders
  changeDescription: z.string().optional(), // For change orders
  urgencyLevel: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

export default function RequisitionUnified() {
  const [, setLocation] = useLocation();
  const { state } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("new-purchase");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      itemType: "good",
      productNumber: "",
      description: "",
      quantity: 1,
      unitOfMeasure: "Each",
      unitPrice: 0,
      generalLedgerCode: "",
      contractNumber: "",
    }
  ]);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: "new-purchase",
      itemType: "goods",
      department: state.currentUser.department,
      dateNeededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingAddress: "Default: 123 Corporate Blvd, Business City, ST 12345",
    },
  });

  // Fetch available POs for change orders
  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['/api/purchase-orders'],
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['/api/vendors'],
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => {
      const endpoint = data.requestType === 'change-order' ? '/api/change-orders' : '/api/requisitions';
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: variables.requestType === 'change-order' 
          ? "Change order submitted to Procurement" 
          : "Requisition submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/change-orders'] });
      setLocation("/");
    },
  });

  const handleSubmit = (data: RequestFormData) => {
    const submissionData = {
      ...data,
      requestorId: state.currentUser.id,
      submittedDate: new Date().toISOString(),
      status: "Pending Review",
      attachments: uploadedFiles.map(f => f.name),
    };

    submitMutation.mutate(submissionData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: lineItems.length + 1,
        itemType: "good",
        productNumber: "",
        description: "",
        quantity: 1,
        unitOfMeasure: "Each",
        unitPrice: 0,
        generalLedgerCode: "",
        contractNumber: "",
      }
    ]);
  };

  const updateLineItem = (id: number, field: string, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const RequestTypeSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle>Request Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-purchase" onClick={() => form.setValue("requestType", "new-purchase")}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Purchase
            </TabsTrigger>
            <TabsTrigger value="change-order" onClick={() => form.setValue("requestType", "change-order")}>
              <FileText className="h-4 w-4 mr-2" />
              Change Order
            </TabsTrigger>
            <TabsTrigger value="blanket-po" onClick={() => form.setValue("requestType", "blanket-po")}>
              <Plus className="h-4 w-4 mr-2" />
              Blanket PO
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );

  const NewPurchaseForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="goods">Goods</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="mixed">Goods & Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Procurement">Procurement</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor: any) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessJustification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Justification</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Explain the business need for this purchase..." rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateNeededBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Needed By</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("itemType") === "services" && (
              <FormField
                control={form.control}
                name="contractNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Reference</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter contract number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {form.watch("itemType") === "services" && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contractStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="businessJustification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Justification</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Explain the business need for this purchase..." rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Line Items
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {lineItems.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Product Number</label>
                    <Input
                      value={item.productNumber}
                      onChange={(e) => updateLineItem(item.id, "productNumber", e.target.value)}
                      placeholder="SKU/Product #"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">General Ledger Code *</label>
                    <Select 
                      value={item.generalLedgerCode}
                      onValueChange={(value) => updateLineItem(item.id, "generalLedgerCode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GL Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4000-001">4000-001 - Office Supplies</SelectItem>
                        <SelectItem value="4000-002">4000-002 - Computer Equipment</SelectItem>
                        <SelectItem value="4000-003">4000-003 - Software Licenses</SelectItem>
                        <SelectItem value="4000-004">4000-004 - Professional Services</SelectItem>
                        <SelectItem value="4000-005">4000-005 - Maintenance & Repairs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit of Measure</label>
                    <Select 
                      value={item.unitOfMeasure}
                      onValueChange={(value) => updateLineItem(item.id, "unitOfMeasure", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Each">Each</SelectItem>
                        <SelectItem value="Dozen">Dozen</SelectItem>
                        <SelectItem value="Case">Case</SelectItem>
                        <SelectItem value="Hour">Hour</SelectItem>
                        <SelectItem value="Day">Day</SelectItem>
                        <SelectItem value="Month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total</label>
                    <Input
                      value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                {form.watch("itemType") === "services" && (
                  <div>
                    <label className="text-sm font-medium">Contract Number</label>
                    <Input
                      value={item.contractNumber}
                      onChange={(e) => updateLineItem(item.id, "contractNumber", e.target.value)}
                      placeholder="Associated contract number"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Request Value:</span>
              <span className="text-lg font-bold">
                ${lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('fileUpload')?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Attachments
            </Button>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ChangeOrderForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Order Number</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO to modify" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {purchaseOrders.map((po: any) => (
                      <SelectItem key={po.poNumber} value={po.poNumber}>
                        {po.poNumber} - {po.vendor} (${po.totalAmount?.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="changeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of Changes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe exactly what needs to be changed on this PO..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessJustification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Justification</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Explain why this change is necessary..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low - Standard Processing</SelectItem>
                    <SelectItem value="medium">Medium - Within 3 Days</SelectItem>
                    <SelectItem value="high">High - Within 24 Hours</SelectItem>
                    <SelectItem value="critical">Critical - Immediate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Section for Change Orders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Supporting Documentation</label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Supporting Files
                </Button>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Uploaded Files:</label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BlanketPOForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blanket Purchase Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="businessJustification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Justification for Blanket PO</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Explain why a blanket PO is needed (recurring purchases, cost savings, etc.)..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Estimated Annual Value</label>
              <Input type="number" placeholder="$0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Contract Duration</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="2-years">2 Years</SelectItem>
                  <SelectItem value="3-years">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Requisition</h1>
        <p className="text-muted-foreground">
          Submit new purchases, modify existing orders, or create blanket agreements
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <RequestTypeSelector />

          {activeTab === "new-purchase" && <NewPurchaseForm />}
          {activeTab === "change-order" && <ChangeOrderForm />}
          {activeTab === "blanket-po" && <BlanketPOForm />}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="submit" disabled={submitMutation.isPending}>
              <Send className="h-4 w-4 mr-2" />
              {submitMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
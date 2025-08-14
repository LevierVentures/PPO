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
  deliveryLocation: z.string().optional(), // Global delivery location
  contractNumber: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  poNumber: z.string().optional(), // For change orders
  changeDescription: z.string().optional(), // For change orders
  urgencyLevel: z.string().optional(),
  // Cost savings fields (manual input from quotes)
  originalPrice: z.number().optional(),
  discountAmount: z.number().optional(),
  discountPercentage: z.number().optional(),
  costSavingsNotes: z.string().optional(),
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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/80 via-white to-violet-50/80 dark:from-blue-950/20 dark:via-gray-900 dark:to-violet-950/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 via-violet-600 to-emerald-600 bg-clip-text text-transparent">Request Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 border-0 shadow-md">
            <TabsTrigger 
              value="new-purchase" 
              onClick={() => form.setValue("requestType", "new-purchase")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Purchase
            </TabsTrigger>
            <TabsTrigger 
              value="change-order" 
              onClick={() => form.setValue("requestType", "change-order")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-700 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Change Order
            </TabsTrigger>
            <TabsTrigger 
              value="blanket-po" 
              onClick={() => form.setValue("requestType", "blanket-po")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white"
            >
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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/60 via-white to-blue-50/40 dark:from-blue-950/20 dark:via-gray-900 dark:to-blue-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-300">Purchase Details</CardTitle>
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

      {/* Cost Savings Section for New Purchase */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/40 via-white to-blue-50/20 dark:from-blue-950/20 dark:via-gray-900 dark:to-blue-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-300">Cost Savings (From Quotes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="costSavingsNotes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Cost Savings Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Details about negotiated savings, quote comparisons, etc..."
                    rows={2}
                    className="border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  const ChangeOrderForm = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50/60 via-white to-violet-50/40 dark:from-violet-950/20 dark:via-gray-900 dark:to-violet-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-violet-700 dark:text-violet-300">Change Order Details</CardTitle>
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

      {/* Cost Savings Section for Change Order */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50/40 via-white to-violet-50/20 dark:from-violet-950/20 dark:via-gray-900 dark:to-violet-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-violet-700 dark:text-violet-300">Cost Savings (From Quotes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="costSavingsNotes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Cost Savings Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Details about negotiated savings, quote comparisons, etc..."
                    rows={2}
                    className="border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  const BlanketPOForm = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40 dark:from-emerald-950/20 dark:via-gray-900 dark:to-emerald-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Blanket Purchase Order</CardTitle>
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
            <FormField
              control={form.control}
              name="deliveryLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400">
                        <SelectValue placeholder="Select delivery location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                      <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                      <SelectItem value="production-floor">Production Floor</SelectItem>
                      <SelectItem value="main-office">Main Office</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateNeededBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Needed By</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product/Raw Material Line Items */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 dark:from-emerald-950/20 dark:via-gray-900 dark:to-emerald-950/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Products & Raw Materials</CardTitle>
            <Button type="button" onClick={addLineItem} size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="border-2 border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4 space-y-4 bg-gradient-to-r from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-gray-900/50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-emerald-700 dark:text-emerald-300">Product {index + 1}</h4>
                  {lineItems.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Product Number *</label>
                    <Input
                      value={item.productNumber}
                      onChange={(e) => updateLineItem(item.id, "productNumber", e.target.value)}
                      placeholder="SKU/Product #"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Product Description *</label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Product/raw material description"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">General Ledger Code *</label>
                    <Select 
                      value={item.generalLedgerCode}
                      onValueChange={(value) => updateLineItem(item.id, "generalLedgerCode", value)}
                    >
                      <SelectTrigger className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400">
                        <SelectValue placeholder="Select GL Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4000-001">4000-001 - Office Supplies</SelectItem>
                        <SelectItem value="4000-002">4000-002 - Computer Equipment</SelectItem>
                        <SelectItem value="4000-003">4000-003 - Software Licenses</SelectItem>
                        <SelectItem value="4000-006">4000-006 - Raw Materials</SelectItem>
                        <SelectItem value="4000-007">4000-007 - Manufacturing Supplies</SelectItem>
                        <SelectItem value="4000-008">4000-008 - Industrial Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Expected Quantity *</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      min="1"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Unit of Measure</label>
                    <Select 
                      value={item.unitOfMeasure}
                      onValueChange={(value) => updateLineItem(item.id, "unitOfMeasure", value)}
                    >
                      <SelectTrigger className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Each">Each</SelectItem>
                        <SelectItem value="Dozen">Dozen</SelectItem>
                        <SelectItem value="Case">Case</SelectItem>
                        <SelectItem value="Pound">Pound</SelectItem>
                        <SelectItem value="Ton">Ton</SelectItem>
                        <SelectItem value="Gallon">Gallon</SelectItem>
                        <SelectItem value="Barrel">Barrel</SelectItem>
                        <SelectItem value="Square Foot">Square Foot</SelectItem>
                        <SelectItem value="Linear Foot">Linear Foot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Unit Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Total</label>
                    <Input
                      value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                      readOnly
                      className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Minimum Order Quantity</label>
                    <Input
                      type="number"
                      placeholder="Min order quantity"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Lead Time (Days)</label>
                    <Input
                      type="number"
                      placeholder="Expected lead time"
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex justify-between items-center">
              <span className="font-medium text-emerald-800 dark:text-emerald-200">Total Estimated Blanket PO Value:</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                ${lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Savings Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 dark:from-emerald-950/20 dark:via-gray-900 dark:to-emerald-950/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Cost Savings (From Quotes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="costSavingsNotes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Cost Savings Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Details about negotiated savings, quote comparisons, etc..."
                    rows={2}
                    className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Professional 2030 Header - Requisitions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100/40 via-violet-50/60 to-emerald-100/40 border-2 border-blue-200/30 shadow-2xl dark:from-blue-950/20 dark:via-violet-950/25 dark:to-emerald-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-violet-600 to-emerald-700 bg-clip-text text-transparent mb-3">
                Unified Requisition System
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                AI-powered procurement requests with intelligent workflows and automated approvals
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                  <p className="font-bold text-blue-700">12</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></div>
                  <p className="font-bold text-emerald-700">47</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <RequestTypeSelector />

          {activeTab === "new-purchase" && <NewPurchaseForm />}
          {activeTab === "change-order" && <ChangeOrderForm />}
          {activeTab === "blanket-po" && <BlanketPOForm />}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/20">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="submit" disabled={submitMutation.isPending} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              {submitMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
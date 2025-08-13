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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Save, Send, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { insertRequisitionSchema, insertNewVendorRequestSchema } from "@shared/schema";
import { glCodes } from "@/lib/gl-codes";
import { useLocation } from "wouter";

const requestFormSchema = z.object({
  requestType: z.enum(["goods", "services", "mixed", "new-vendor"]),
  department: z.string().min(1, "Department is required"),
  budgetCode: z.string().optional(),

  vendorId: z.string().optional(),
  shippingAddress: z.string().optional(),
  businessJustification: z.string().min(1, "Business justification is required"),
});

const newVendorFormSchema = insertNewVendorRequestSchema.extend({
  department: z.string().min(1, "Department is required"),
});

type RequestFormData = z.infer<typeof requestFormSchema>;
type NewVendorFormData = z.infer<typeof newVendorFormSchema>;

export default function RequestIntake() {
  const [, setLocation] = useLocation();
  const { state, showError } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState([
    {
      id: 1,
      itemType: "good",
      sku: "",
      description: "",
      quantity: 1,
      unitOfMeasure: "Each",
      unitPrice: 0,
      generalLedgerCode: "",
      isHazmat: false,
      contractNumber: "",
    },
  ]);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: "goods",
      department: state.currentUser.department,
      shippingAddress: "Default: 123 Corporate Blvd, Business City, ST 12345",
    },
  });

  const newVendorForm = useForm<NewVendorFormData>({
    resolver: zodResolver(newVendorFormSchema),
    defaultValues: {
      department: state.currentUser.department,
      requestorId: state.currentUser.id,
    },
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["/api/vendors"],
    queryFn: api.vendors.getAll,
  });

  const createRequisitionMutation = useMutation({
    mutationFn: api.requisitions.create,
    onSuccess: () => {
      toast({ title: "Success", description: "Request submitted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
      setLocation("/");
    },
    onError: () => {
      showError("Failed to submit request");
    },
  });

  const createNewVendorMutation = useMutation({
    mutationFn: api.newVendorRequests.create,
    onSuccess: () => {
      toast({ title: "Success", description: "New vendor request submitted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/new-vendor-requests"] });
      setLocation("/");
    },
    onError: () => {
      showError("Failed to submit new vendor request");
    },
  });

  const requestType = form.watch("requestType");
  const selectedVendor = form.watch("vendorId");

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        itemType: "good",
        sku: "",
        description: "",
        quantity: 1,
        unitOfMeasure: "Each",
        unitPrice: 0,
        isHazmat: false,
        contractNumber: "",
      },
    ]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const simulatePunchOut = () => {
    const vendor = vendors.find(v => v.id === selectedVendor);
    if (vendor) {
      toast({
        title: "Simulating PunchOut",
        description: `Opening ${vendor.name} catalog. In a real system, this would integrate with vendor catalogs.`,
      });
    }
  };

  const onSubmitRequest = (data: RequestFormData) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    createRequisitionMutation.mutate({
      requestId: `REQ-${Date.now()}`,
      requestType: data.requestType,
      requestorId: state.currentUser.id,
      department: data.department,
      budgetCode: data.budgetCode || null,
      totalAmount: totalAmount.toString(),
      businessJustification: data.businessJustification,
      shippingAddress: data.shippingAddress || null,
      isMultiVendor: false,
    });
  };

  const onSubmitNewVendor = (data: NewVendorFormData) => {
    createNewVendorMutation.mutate(data);
  };

  if (requestType === "new-vendor") {
    return (
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Vendor Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...newVendorForm}>
              <form onSubmit={newVendorForm.handleSubmit(onSubmitNewVendor)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={newVendorForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={newVendorForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={newVendorForm.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Corporation">Corporation</SelectItem>
                            <SelectItem value="LLC">LLC</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={newVendorForm.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="XX-XXXXXXX" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={newVendorForm.control}
                  name="justification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justification for New Vendor</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why this new vendor is needed..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={createNewVendorMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Purchase Requisition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitRequest)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="requestType"
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
                          <SelectItem value="mixed">Mixed (Goods + Services + Capex)</SelectItem>
                          <SelectItem value="new-vendor">New Vendor Request</SelectItem>
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
                      <FormLabel>Requesting Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT Department">IT Department</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="R&D">R&D</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., IT-2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Vendor Selection */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vendorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Selection</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vendor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name} ({vendor.integrationType.toUpperCase()})
                            </SelectItem>
                          ))}
                          <SelectItem value="manual">Manual Entry</SelectItem>
                          <SelectItem value="multiple">Multiple Vendors</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedVendor && selectedVendor !== "manual" && selectedVendor !== "multiple" && (
                  <Button type="button" variant="secondary" onClick={simulatePunchOut}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shop from Catalog
                  </Button>
                )}
              </div>

              {/* Shipping Address */}
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Default: 123 Corporate Blvd, Business City, ST 12345">
                          Default: 123 Corporate Blvd, Business City, ST 12345
                        </SelectItem>
                        <SelectItem value="Warehouse: 456 Storage Way, Industrial Park, ST 12346">
                          Warehouse: 456 Storage Way, Industrial Park, ST 12346
                        </SelectItem>
                        <SelectItem value="Custom Address">Custom Address</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Items/Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Item Type</label>
                          <Select
                            value={item.itemType}
                            onValueChange={(value) => updateItem(item.id, "itemType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="service">Service</SelectItem>
                              <SelectItem value="capex">Capital Expenditure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(item.itemType === "good" || item.itemType === "capex") && (
                          <div>
                            <label className="text-sm font-medium">SKU/Product Code</label>
                            <Input
                              value={item.sku}
                              onChange={(e) => updateItem(item.id, "sku", e.target.value)}
                              placeholder="e.g., SKU-12345"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {(item.itemType === "good" || item.itemType === "capex") && (
                          <>
                            <div>
                              <label className="text-sm font-medium">Quantity</label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                                min="1"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">Unit of Measure</label>
                              <Select
                                value={item.unitOfMeasure}
                                onValueChange={(value) => updateItem(item.id, "unitOfMeasure", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Each">Each</SelectItem>
                                  <SelectItem value="Box">Box</SelectItem>
                                  <SelectItem value="Case">Case</SelectItem>
                                  <SelectItem value="Hour">Hour</SelectItem>
                                  <SelectItem value="Day">Day</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        <div>
                          <label className="text-sm font-medium">Unit Price</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>

                        {item.itemType === "service" && (
                          <div>
                            <label className="text-sm font-medium">Contract Number</label>
                            <Input
                              value={item.contractNumber}
                              onChange={(e) => updateItem(item.id, "contractNumber", e.target.value)}
                              placeholder="CONTRACT-2024-001"
                            />
                          </div>
                        )}
                      </div>

                      {/* GL Code - Required for all line items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">General Ledger Code *</label>
                          <Select
                            value={item.generalLedgerCode}
                            onValueChange={(value) => updateItem(item.id, "generalLedgerCode", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select GL Code" />
                            </SelectTrigger>
                            <SelectContent>
                              {glCodes.map((code) => (
                                <SelectItem key={code.code} value={code.code}>
                                  {code.code} - {code.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(item.itemType === "good" || item.itemType === "capex") && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`hazmat-${item.id}`}
                            checked={item.isHazmat}
                            onCheckedChange={(checked) => updateItem(item.id, "isHazmat", checked)}
                          />
                          <label htmlFor={`hazmat-${item.id}`} className="text-sm font-medium">
                            Hazmat Item
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Item
                  </Button>
                </CardContent>
              </Card>

              {/* Business Justification */}
              <FormField
                control={form.control}
                name="businessJustification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Justification</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain the business need for this request..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button type="submit" disabled={createRequisitionMutation.isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

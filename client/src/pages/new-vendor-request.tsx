import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { z } from "zod";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  FileText, 
  Upload, 
  ArrowLeft 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const newVendorRequestSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  businessType: z.string().min(1, "Business type is required"),
  ein: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().default("United States"),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  accountType: z.enum(["checking", "savings"]).optional(),
  w9Document: z.string().optional(),
  supportingDocuments: z.array(z.string()).optional(),
  justification: z.string().min(1, "Business justification is required"),
});

type NewVendorRequestForm = z.infer<typeof newVendorRequestSchema>;

export default function NewVendorRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [w9File, setW9File] = useState<string>("");

  const form = useForm<NewVendorRequestForm>({
    resolver: zodResolver(newVendorRequestSchema),
    defaultValues: {
      country: "United States",
      supportingDocuments: [],
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: NewVendorRequestForm) => {
      const requestId = `NVR-${Date.now()}`;
      return apiRequest("/api/vendor-requests", {
        method: "POST",
        body: { 
          ...data, 
          requestId,
          w9Document: w9File,
          supportingDocuments: uploadedFiles 
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your new vendor request has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vendor-requests"] });
      setLocation("/vendors");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit vendor request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'w9' | 'supporting') => {
    const files = event.target.files;
    if (files) {
      // Simulate file upload - in a real system, this would upload to cloud storage
      const fileNames = Array.from(files).map(file => file.name);
      
      if (type === 'w9' && fileNames.length > 0) {
        setW9File(fileNames[0]);
        toast({
          title: "W9 Uploaded",
          description: `W9 form "${fileNames[0]}" has been uploaded.`,
        });
      } else if (type === 'supporting') {
        setUploadedFiles(prev => [...prev, ...fileNames]);
        toast({
          title: "Documents Uploaded",
          description: `${fileNames.length} supporting document(s) uploaded.`,
        });
      }
    }
  };

  const onSubmit = (data: NewVendorRequestForm) => {
    createRequestMutation.mutate(data);
  };

  const businessTypes = [
    "Corporation",
    "LLC",
    "Partnership",
    "Sole Proprietorship",
    "Non-Profit Organization",
    "Government Entity",
    "Other"
  ];

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/vendors")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Vendors
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Vendor Request</h1>
          <p className="text-muted-foreground">Request approval for a new vendor with comprehensive onboarding information</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName"
                  {...form.register("companyName")} 
                  placeholder="Enter company name"
                />
                {form.formState.errors.companyName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.companyName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select onValueChange={(value) => form.setValue("businessType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.businessType && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.businessType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ein">EIN (Federal Tax ID)</Label>
                <Input 
                  id="ein"
                  {...form.register("ein")} 
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="taxId">State Tax ID</Label>
                <Input 
                  id="taxId"
                  {...form.register("taxId")} 
                  placeholder="Enter state tax ID"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input 
                  id="contactPerson"
                  {...form.register("contactPerson")} 
                  placeholder="Primary contact name"
                />
                {form.formState.errors.contactPerson && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input 
                  id="contactEmail"
                  type="email"
                  {...form.register("contactEmail")} 
                  placeholder="contact@company.com"
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input 
                  id="contactPhone"
                  {...form.register("contactPhone")} 
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              Business Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input 
                id="address"
                {...form.register("address")} 
                placeholder="123 Business St"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city"
                  {...form.register("city")} 
                  placeholder="City"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => form.setValue("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.state && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input 
                  id="zipCode"
                  {...form.register("zipCode")} 
                  placeholder="12345"
                />
                {form.formState.errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.zipCode.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country"
                  {...form.register("country")} 
                  defaultValue="United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Banking Information (Optional)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide banking details for electronic payments. This information will be securely stored and encrypted.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName"
                  {...form.register("bankName")} 
                  placeholder="Bank of America"
                />
              </div>

              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select onValueChange={(value) => form.setValue("accountType", value as "checking" | "savings")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input 
                  id="routingNumber"
                  {...form.register("routingNumber")} 
                  placeholder="123456789"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  type="password"
                  {...form.register("accountNumber")} 
                  placeholder="Account number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* W9 Form */}
            <div>
              <Label className="text-base font-medium">W9 Tax Form *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a completed W9 form for tax reporting purposes.
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, 'w9')}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload W9
                </Button>
              </div>
              {w9File && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  ✓ Uploaded: {w9File}
                </div>
              )}
            </div>

            <Separator />

            {/* Supporting Documents */}
            <div>
              <Label className="text-base font-medium">Supporting Documents</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload additional documents such as business licenses, certificates, insurance policies, etc.
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, 'supporting')}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      ✓ {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Justification */}
        <Card>
          <CardHeader>
            <CardTitle>Business Justification</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="justification">Why do you need this vendor? *</Label>
              <Textarea
                id="justification"
                {...form.register("justification")}
                placeholder="Explain the business need, services/products required, and why this vendor is the best choice..."
                rows={4}
              />
              {form.formState.errors.justification && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.justification.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => setLocation("/vendors")}>
            Cancel
          </Button>
          <Button type="submit" disabled={createRequestMutation.isPending}>
            {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
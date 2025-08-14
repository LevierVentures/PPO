import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Plus,
  Send,
  Clock,
  CheckCircle,
  Mail,
  Building,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface RFPFormData {
  title: string;
  description: string;
  requirements: string;
  budget: string;
  deadline: string;
  contactEmail: string;
  department: string;
  vendorEmails: string; // Comma-separated list
  category: string;
}

export default function RFPManagement() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [formData, setFormData] = useState<RFPFormData>({
    title: "",
    description: "",
    requirements: "",
    budget: "",
    deadline: "",
    contactEmail: "",
    department: "",
    vendorEmails: "",
    category: ""
  });

  // Query existing RFPs
  const { data: rfps = [] } = useQuery({
    queryKey: ['/api/rfps']
  });

  // Create RFP mutation
  const createRFPMutation = useMutation({
    mutationFn: async (data: RFPFormData) => {
      const response = await fetch('/api/rfps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          vendorEmails: data.vendorEmails.split(',').map(email => email.trim()),
          createdDate: new Date().toISOString(),
          status: 'draft',
          responseCount: 0
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rfps'] });
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        requirements: "",
        budget: "",
        deadline: "",
        contactEmail: "",
        department: "",
        vendorEmails: "",
        category: ""
      });
      toast({
        title: "RFP Created Successfully",
        description: "Your Request for Proposal has been created and is ready to send to vendors."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRFPMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof RFPFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'responses': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRFPs = rfps.filter((rfp: any) => {
    const matchesSearch = searchTerm === "" || 
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500/5 via-green-500/10 to-emerald-500/5 border-green-500/20 border-2 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Request for Proposals
              </h1>
              <p className="text-lg text-muted-foreground mt-2 font-medium">
                Manage vendor proposals and competitive bidding processes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Active RFPs</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="font-bold text-green-600">{rfps.filter((r: any) => r.status !== 'closed').length}</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search RFPs by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-80"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent to Vendors</option>
            <option value="responses">Receiving Responses</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create RFP
        </Button>
      </div>

      {/* RFP Creation Form */}
      {showForm && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800">Create New RFP</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">RFP Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., IT Infrastructure Upgrade Services"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Construction">Construction</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what you need vendors to provide..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Detailed Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List specific requirements, qualifications, deliverables..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="$50,000 - $100,000"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Response Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email (for responses) *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="procurement@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendorEmails">Vendor Emails (comma-separated)</Label>
                  <Input
                    id="vendorEmails"
                    value={formData.vendorEmails}
                    onChange={(e) => handleInputChange('vendorEmails', e.target.value)}
                    placeholder="vendor1@email.com, vendor2@email.com"
                  />
                </div>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  The RFP will be automatically sent to the vendor emails listed above. Make sure they are correct before submitting.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createRFPMutation.isPending}>
                  {createRFPMutation.isPending ? "Creating..." : "Create RFP"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* RFP List */}
      <div className="space-y-4">
        {filteredRFPs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No RFPs Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" ? "No RFPs match your search criteria." : "You haven't created any RFPs yet."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First RFP
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredRFPs.map((rfp: any) => (
            <Card key={rfp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{rfp.title}</h3>
                      <Badge className={getStatusColor(rfp.status)}>
                        {rfp.status.charAt(0).toUpperCase() + rfp.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{rfp.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{rfp.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(rfp.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {rfp.vendorEmails?.length || 0} vendors
                      </div>
                      {rfp.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {rfp.budget}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        {rfp.responseCount || 0} responses
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {rfp.status === 'draft' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="h-3 w-3 mr-1" />
                        Send to Vendors
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
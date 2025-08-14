import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield,
  Camera,
  Save,
  Edit2,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Settings,
  Globe,
  Filter
} from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

// Role definitions for display
const ROLE_DEFINITIONS = {
  'end_user': {
    name: 'End User',
    description: 'Can create requisitions and view own requests',
    permissions: ['create_requisitions', 'view_own_requests'],
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    canViewAllDepartments: false
  },
  'manager': {
    name: 'Manager',
    description: 'Can approve requests within department and view department data',
    permissions: ['approve_requests', 'view_department_data', 'create_requisitions'],
    color: 'bg-green-100 text-green-800 border-green-200',
    canViewAllDepartments: false
  },
  'director': {
    name: 'Department Director', 
    description: 'Can approve high-value requests and view department analytics',
    permissions: ['approve_high_value', 'view_department_analytics', 'view_department_data', 'create_requisitions'],
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    canViewAllDepartments: false
  },
  'procurement_sme': {
    name: 'Procurement Specialist',
    description: 'Can view all procurement activities and manage vendors',
    permissions: ['view_all_data', 'manage_vendors', 'manage_contracts', 'approve_requests'],
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    canViewAllDepartments: true
  },
  'finance': {
    name: 'Finance Team',
    description: 'Can view all financial data and approve invoices',
    permissions: ['view_all_financial_data', 'approve_invoices', 'manage_budgets'],
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    canViewAllDepartments: true
  },
  'legal': {
    name: 'Legal Team',
    description: 'Can review contracts and compliance requirements',
    permissions: ['review_contracts', 'view_all_contracts', 'manage_compliance'],
    color: 'bg-red-100 text-red-800 border-red-200',
    canViewAllDepartments: true
  },
  'admin': {
    name: 'System Administrator',
    description: 'Full system access and user management',
    permissions: ['full_access', 'manage_users', 'system_configuration'],
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    canViewAllDepartments: true
  }
};

export default function UserProfileRBAC() {
  const { state } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Mock current user data - in real app, get from authentication
  const currentUser = {
    id: "user-001",
    firstName: "Sarah",
    lastName: "Johnson",
    username: "sarah.johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-5678",
    department: "IT",
    role: "manager",
    canViewAllDepartments: false,
    avatar: null,
    title: "IT Department Manager",
    joinDate: "2022-03-15",
    lastLogin: "2024-12-14T10:30:00Z"
  };

  const roleInfo = ROLE_DEFINITIONS[currentUser.role as keyof typeof ROLE_DEFINITIONS];

  // Query user's activity stats based on their role and department
  const { data: userStats } = useQuery({
    queryKey: ['/api/user-stats', currentUser.id, currentUser.role, currentUser.department],
    initialData: {
      totalRequests: currentUser.canViewAllDepartments ? 156 : 23,
      pendingApprovals: currentUser.role === 'manager' || currentUser.role === 'director' ? 3 : 0,
      approvedAmount: currentUser.canViewAllDepartments ? 425000 : 87500,
      departmentSpend: currentUser.canViewAllDepartments ? 1250000 : 245000,
      contractsManaged: roleInfo?.canViewAllDepartments ? 23 : 4,
      lastActivity: "2024-12-14T09:15:00Z"
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Handle image upload
        console.log("Image uploaded:", e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPermissionIcon = (permission: string) => {
    const iconMap: Record<string, any> = {
      'create_requisitions': FileText,
      'view_own_requests': Eye,
      'approve_requests': CheckCircle,
      'view_department_data': Users,
      'view_all_data': Globe,
      'manage_vendors': Building2,
      'manage_contracts': Shield,
      'view_all_financial_data': DollarSign,
      'approve_invoices': CheckCircle,
      'manage_budgets': DollarSign,
      'review_contracts': Shield,
      'full_access': Settings,
      'manage_users': Users,
      'system_configuration': Settings
    };
    
    return iconMap[permission] || CheckCircle;
  };

  const formatPermissionName = (permission: string) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and view your role permissions
          </p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="role">Role & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Stats</TabsTrigger>
          <TabsTrigger value="preferences">Data Filtering</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture and Basic Info */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={currentUser.avatar || undefined} />
                    <AvatarFallback className="text-lg">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h3 className="text-xl font-semibold">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-muted-foreground">{currentUser.title}</p>
                <Badge className={roleInfo?.color || "bg-gray-100"}>
                  {roleInfo?.name || currentUser.role}
                </Badge>

                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{currentUser.department} Department</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>@{currentUser.username}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={currentUser.firstName}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={currentUser.lastName}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser.email}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={currentUser.phone}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={currentUser.department}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={currentUser.title}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="role">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Current Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${roleInfo?.color} px-4 py-2 text-base`}>
                      {roleInfo?.name}
                    </Badge>
                    {roleInfo?.canViewAllDepartments && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Globe className="h-3 w-3 mr-1" />
                        All Departments Access
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{roleInfo?.description}</p>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4" />
                      <span className="font-medium">Data Visibility</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {roleInfo?.canViewAllDepartments 
                        ? "You can view data from all departments across the organization" 
                        : `You can view data from your department: ${currentUser.department}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your current role grants you the following permissions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roleInfo?.permissions.map((permission) => {
                    const IconComponent = getPermissionIcon(permission);
                    return (
                      <div key={permission} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <IconComponent className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {formatPermissionName(permission)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {roleInfo?.canViewAllDepartments ? "Total Requests (All Depts)" : "My Requests"}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">{userStats?.totalRequests}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {(currentUser.role === 'manager' || currentUser.role === 'director' || roleInfo?.canViewAllDepartments) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Approvals</p>
                      <p className="text-3xl font-bold text-orange-600">{userStats?.pendingApprovals}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {roleInfo?.canViewAllDepartments ? "Total Spend (All Depts)" : "Department Spend"}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ${userStats?.departmentSpend?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Data Scope</span>
                  <Badge className={roleInfo?.canViewAllDepartments ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                    {roleInfo?.canViewAllDepartments ? "Organization-wide" : `${currentUser.department} Department Only`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Last Activity</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(userStats?.lastActivity).toLocaleDateString()} at {new Date(userStats?.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Account Since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(currentUser.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Data Filtering Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how data is filtered based on your role and department access
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Department Data Filtering
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {roleInfo?.canViewAllDepartments 
                        ? "As a SME/Admin, you have access to view data from all departments. This setting affects dashboard metrics, reports, and activity feeds."
                        : `As a ${roleInfo?.name}, you can only view data from your department (${currentUser.department}). This ensures data security and relevance.`
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="all-departments" 
                      checked={roleInfo?.canViewAllDepartments || false}
                      disabled={true} // Controlled by role
                    />
                    <Label htmlFor="all-departments" className="text-sm">
                      {roleInfo?.canViewAllDepartments ? "All Departments" : "Department Only"}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Dashboard & Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    {roleInfo?.canViewAllDepartments 
                      ? "Shows organization-wide metrics and statistics"
                      : `Shows ${currentUser.department} department metrics only`
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Activity Feeds</h4>
                  <p className="text-sm text-muted-foreground">
                    {roleInfo?.canViewAllDepartments 
                      ? "Displays activities from all departments"
                      : `Displays activities from ${currentUser.department} department only`
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Approval Queues</h4>
                  <p className="text-sm text-muted-foreground">
                    {(currentUser.role === 'manager' || currentUser.role === 'director') && !roleInfo?.canViewAllDepartments
                      ? `Shows requests from ${currentUser.department} department requiring your approval`
                      : roleInfo?.canViewAllDepartments 
                      ? "Shows requests from all departments"
                      : "No approval permissions for your role"
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Performance Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    {roleInfo?.canViewAllDepartments 
                      ? "Access to organization-wide performance metrics"
                      : `Access to ${currentUser.department} department performance only`
                    }
                  </p>
                </div>
              </div>

              {!roleInfo?.canViewAllDepartments && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Need broader access?</h4>
                      <p className="text-sm text-blue-700">
                        Contact your system administrator to request role changes or additional department access permissions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
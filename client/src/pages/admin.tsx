import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Shield, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  Workflow,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function Administration() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  // Mock data for users
  const users = [
    { id: 1, name: "John Smith", email: "john.smith@company.com", role: "Procurement Manager", department: "Procurement", status: "Active", lastLogin: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Finance Director", department: "Finance", status: "Active", lastLogin: "2024-01-15" },
    { id: 3, name: "Mike Wilson", email: "mike.wilson@company.com", role: "Department Manager", department: "IT", status: "Active", lastLogin: "2024-01-14" },
    { id: 4, name: "Lisa Chen", email: "lisa.chen@company.com", role: "Legal Counsel", department: "Legal", status: "Inactive", lastLogin: "2024-01-10" },
  ];

  // Mock workflow templates
  const workflowTemplates = [
    { id: 1, name: "Standard Procurement", steps: 4, departments: ["Procurement", "Finance"], status: "Active" },
    { id: 2, name: "IT Equipment", steps: 5, departments: ["IT", "Procurement", "Finance"], status: "Active" },
    { id: 3, name: "Legal Services", steps: 6, departments: ["Legal", "Procurement", "Finance"], status: "Active" },
    { id: 4, name: "Capital Expenditure", steps: 7, departments: ["Engineering", "Finance", "Legal"], status: "Draft" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Procurement Manager': return 'bg-blue-100 text-blue-800';
      case 'Finance Director': return 'bg-green-100 text-green-800';
      case 'Department Manager': return 'bg-purple-100 text-purple-800';
      case 'Legal Counsel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and system configurations
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@company.com" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurement-manager">Procurement Manager</SelectItem>
                        <SelectItem value="finance-director">Finance Director</SelectItem>
                        <SelectItem value="department-manager">Department Manager</SelectItem>
                        <SelectItem value="legal-counsel">Legal Counsel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateUserOpen(false)}>
                      Create User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6">
          <h2 className="text-xl font-semibold">Roles & Permissions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: "Procurement Manager", permissions: ["Create Requisitions", "Approve Up to $50K", "Manage Vendors"], users: 3 },
              { role: "Finance Director", permissions: ["Approve All Amounts", "Budget Management", "Financial Reports"], users: 2 },
              { role: "Department Manager", permissions: ["Create Requisitions", "Approve Up to $10K", "View Departmental Reports"], users: 5 },
              { role: "Legal Counsel", permissions: ["Contract Review", "Legal Approval", "Compliance Oversight"], users: 1 },
            ].map((roleInfo, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{roleInfo.role}</span>
                    <Badge variant="secondary">{roleInfo.users} users</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {roleInfo.permissions.map((permission, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Permissions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workflows */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Workflow Templates</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowTemplates.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{workflow.name}</span>
                    <Badge variant={workflow.status === 'Active' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{workflow.steps} approval steps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{workflow.departments.join(", ")}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-semibold">System Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Professional Procurement Organization" />
                </div>
                <div>
                  <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                  <Select defaultValue="january">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="autoApprove">Auto-Approve Threshold</Label>
                  <Input id="autoApprove" type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label htmlFor="managerApproval">Manager Approval Required</Label>
                  <Input id="managerApproval" type="number" defaultValue="5000" />
                </div>
                <div>
                  <Label htmlFor="financeApproval">Finance Approval Required</Label>
                  <Input id="financeApproval" type="number" defaultValue="25000" />
                </div>
                <div>
                  <Label htmlFor="executiveApproval">Executive Approval Required</Label>
                  <Input id="executiveApproval" type="number" defaultValue="100000" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
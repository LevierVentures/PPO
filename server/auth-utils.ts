// Role-based access control utilities
export interface UserPermissions {
  canViewAllDepartments: boolean;
  canViewAllApprovals: boolean;
  canViewAllContracts: boolean;
  canViewAllPurchaseOrders: boolean;
  canViewAllInvoices: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
  department: string;
  role: string;
}

export function getUserPermissions(user: any): UserPermissions {
  const isSME = ['procurement_sme', 'finance', 'legal', 'admin'].includes(user.role);
  const isManager = ['manager', 'director'].includes(user.role);
  const isAdmin = user.role === 'admin';

  return {
    canViewAllDepartments: isSME || user.canViewAllDepartments,
    canViewAllApprovals: isSME || isManager,
    canViewAllContracts: isSME || isManager,
    canViewAllPurchaseOrders: isSME || isManager,
    canViewAllInvoices: isSME,
    canManageUsers: isAdmin || user.role === 'procurement_sme',
    canManageSystem: isAdmin,
    department: user.department,
    role: user.role
  };
}

export function filterByDepartment<T extends { department?: string; requestorId?: string }>(
  data: T[],
  userPermissions: UserPermissions,
  users?: any[]
): T[] {
  // SMEs and users with special permissions can see everything
  if (userPermissions.canViewAllDepartments) {
    return data;
  }

  // Filter by department
  return data.filter(item => {
    // If item has direct department field
    if (item.department) {
      return item.department === userPermissions.department;
    }
    
    // If item has requestorId, look up the user's department
    if (item.requestorId && users) {
      const requestor = users.find(u => u.id === item.requestorId);
      return requestor?.department === userPermissions.department;
    }
    
    return true; // Include if we can't determine department
  });
}

export const ROLE_DEFINITIONS = {
  'end_user': {
    name: 'End User',
    description: 'Can create requisitions and view own requests',
    permissions: ['create_requisitions', 'view_own_requests']
  },
  'manager': {
    name: 'Manager',
    description: 'Can approve requests within department and view department data',
    permissions: ['approve_requests', 'view_department_data', 'create_requisitions']
  },
  'director': {
    name: 'Department Director', 
    description: 'Can approve high-value requests and view department analytics',
    permissions: ['approve_high_value', 'view_department_analytics', 'view_department_data', 'create_requisitions']
  },
  'procurement_sme': {
    name: 'Procurement Specialist',
    description: 'Can view all procurement activities and manage vendors',
    permissions: ['view_all_data', 'manage_vendors', 'manage_contracts', 'approve_requests']
  },
  'finance': {
    name: 'Finance Team',
    description: 'Can view all financial data and approve invoices',
    permissions: ['view_all_financial_data', 'approve_invoices', 'manage_budgets']
  },
  'legal': {
    name: 'Legal Team',
    description: 'Can review contracts and compliance requirements',
    permissions: ['review_contracts', 'view_all_contracts', 'manage_compliance']
  },
  'admin': {
    name: 'System Administrator',
    description: 'Full system access and user management',
    permissions: ['full_access', 'manage_users', 'system_configuration']
  }
};
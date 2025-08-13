// Dummy PO data for realistic P2P system demonstration
export const dummyPurchaseOrders = [
  {
    id: "po-001",
    poNumber: "PO-24568",
    vendorId: "vendor-1",
    vendorName: "ACME Corporation",
    amount: "25000.00",
    isBlanketPO: false,
    status: "pending",
    contractStartDate: new Date("2024-01-15"),
    contractEndDate: new Date("2025-01-14"),
    agreementDate: new Date("2024-01-10"),
    contractNumber: "ACME-2024-MAINT",
    attachments: ["contract_acme_2024.pdf", "service_agreement.pdf"],
    createdAt: new Date("2024-12-01"),
    approvedAt: null,
    completedAt: null,
    description: "Annual Maintenance Services - Blanket PO",
    workflowSteps: [
      { step: "Manager Review", status: "completed", assignee: "John Smith", completedAt: new Date("2024-12-01") },
      { step: "Finance Approval", status: "pending", assignee: "Sarah Johnson", completedAt: null },
      { step: "Legal Review", status: "not_started", assignee: "Mike Wilson", completedAt: null },
      { step: "Final Approval", status: "not_started", assignee: "Director", completedAt: null }
    ]
  },
  {
    id: "po-002", 
    poNumber: "PO-24569",
    vendorId: "vendor-2",
    vendorName: "TechSupply Inc",
    amount: "15750.50",
    isBlanketPO: false,
    status: "pending",
    contractStartDate: new Date("2024-11-01"),
    contractEndDate: new Date("2025-10-31"),
    agreementDate: new Date("2024-10-25"),
    contractNumber: "TECH-2024-SW",
    attachments: ["software_license.pdf", "support_terms.pdf"],
    createdAt: new Date("2024-12-02"),
    approvedAt: null,
    completedAt: null,
    description: "Software License Renewal",
    workflowSteps: [
      { step: "Manager Review", status: "completed", assignee: "John Smith", completedAt: new Date("2024-12-02") },
      { step: "Finance Approval", status: "completed", assignee: "Sarah Johnson", completedAt: new Date("2024-12-03") },
      { step: "Legal Review", status: "pending", assignee: "Mike Wilson", completedAt: null },
      { step: "Final Approval", status: "not_started", assignee: "Director", completedAt: null }
    ]
  },
  {
    id: "po-003",
    poNumber: "PO-24570", 
    vendorId: "vendor-3",
    vendorName: "Office Solutions Ltd",
    amount: "3200.00",
    isBlanketPO: false,
    status: "approved",
    contractStartDate: new Date("2024-07-01"),
    contractEndDate: new Date("2025-06-30"),
    agreementDate: new Date("2024-06-15"),
    contractNumber: "OS-2024-SUPPLIES",
    attachments: ["supply_agreement.pdf"],
    createdAt: new Date("2024-11-25"),
    approvedAt: new Date("2024-11-28"),
    completedAt: null,
    description: "Office Supplies - Blanket PO",
    workflowSteps: [
      { step: "Manager Review", status: "completed", assignee: "John Smith", completedAt: new Date("2024-11-25") },
      { step: "Finance Approval", status: "completed", assignee: "Sarah Johnson", completedAt: new Date("2024-11-26") },
      { step: "Legal Review", status: "completed", assignee: "Mike Wilson", completedAt: new Date("2024-11-27") },
      { step: "Final Approval", status: "completed", assignee: "Director", completedAt: new Date("2024-11-28") }
    ]
  },
  {
    id: "po-004",
    poNumber: "PO-24571",
    vendorId: "vendor-4", 
    vendorName: "Global Tech Services",
    amount: "45000.00",
    isBlanketPO: false,
    status: "in-progress",
    contractStartDate: null,
    contractEndDate: null,
    agreementDate: null,
    contractNumber: null,
    attachments: ["equipment_specs.pdf", "installation_guide.pdf"],
    createdAt: new Date("2024-11-20"),
    approvedAt: new Date("2024-11-30"),
    completedAt: null,
    description: "IT Equipment Purchase",
    workflowSteps: [
      { step: "Manager Review", status: "completed", assignee: "John Smith", completedAt: new Date("2024-11-20") },
      { step: "Finance Approval", status: "completed", assignee: "Sarah Johnson", completedAt: new Date("2024-11-25") },
      { step: "Legal Review", status: "completed", assignee: "Mike Wilson", completedAt: new Date("2024-11-28") },
      { step: "Final Approval", status: "completed", assignee: "Director", completedAt: new Date("2024-11-30") }
    ]
  }
];

export const contractsExpiringSoon = dummyPurchaseOrders.filter(po => {
  if (!po.contractEndDate) return false;
  const daysUntilExpiry = Math.ceil((po.contractEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0; // Contracts expiring within 90 days
});

export const getWorkflowStatus = (steps: any[]) => {
  const completed = steps.filter(s => s.status === 'completed').length;
  const pending = steps.filter(s => s.status === 'pending').length;
  const total = steps.length;
  
  return {
    completed,
    pending,
    total,
    currentStep: steps.find(s => s.status === 'pending')?.step || 'Completed',
    progress: Math.round((completed / total) * 100)
  };
};
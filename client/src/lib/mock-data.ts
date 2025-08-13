// Mock data for UI demonstration and testing
export const mockKPIData = {
  myApprovals: 12,
  posInFlight: 47,
  apInvoiceRouting: 8,
  threeWayMatchPending: 23,
};

export const mockWorkloadData = {
  approvalsDueToday: [
    { id: "REQ-24118", description: "Office Supplies", amount: 2340 },
    { id: "REQ-24119", description: "IT Equipment", amount: 15670 },
    { id: "REQ-24120", description: "Marketing Services", amount: 8900 },
  ],
  pendingPOs: [
    { poNumber: "PO-24568", vendor: "ACME Corp", description: "Annual Maintenance Services", amount: 25000, status: "pending", daysInWorkflow: 3, poId: "po-001" },
    { poNumber: "PO-24569", vendor: "TechSupply Inc", description: "Software License Renewal", amount: 15750, status: "pending", daysInWorkflow: 1, poId: "po-002" },
  ],
  contractsExpiring: [
    { poNumber: "PO-24568", vendor: "ACME Corp", service: "Maintenance Contract", daysLeft: 30, poId: "po-001", agreementDate: "2024-01-10" },
    { poNumber: "PO-24569", vendor: "TechSupply Inc", service: "Software License", daysLeft: 15, poId: "po-002", agreementDate: "2024-10-25" },
  ],
};

export const mockRecentActivity = [
  { action: "PO-24567 approved by Finance", timestamp: "2 hours ago" },
  { action: "REQ-24115 submitted for approval", timestamp: "4 hours ago" },
  { action: "INV-89034 3-way matched", timestamp: "1 day ago" },
  { action: "Vendor ABC Corp onboarding completed", timestamp: "2 days ago" },
];

export const mockAnalyticsAnomalies = [
  {
    type: "warning",
    title: "Contract Expiring Soon",
    description: "Blanket PO-24568 (TechSupply Inc) contract expires in 15 days - consider renewal or replacement",
    action: "Review Contract Renewal",
    poId: "PO-24568",
  },
  {
    type: "success",
    title: "Blanket PO Optimization",
    description: "Office supplies showing consistent usage - recommend converting to Blanket PO for better pricing",
    action: "Create Blanket PO",
  },
  {
    type: "info",
    title: "Vendor Performance Alert",
    description: "ABC Corp has 95% on-time delivery rate - consider for preferred vendor status",
    action: "Review Vendor Status",
    vendorId: "vendor-123",
  },
];

export const mockSavedFilters = [
  {
    name: "R&D Equipment Analysis",
    description: "Department: R&D, Time: 24 months, Category: Equipment",
  },
  {
    name: "High-Value Service Contracts",
    description: "Amount: >$25k, Type: Services, Status: Active",
  },
  {
    name: "Quarterly Marketing Spend",
    description: "Department: Marketing, Time: Current Quarter",
  },
];

export const mockChatPrompts = [
  { id: "workflow", text: "Show Workflow", response: "I can show you workflow details. Try asking about a specific request ID." },
  { id: "forecast", text: "Forecast Spend", response: "For spend forecasting, I can analyze historical data patterns." },
  { id: "blanket-po", text: "Blanket PO Guide", response: "I can help create blanket PO recommendations based on usage patterns." },
  { id: "budget", text: "Budget Status", response: "Current budget alerts: PO-24568 is at 87% budget utilization." },
];

export const generateRequestId = (): string => {
  return `REQ-${Date.now()}`;
};

export const generatePONumber = (): string => {
  return `PO-${Date.now()}`;
};

export const generateVendorRequestId = (): string => {
  return `VEN-${Date.now()}`;
};

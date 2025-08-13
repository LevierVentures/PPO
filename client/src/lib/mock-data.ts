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
  contractsExpiring: [
    { vendor: "ACME Corp", service: "Maintenance", daysLeft: 30 },
    { vendor: "TechSupply Inc", service: "Software License", daysLeft: 15 },
  ],
  forecastedSpikes: [
    { description: "Q4 Marketing Spend - 40% increase projected" },
    { description: "R&D Equipment - Budget threshold approaching" },
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
    title: "PO Running Out of Funds",
    description: "PO-24568 (TechSupply Inc) - 87% of budget consumed with 3 months remaining",
    action: "Review Budget Allocation",
  },
  {
    type: "success",
    title: "Opportunity Identified",
    description: "R&D SKU 55-9876 showing 40% price variance across vendors - consider consolidation",
    action: "Analyze Vendors",
  },
  {
    type: "info",
    title: "Seasonal Forecast",
    description: "Q4 Marketing spend projected to increase 40% based on historical patterns",
    action: "Prepare Budget Plan",
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

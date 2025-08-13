export interface ApprovalItem {
  id: string;
  type: 'requisition' | 'po' | 'invoice';
  title: string;
  description: string;
  amount: number;
  vendor: string;
  requestor: string;
  department: string;
  submittedDate: Date;
  daysWaiting: number;
  priority: 'high' | 'medium' | 'low';
  approvalStep: string;
  nextApprover: string;
}

export const mockApprovalsData: ApprovalItem[] = [
  {
    id: "REQ-24121",
    type: "requisition",
    title: "Software License Renewal",
    description: "Annual Microsoft Office 365 licenses for 50 users",
    amount: 15750,
    vendor: "Microsoft",
    requestor: "Sarah Johnson",
    department: "IT Department",
    submittedDate: new Date("2024-12-10"),
    daysWaiting: 3,
    priority: "high",
    approvalStep: "Department Director Review",
    nextApprover: "Mike Chen"
  },
  {
    id: "REQ-24122",
    type: "requisition",
    title: "Marketing Campaign Services",
    description: "Q1 digital marketing campaign management",
    amount: 28500,
    vendor: "Creative Solutions Inc",
    requestor: "Jennifer Davis",
    department: "Marketing",
    submittedDate: new Date("2024-12-11"),
    daysWaiting: 2,
    priority: "medium",
    approvalStep: "Budget Approval",
    nextApprover: "Lisa Wong"
  },
  {
    id: "PO-24570",
    type: "po",
    title: "Office Furniture Purchase",
    description: "Ergonomic chairs and standing desks for new hires",
    amount: 12340,
    vendor: "Office Furniture Pro",
    requestor: "Robert Kim",
    department: "Operations",
    submittedDate: new Date("2024-12-09"),
    daysWaiting: 4,
    priority: "low",
    approvalStep: "Final Approval",
    nextApprover: "David Thompson"
  },
  {
    id: "REQ-24123",
    type: "requisition",
    title: "Cloud Infrastructure Services",
    description: "AWS services for Q1 expansion project",
    amount: 45000,
    vendor: "Amazon Web Services",
    requestor: "Alex Rodriguez",
    department: "R&D",
    submittedDate: new Date("2024-12-08"),
    daysWaiting: 5,
    priority: "high",
    approvalStep: "Executive Approval",
    nextApprover: "CEO Review"
  },
  {
    id: "INV-90234",
    type: "invoice",
    title: "Consulting Services Invoice",
    description: "November consulting hours - Security audit",
    amount: 18750,
    vendor: "SecureIT Consulting",
    requestor: "Mark Stevens",
    department: "IT Department",
    submittedDate: new Date("2024-12-07"),
    daysWaiting: 6,
    priority: "medium",
    approvalStep: "Finance Review",
    nextApprover: "Finance Team"
  }
];

export const getApprovalsByPriority = () => {
  return {
    high: mockApprovalsData.filter(item => item.priority === 'high'),
    medium: mockApprovalsData.filter(item => item.priority === 'medium'),
    low: mockApprovalsData.filter(item => item.priority === 'low'),
  };
};
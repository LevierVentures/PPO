export interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  vendorName: string;
  vendorId: string;
  amount: number;
  invoiceDate: Date;
  dueDate: Date;
  receivedDate: Date;
  status: 'pending' | 'approved' | 'paid' | 'disputed' | 'rejected';
  description: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    glCode: string;
  }[];
  attachments: string[];
  paymentTerms: string;
  matchStatus: '2-way' | '3-way' | 'pending';
}

export const mockInvoicesData: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-00789",
    poNumber: "PO-24568",
    vendorName: "ACME Corporation",
    vendorId: "vendor-1",
    amount: 25000,
    invoiceDate: new Date("2024-12-01"),
    dueDate: new Date("2024-12-31"),
    receivedDate: new Date("2024-12-05"),
    status: "pending",
    description: "Annual Maintenance Services - Q4 2024",
    paymentTerms: "Net 30",
    matchStatus: "3-way",
    attachments: ["invoice-789.pdf", "service-report.pdf"],
    items: [
      {
        description: "HVAC Maintenance Service",
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
        glCode: "5200-002-0001"
      },
      {
        description: "Electrical System Inspection",
        quantity: 1,
        unitPrice: 10000,
        total: 10000,
        glCode: "5200-002-0001"
      }
    ]
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-00892",
    poNumber: "PO-24569",
    vendorName: "TechSupply Inc",
    vendorId: "vendor-2",
    amount: 15750,
    invoiceDate: new Date("2024-11-28"),
    dueDate: new Date("2024-12-28"),
    receivedDate: new Date("2024-12-02"),
    status: "approved",
    description: "Software License Renewal - Microsoft Office 365",
    paymentTerms: "Net 30",
    matchStatus: "2-way",
    attachments: ["invoice-892.pdf"],
    items: [
      {
        description: "Microsoft Office 365 Business Premium",
        quantity: 50,
        unitPrice: 315,
        total: 15750,
        glCode: "5200-003-0001"
      }
    ]
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-00654",
    poNumber: "PO-24570",
    vendorName: "Office Solutions Ltd",
    vendorId: "vendor-3",
    amount: 5750,
    invoiceDate: new Date("2024-12-03"),
    dueDate: new Date("2025-01-02"),
    receivedDate: new Date("2024-12-06"),
    status: "paid",
    description: "Monthly office supplies delivery",
    paymentTerms: "Net 30",
    matchStatus: "3-way",
    attachments: ["invoice-654.pdf", "delivery-receipt.pdf"],
    items: [
      {
        description: "Copy Paper (Case of 10)",
        quantity: 50,
        unitPrice: 25,
        total: 1250,
        glCode: "5000-001-0001"
      },
      {
        description: "Printer Ink Cartridges",
        quantity: 30,
        unitPrice: 75,
        total: 2250,
        glCode: "5000-002-0001"
      },
      {
        description: "Ergonomic Office Chairs",
        quantity: 10,
        unitPrice: 225,
        total: 2250,
        glCode: "5100-002-0001"
      }
    ]
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-00445",
    poNumber: "PO-24571",
    vendorName: "Global Tech Solutions",
    vendorId: "vendor-4",
    amount: 8900,
    invoiceDate: new Date("2024-11-25"),
    dueDate: new Date("2024-12-25"),
    receivedDate: new Date("2024-11-30"),
    status: "disputed",
    description: "Network equipment installation services",
    paymentTerms: "Net 30",
    matchStatus: "pending",
    attachments: ["invoice-445.pdf"],
    items: [
      {
        description: "Network Switch Installation",
        quantity: 2,
        unitPrice: 3450,
        total: 6900,
        glCode: "5200-001-0001"
      },
      {
        description: "Cable Management Setup",
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
        glCode: "5200-001-0001"
      }
    ]
  }
];

export const getInvoicesByStatus = () => {
  return {
    pending: mockInvoicesData.filter(inv => inv.status === 'pending'),
    approved: mockInvoicesData.filter(inv => inv.status === 'approved'),
    paid: mockInvoicesData.filter(inv => inv.status === 'paid'),
    disputed: mockInvoicesData.filter(inv => inv.status === 'disputed'),
    rejected: mockInvoicesData.filter(inv => inv.status === 'rejected'),
  };
};
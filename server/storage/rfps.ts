// Mock RFP data for demonstration
export const rfpMockData = [
  {
    id: "rfp-001",
    title: "IT Infrastructure Upgrade Services",
    description: "Comprehensive upgrade of existing IT infrastructure including servers, networking equipment, and security systems",
    requirements: "Must have experience with enterprise-level implementations, 24/7 support capability, and certified technicians. Project timeline: 6 months. Required certifications: Cisco, Microsoft, CompTIA.",
    budget: "$150,000 - $300,000",
    deadline: "2024-09-15",
    contactEmail: "procurement@company.com",
    department: "IT",
    vendorEmails: ["techcorp@email.com", "itservices@provider.com", "infra@solutions.com"],
    category: "IT Services",
    createdDate: "2024-08-01T08:00:00Z",
    status: "sent",
    responseCount: 2
  },
  {
    id: "rfp-002", 
    title: "Legal Services Retainer Agreement",
    description: "Seeking legal counsel for corporate matters including contracts, compliance, and litigation support",
    requirements: "Must be licensed in multiple states, experience with tech industry, dedicated partner assignment, competitive hourly rates",
    budget: "$50,000 - $100,000 annually",
    deadline: "2024-08-30",
    contactEmail: "legal@company.com",
    department: "Legal",
    vendorEmails: ["partners@lawfirm.com", "business@legalcorp.com"],
    category: "Professional Services",
    createdDate: "2024-08-10T10:30:00Z",
    status: "responses",
    responseCount: 1
  },
  {
    id: "rfp-003",
    title: "Office Renovation and Construction",
    description: "Complete renovation of 15,000 sq ft office space including modern workspace design, meeting rooms, and collaborative areas",
    requirements: "General contractor license, commercial construction experience, interior design capability, project management certification, insurance requirements",
    budget: "$800,000 - $1,200,000",
    deadline: "2024-09-30",
    contactEmail: "facilities@company.com", 
    department: "Operations",
    vendorEmails: ["bids@construction.com", "projects@builders.com", "quotes@renovation.com"],
    category: "Construction",
    createdDate: "2024-08-05T14:15:00Z",
    status: "draft",
    responseCount: 0
  }
];
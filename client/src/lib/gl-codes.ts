export const glCodes = [
  { code: "5000-001-0001", description: "Office Supplies - General" },
  { code: "5000-002-0001", description: "Office Supplies - Technology" },
  { code: "5100-001-0001", description: "Equipment - Computer Hardware" },
  { code: "5100-002-0001", description: "Equipment - Furniture" },
  { code: "5200-001-0001", description: "Services - Professional" },
  { code: "5200-002-0001", description: "Services - Maintenance" },
  { code: "5200-003-0001", description: "Services - Software Licenses" },
  { code: "5300-001-0001", description: "Utilities - Telecommunications" },
  { code: "5300-002-0001", description: "Utilities - Internet Services" },
  { code: "5400-001-0001", description: "Travel & Entertainment" },
  { code: "5500-001-0001", description: "Marketing & Advertising" },
  { code: "5600-001-0001", description: "Research & Development" },
  { code: "6000-001-0001", description: "Capital Expenditures - Equipment" },
  { code: "6000-002-0001", description: "Capital Expenditures - Software" },
  { code: "7000-001-0001", description: "Facilities - Rent & Lease" },
  { code: "7000-002-0001", description: "Facilities - Maintenance" },
];

export const getGLCodesByCategory = () => {
  return {
    "Office Supplies": glCodes.filter(code => code.code.startsWith("5000")),
    "Equipment": glCodes.filter(code => code.code.startsWith("5100")),
    "Services": glCodes.filter(code => code.code.startsWith("5200")),
    "Utilities": glCodes.filter(code => code.code.startsWith("5300")),
    "Travel": glCodes.filter(code => code.code.startsWith("5400")),
    "Marketing": glCodes.filter(code => code.code.startsWith("5500")),
    "R&D": glCodes.filter(code => code.code.startsWith("5600")),
    "Capital": glCodes.filter(code => code.code.startsWith("6000")),
    "Facilities": glCodes.filter(code => code.code.startsWith("7000")),
  };
};
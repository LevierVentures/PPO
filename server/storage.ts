import { 
  type User, type InsertUser, type Vendor, type InsertVendor,
  type Requisition, type InsertRequisition, type RequisitionItem, type InsertRequisitionItem,
  type PurchaseOrder, type InsertPurchaseOrder, type Invoice, type InsertInvoice,
  type WorkflowStep, type InsertWorkflowStep, type NewVendorRequest, type InsertNewVendorRequest,
  type Analytics, type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | undefined>;

  // Requisitions
  getRequisitions(): Promise<Requisition[]>;
  getRequisition(id: string): Promise<Requisition | undefined>;
  getRequisitionsByUser(userId: string): Promise<Requisition[]>;
  createRequisition(requisition: InsertRequisition): Promise<Requisition>;
  updateRequisition(id: string, requisition: Partial<Requisition>): Promise<Requisition | undefined>;

  // Requisition Items
  getRequisitionItems(requisitionId: string): Promise<RequisitionItem[]>;
  createRequisitionItem(item: InsertRequisitionItem): Promise<RequisitionItem>;

  // Purchase Orders
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(po: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, po: Partial<PurchaseOrder>): Promise<PurchaseOrder | undefined>;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByPO(poId: string): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | undefined>;

  // Workflow Steps
  getWorkflowSteps(requisitionId: string): Promise<WorkflowStep[]>;
  createWorkflowStep(step: InsertWorkflowStep): Promise<WorkflowStep>;
  updateWorkflowStep(id: string, step: Partial<WorkflowStep>): Promise<WorkflowStep | undefined>;

  // New Vendor Requests
  getNewVendorRequests(): Promise<NewVendorRequest[]>;
  createNewVendorRequest(request: InsertNewVendorRequest): Promise<NewVendorRequest>;
  updateNewVendorRequest(id: string, request: Partial<NewVendorRequest>): Promise<NewVendorRequest | undefined>;

  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  createAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private requisitions: Map<string, Requisition> = new Map();
  private requisitionItems: Map<string, RequisitionItem> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private workflowSteps: Map<string, WorkflowStep> = new Map();
  private newVendorRequests: Map<string, NewVendorRequest> = new Map();
  private analytics: Map<string, Analytics> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const user1: User = {
      id: "user-1",
      username: "jsmith",
      password: "password",
      name: "John Smith",
      role: "Procurement Manager",
      department: "Procurement"
    };
    const user2: User = {
      id: "user-2",
      username: "sjohnson",
      password: "password",
      name: "Sarah Johnson",
      role: "Marketing Manager",
      department: "Marketing"
    };
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);

    // Seed vendors
    const vendor1: Vendor = {
      id: "vendor-1",
      name: "ACME Corporation",
      contactEmail: "contact@acme.com",
      businessType: "Corporation",
      taxId: "12-3456789",
      integrationType: "cxml",
      status: "active",
      totalSpendYtd: "45670.00",
      lastOrderDate: new Date("2024-01-15"),
      createdAt: new Date()
    };
    this.vendors.set(vendor1.id, vendor1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Vendor methods
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = { 
      ...insertVendor, 
      id, 
      createdAt: new Date(),
      contactEmail: insertVendor.contactEmail ?? null,
      businessType: insertVendor.businessType ?? null,
      taxId: insertVendor.taxId ?? null,
      integrationType: insertVendor.integrationType ?? "none",
      status: insertVendor.status ?? "pending",
      totalSpendYtd: insertVendor.totalSpendYtd ?? "0",
      lastOrderDate: insertVendor.lastOrderDate ?? null
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | undefined> {
    const existing = this.vendors.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...vendor };
    this.vendors.set(id, updated);
    return updated;
  }

  // Requisition methods
  async getRequisitions(): Promise<Requisition[]> {
    return Array.from(this.requisitions.values());
  }

  async getRequisition(id: string): Promise<Requisition | undefined> {
    return this.requisitions.get(id);
  }

  async getRequisitionsByUser(userId: string): Promise<Requisition[]> {
    return Array.from(this.requisitions.values()).filter(req => req.requestorId === userId);
  }

  async createRequisition(insertRequisition: InsertRequisition): Promise<Requisition> {
    const id = randomUUID();
    const requestId = `REQ-${Date.now()}`;
    const requisition: Requisition = { 
      ...insertRequisition,
      id, 
      requestId,
      status: insertRequisition.status ?? "pending",
      requestorId: insertRequisition.requestorId ?? null,
      budgetCode: insertRequisition.budgetCode ?? null,
      totalAmount: insertRequisition.totalAmount ?? null,
      businessJustification: insertRequisition.businessJustification ?? null,
      shippingAddress: insertRequisition.shippingAddress ?? null,
      isMultiVendor: insertRequisition.isMultiVendor ?? false,
      submittedAt: new Date(),
      approvedAt: null
    };
    this.requisitions.set(id, requisition);
    return requisition;
  }

  async updateRequisition(id: string, requisition: Partial<Requisition>): Promise<Requisition | undefined> {
    const existing = this.requisitions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...requisition };
    this.requisitions.set(id, updated);
    return updated;
  }

  // Requisition Items methods
  async getRequisitionItems(requisitionId: string): Promise<RequisitionItem[]> {
    return Array.from(this.requisitionItems.values()).filter(item => item.requisitionId === requisitionId);
  }

  async createRequisitionItem(insertItem: InsertRequisitionItem): Promise<RequisitionItem> {
    const id = randomUUID();
    const item: RequisitionItem = { 
      ...insertItem, 
      id,
      requisitionId: insertItem.requisitionId ?? null,
      vendorId: insertItem.vendorId ?? null,
      sku: insertItem.sku ?? null,
      quantity: insertItem.quantity ?? null,
      unitOfMeasure: insertItem.unitOfMeasure ?? null,
      unitPrice: insertItem.unitPrice ?? null,
      totalPrice: insertItem.totalPrice ?? null,
      isHazmat: insertItem.isHazmat ?? false,
      contractNumber: insertItem.contractNumber ?? null
    };
    this.requisitionItems.set(id, item);
    return item;
  }

  // Purchase Orders methods
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Array.from(this.purchaseOrders.values());
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined> {
    return this.purchaseOrders.get(id);
  }

  async createPurchaseOrder(insertPO: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const id = randomUUID();
    const poNumber = `PO-${Date.now()}`;
    const po: PurchaseOrder = { 
      ...insertPO, 
      id, 
      poNumber,
      status: insertPO.status ?? "pending",
      requisitionId: insertPO.requisitionId ?? null,
      vendorId: insertPO.vendorId ?? null,
      createdAt: new Date(),
      approvedAt: null,
      completedAt: null
    };
    this.purchaseOrders.set(id, po);
    return po;
  }

  async updatePurchaseOrder(id: string, po: Partial<PurchaseOrder>): Promise<PurchaseOrder | undefined> {
    const existing = this.purchaseOrders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...po };
    this.purchaseOrders.set(id, updated);
    return updated;
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoicesByPO(poId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.poId === poId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = { 
      ...insertInvoice, 
      id,
      status: insertInvoice.status ?? "pending",
      vendorId: insertInvoice.vendorId ?? null,
      poId: insertInvoice.poId ?? null,
      threeWayMatchStatus: insertInvoice.threeWayMatchStatus ?? "pending",
      receivedAt: new Date(),
      paidAt: null
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...invoice };
    this.invoices.set(id, updated);
    return updated;
  }

  // Workflow Steps methods
  async getWorkflowSteps(requisitionId: string): Promise<WorkflowStep[]> {
    return Array.from(this.workflowSteps.values()).filter(step => step.requisitionId === requisitionId);
  }

  async createWorkflowStep(insertStep: InsertWorkflowStep): Promise<WorkflowStep> {
    const id = randomUUID();
    const step: WorkflowStep = { 
      ...insertStep, 
      id, 
      status: insertStep.status ?? "pending",
      requisitionId: insertStep.requisitionId ?? null,
      assigneeId: insertStep.assigneeId ?? null,
      notes: insertStep.notes ?? null,
      completedAt: null 
    };
    this.workflowSteps.set(id, step);
    return step;
  }

  async updateWorkflowStep(id: string, step: Partial<WorkflowStep>): Promise<WorkflowStep | undefined> {
    const existing = this.workflowSteps.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...step };
    this.workflowSteps.set(id, updated);
    return updated;
  }

  // New Vendor Requests methods
  async getNewVendorRequests(): Promise<NewVendorRequest[]> {
    return Array.from(this.newVendorRequests.values());
  }

  async createNewVendorRequest(insertRequest: InsertNewVendorRequest): Promise<NewVendorRequest> {
    const id = randomUUID();
    const requestId = `VEN-${Date.now()}`;
    const request: NewVendorRequest = { 
      ...insertRequest, 
      id, 
      requestId,
      status: insertRequest.status ?? "pending",
      requestorId: insertRequest.requestorId ?? null,
      taxId: insertRequest.taxId ?? null,
      submittedAt: new Date(),
      reviewedAt: null
    };
    this.newVendorRequests.set(id, request);
    return request;
  }

  async updateNewVendorRequest(id: string, request: Partial<NewVendorRequest>): Promise<NewVendorRequest | undefined> {
    const existing = this.newVendorRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...request };
    this.newVendorRequests.set(id, updated);
    return updated;
  }

  // Analytics methods
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async createAnalyticsEntry(insertEntry: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const entry: Analytics = { 
      ...insertEntry, 
      id,
      value: insertEntry.value ?? null,
      metadata: insertEntry.metadata ?? null,
      createdAt: new Date() 
    };
    this.analytics.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();

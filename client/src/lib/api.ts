import { apiRequest } from "./queryClient";
import type { 
  Vendor, InsertVendor, Requisition, InsertRequisition,
  PurchaseOrder, Invoice, WorkflowStep, NewVendorRequest,
  InsertNewVendorRequest, RequisitionItem, InsertRequisitionItem
} from "@shared/schema";

export const api = {
  // Vendors
  vendors: {
    getAll: (): Promise<Vendor[]> => 
      apiRequest("GET", "/api/vendors").then(res => res.json()),
    
    create: (vendor: InsertVendor): Promise<Vendor> =>
      apiRequest("POST", "/api/vendors", vendor).then(res => res.json()),
  },

  // Requisitions
  requisitions: {
    getAll: (): Promise<Requisition[]> =>
      apiRequest("GET", "/api/requisitions").then(res => res.json()),
    
    create: (requisition: InsertRequisition): Promise<Requisition> =>
      apiRequest("POST", "/api/requisitions", requisition).then(res => res.json()),
    
    get: (id: string): Promise<Requisition> =>
      apiRequest("GET", `/api/requisitions/${id}`).then(res => res.json()),
    
    update: (id: string, data: Partial<Requisition>): Promise<Requisition> =>
      apiRequest("PATCH", `/api/requisitions/${id}`, data).then(res => res.json()),
    
    getItems: (id: string): Promise<RequisitionItem[]> =>
      apiRequest("GET", `/api/requisitions/${id}/items`).then(res => res.json()),
    
    getWorkflow: (id: string): Promise<WorkflowStep[]> =>
      apiRequest("GET", `/api/requisitions/${id}/workflow`).then(res => res.json()),
  },

  // Requisition Items
  requisitionItems: {
    create: (item: InsertRequisitionItem): Promise<RequisitionItem> =>
      apiRequest("POST", "/api/requisition-items", item).then(res => res.json()),
  },

  // Purchase Orders
  purchaseOrders: {
    getAll: (): Promise<PurchaseOrder[]> =>
      apiRequest("GET", "/api/purchase-orders").then(res => res.json()),
    
    update: (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> =>
      apiRequest("PATCH", `/api/purchase-orders/${id}`, data).then(res => res.json()),
  },

  // Invoices
  invoices: {
    getAll: (): Promise<Invoice[]> =>
      apiRequest("GET", "/api/invoices").then(res => res.json()),
    
    update: (id: string, data: Partial<Invoice>): Promise<Invoice> =>
      apiRequest("PATCH", `/api/invoices/${id}`, data).then(res => res.json()),
  },

  // New Vendor Requests
  newVendorRequests: {
    getAll: (): Promise<NewVendorRequest[]> =>
      apiRequest("GET", "/api/new-vendor-requests").then(res => res.json()),
    
    create: (request: InsertNewVendorRequest): Promise<NewVendorRequest> =>
      apiRequest("POST", "/api/new-vendor-requests", request).then(res => res.json()),
  },
};

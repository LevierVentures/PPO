import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRequisitionSchema, insertRequisitionItemSchema,
  insertPurchaseOrderSchema, insertInvoiceSchema,
  insertWorkflowStepSchema, insertNewVendorRequestSchema,
  insertVendorSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vendors
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  // Requisitions
  app.get("/api/requisitions", async (req, res) => {
    try {
      const requisitions = await storage.getRequisitions();
      res.json(requisitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requisitions" });
    }
  });

  app.post("/api/requisitions", async (req, res) => {
    try {
      const validatedData = insertRequisitionSchema.parse(req.body);
      const requisition = await storage.createRequisition(validatedData);
      res.status(201).json(requisition);
    } catch (error) {
      res.status(400).json({ message: "Invalid requisition data" });
    }
  });

  app.get("/api/requisitions/:id", async (req, res) => {
    try {
      const requisition = await storage.getRequisition(req.params.id);
      if (!requisition) {
        res.status(404).json({ message: "Requisition not found" });
        return;
      }
      res.json(requisition);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requisition" });
    }
  });

  app.patch("/api/requisitions/:id", async (req, res) => {
    try {
      const requisition = await storage.updateRequisition(req.params.id, req.body);
      if (!requisition) {
        res.status(404).json({ message: "Requisition not found" });
        return;
      }
      res.json(requisition);
    } catch (error) {
      res.status(500).json({ message: "Failed to update requisition" });
    }
  });

  // Requisition Items
  app.get("/api/requisitions/:id/items", async (req, res) => {
    try {
      const items = await storage.getRequisitionItems(req.params.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requisition items" });
    }
  });

  app.post("/api/requisition-items", async (req, res) => {
    try {
      const validatedData = insertRequisitionItemSchema.parse(req.body);
      const item = await storage.createRequisitionItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  // Purchase Orders
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const orders = await storage.getPurchaseOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase orders" });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const validatedData = insertPurchaseOrderSchema.parse(req.body);
      const order = await storage.createPurchaseOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase order data" });
    }
  });

  app.patch("/api/purchase-orders/:id", async (req, res) => {
    try {
      const order = await storage.updatePurchaseOrder(req.params.id, req.body);
      if (!order) {
        res.status(404).json({ message: "Purchase order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update purchase order" });
    }
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ message: "Invalid invoice data" });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.body);
      if (!invoice) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  // Workflow Steps
  app.get("/api/requisitions/:id/workflow", async (req, res) => {
    try {
      const steps = await storage.getWorkflowSteps(req.params.id);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflow steps" });
    }
  });

  app.post("/api/workflow-steps", async (req, res) => {
    try {
      const validatedData = insertWorkflowStepSchema.parse(req.body);
      const step = await storage.createWorkflowStep(validatedData);
      res.status(201).json(step);
    } catch (error) {
      res.status(400).json({ message: "Invalid workflow step data" });
    }
  });

  // New Vendor Requests
  app.get("/api/new-vendor-requests", async (req, res) => {
    try {
      const requests = await storage.getNewVendorRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new vendor requests" });
    }
  });

  app.post("/api/new-vendor-requests", async (req, res) => {
    try {
      const validatedData = insertNewVendorRequestSchema.parse(req.body);
      const request = await storage.createNewVendorRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid new vendor request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

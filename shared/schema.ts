import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
});

export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactEmail: text("contact_email"),
  businessType: text("business_type"),
  taxId: text("tax_id"),
  integrationType: text("integration_type").notNull().default("none"), // cxml, oci, hosted, none
  status: text("status").notNull().default("pending"), // active, pending, inactive
  totalSpendYtd: decimal("total_spend_ytd", { precision: 12, scale: 2 }).default("0"),
  lastOrderDate: timestamp("last_order_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const requisitions = pgTable("requisitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: text("request_id").notNull().unique(),
  requestType: text("request_type").notNull(), // goods, services, mixed, new-vendor
  requestorId: varchar("requestor_id").references(() => users.id),
  department: text("department").notNull(),
  budgetCode: text("budget_code"),
  generalLedgerCode: text("general_ledger_code").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, in-progress
  businessJustification: text("business_justification"),
  shippingAddress: text("shipping_address"),
  isMultiVendor: boolean("is_multi_vendor").default(false),
  attachments: text("attachments").array(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const requisitionItems = pgTable("requisition_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requisitionId: varchar("requisition_id").references(() => requisitions.id),
  vendorId: varchar("vendor_id").references(() => vendors.id),
  itemType: text("item_type").notNull(), // good, service, capex
  sku: text("sku"),
  description: text("description").notNull(),
  quantity: integer("quantity"),
  unitOfMeasure: text("unit_of_measure"),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }),
  generalLedgerCode: text("general_ledger_code").notNull(),
  isHazmat: boolean("is_hazmat").default(false),
  contractNumber: text("contract_number"),
});

export const purchaseOrders = pgTable("purchase_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poNumber: text("po_number").notNull().unique(),
  requisitionId: varchar("requisition_id").references(() => requisitions.id),
  vendorId: varchar("vendor_id").references(() => vendors.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  isBlanketPO: boolean("is_blanket_po").default(false),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  contractNumber: text("contract_number"),
  agreementDate: timestamp("agreement_date"),
  attachments: text("attachments").array(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, in-progress, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  completedAt: timestamp("completed_at"),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  poId: varchar("po_id").references(() => purchaseOrders.id),
  vendorId: varchar("vendor_id").references(() => vendors.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, paid, on-hold
  threeWayMatchStatus: text("three_way_match_status").notNull().default("pending"), // pending, matched, exception
  receivedAt: timestamp("received_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requisitionId: varchar("requisition_id").references(() => requisitions.id),
  stepName: text("step_name").notNull(),
  assigneeId: varchar("assignee_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, completed, rejected
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

export const newVendorRequests = pgTable("new_vendor_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: text("request_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  businessType: text("business_type").notNull(),
  taxId: text("tax_id"),
  justification: text("justification").notNull(),
  requestorId: varchar("requestor_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: text("metric").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true, createdAt: true });
export const insertRequisitionSchema = createInsertSchema(requisitions).omit({ id: true, submittedAt: true, approvedAt: true });
export const insertRequisitionItemSchema = createInsertSchema(requisitionItems).omit({ id: true });
export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({ id: true, createdAt: true, approvedAt: true, completedAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, receivedAt: true, paidAt: true });
export const insertWorkflowStepSchema = createInsertSchema(workflowSteps).omit({ id: true, completedAt: true });
export const insertNewVendorRequestSchema = createInsertSchema(newVendorRequests).omit({ id: true, submittedAt: true, reviewedAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Requisition = typeof requisitions.$inferSelect;
export type InsertRequisition = z.infer<typeof insertRequisitionSchema>;
export type RequisitionItem = typeof requisitionItems.$inferSelect;
export type InsertRequisitionItem = z.infer<typeof insertRequisitionItemSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = z.infer<typeof insertWorkflowStepSchema>;
export type NewVendorRequest = typeof newVendorRequests.$inferSelect;
export type InsertNewVendorRequest = z.infer<typeof insertNewVendorRequestSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

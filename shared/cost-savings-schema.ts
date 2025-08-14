import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cost Savings Tracking Table
export const costSavings = pgTable("cost_savings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requisitionId: varchar("requisition_id"), // Links to requisition
  itemId: varchar("item_id"), // Links to requisition item
  savingsType: text("savings_type").notNull(), // direct, opportunistic
  
  // Direct Savings (from requisition discounts)
  originalAmount: decimal("original_amount", { precision: 12, scale: 2 }),
  discountedAmount: decimal("discounted_amount", { precision: 12, scale: 2 }),
  savingsAmount: decimal("savings_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Opportunistic Savings (AI-identified consolidation opportunities)
  consolidationType: text("consolidation_type"), // volume_consolidation, vendor_consolidation, contract_leverage
  productCategory: text("product_category"),
  similarItems: jsonb("similar_items"), // Array of similar items that could be consolidated
  potentialSavingsAmount: decimal("potential_savings_amount", { precision: 12, scale: 2 }),
  
  // Tracking metadata
  identifiedDate: timestamp("identified_date").defaultNow(),
  actualizedDate: timestamp("actualized_date"), // When savings was actually realized
  status: text("status").notNull().default("identified"), // identified, in_progress, actualized, missed
  
  // AI Analysis Data
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 3, scale: 2 }), // 0.00 to 1.00
  analysisData: jsonb("analysis_data"), // Detailed AI analysis results
  
  // User validation
  userValidated: boolean("user_validated").default(false),
  validatedBy: varchar("validated_by"),
  validatedAt: timestamp("validated_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Consolidation Opportunities Table (AI-generated)
export const consolidationOpportunities = pgTable("consolidation_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  opportunityType: text("opportunity_type").notNull(), // volume_discount, vendor_consolidation, contract_renewal
  
  // Product/Service Analysis
  productCodes: text("product_codes").array(), // Similar product codes/SKUs
  descriptions: text("descriptions").array(), // Product descriptions for similarity analysis
  categoryName: text("category_name"),
  
  // Financial Impact
  currentSpend: decimal("current_spend", { precision: 12, scale: 2 }).notNull(),
  potentialSavings: decimal("potential_savings", { precision: 12, scale: 2 }).notNull(),
  savingsPercentage: decimal("savings_percentage", { precision: 5, scale: 2 }),
  
  // Consolidation Details
  currentVendors: text("current_vendors").array(),
  recommendedVendor: text("recommended_vendor"),
  minimumVolume: integer("minimum_volume"),
  contractTerms: text("contract_terms"),
  
  // AI Analysis
  aiConfidence: decimal("ai_confidence", { precision: 3, scale: 2 }),
  analysisMethod: text("analysis_method"), // text_similarity, category_matching, spend_analysis
  dataPoints: integer("data_points"), // Number of data points used in analysis
  
  // Implementation
  implementationEffort: text("implementation_effort"), // low, medium, high
  timeframe: text("timeframe"), // immediate, short_term, long_term
  status: text("status").notNull().default("identified"), // identified, under_review, approved, implemented, rejected
  
  // Tracking
  identifiedAt: timestamp("identified_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  implementedAt: timestamp("implemented_at"),
  assignedTo: varchar("assigned_to"),
});

// Cost Savings Summary View (for dashboard)
export const savingsSummary = pgTable("savings_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: text("period").notNull(), // month, quarter, year
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Direct Savings (captured from requisitions)
  directSavings: decimal("direct_savings", { precision: 12, scale: 2 }).default("0"),
  directSavingsCount: integer("direct_savings_count").default(0),
  
  // Opportunistic Savings (AI-identified and actualized)
  opportunisticSavings: decimal("opportunistic_savings", { precision: 12, scale: 2 }).default("0"),
  opportunisticCount: integer("opportunistic_count").default(0),
  
  // Potential Savings (identified but not yet actualized)
  potentialSavings: decimal("potential_savings", { precision: 12, scale: 2 }).default("0"),
  potentialCount: integer("potential_count").default(0),
  
  // Performance Metrics
  totalSpend: decimal("total_spend", { precision: 12, scale: 2 }).notNull(),
  savingsRate: decimal("savings_rate", { precision: 5, scale: 2 }), // (total_savings / total_spend) * 100
  
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Zod schemas for validation
export const insertCostSavingsSchema = createInsertSchema(costSavings);
export const insertConsolidationOpportunitySchema = createInsertSchema(consolidationOpportunities);
export const insertSavingsSummarySchema = createInsertSchema(savingsSummary);

export type CostSavings = typeof costSavings.$inferSelect;
export type InsertCostSavings = z.infer<typeof insertCostSavingsSchema>;
export type ConsolidationOpportunity = typeof consolidationOpportunities.$inferSelect;
export type InsertConsolidationOpportunity = z.infer<typeof insertConsolidationOpportunitySchema>;
export type SavingsSummary = typeof savingsSummary.$inferSelect;
export type InsertSavingsSummary = z.infer<typeof insertSavingsSummarySchema>;
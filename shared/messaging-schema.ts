import { pgTable, text, timestamp, boolean, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Message threads for RFP communications and internal messaging
export const messageThreads = pgTable("message_threads", {
  id: varchar("id").primaryKey(),
  subject: text("subject").notNull(),
  participants: json("participants").$type<string[]>().notNull(),
  type: varchar("type", { enum: ["rfp", "internal", "vendor", "system"] }).notNull(),
  relatedEntity: varchar("related_entity"), // RFP ID, Contract ID, etc.
  entityType: varchar("entity_type", { enum: ["rfp", "po", "contract", "requisition"] }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isArchived: boolean("is_archived").default(false),
});

// Individual messages within threads
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey(),
  threadId: varchar("thread_id").notNull().references(() => messageThreads.id),
  fromEmail: varchar("from_email").notNull(),
  toEmail: varchar("to_email").notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { enum: ["rfp", "internal", "vendor", "system"] }).notNull(),
  status: varchar("status", { enum: ["sent", "delivered", "read", "replied"] }).default("sent"),
  attachments: json("attachments").$type<string[]>(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// Message thread participants for easier querying
export const threadParticipants = pgTable("thread_participants", {
  id: varchar("id").primaryKey(),
  threadId: varchar("thread_id").notNull().references(() => messageThreads.id),
  participantEmail: varchar("participant_email").notNull(),
  role: varchar("role", { enum: ["sender", "recipient", "cc", "bcc"] }).default("recipient"),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastReadAt: timestamp("last_read_at"),
  isActive: boolean("is_active").default(true),
});

// Zod schemas for validation
export const insertMessageThreadSchema = createInsertSchema(messageThreads);
export const insertMessageSchema = createInsertSchema(messages);
export const insertThreadParticipantSchema = createInsertSchema(threadParticipants);

// TypeScript types
export type MessageThread = typeof messageThreads.$inferSelect;
export type InsertMessageThread = z.infer<typeof insertMessageThreadSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type ThreadParticipant = typeof threadParticipants.$inferSelect;
export type InsertThreadParticipant = z.infer<typeof insertThreadParticipantSchema>;
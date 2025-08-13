# PPO System - Unified Procure-to-Pay Platform

## Overview

A comprehensive full-stack web application that provides a unified Procure-to-Pay (P2P) procurement system for professional procurement organizations. The system handles the complete procurement workflow from request intake through purchase order management to invoice processing, with AI-assisted chat functionality and analytics capabilities.

The application supports role-based dashboards, multi-vendor requisitions, vendor integrations (cXML, OCI, hosted catalogs), workflow approvals, and provides analytics with anomaly detection. It's designed to streamline procurement operations while maintaining compliance and providing actionable insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- React 18 with TypeScript for type-safe component development
- Vite for fast development builds and hot module replacement
- shadcn/ui component library built on Radix UI primitives for accessibility
- Tailwind CSS with custom design tokens for consistent styling
- Wouter for lightweight client-side routing
- React Hook Form with Zod validation for robust form handling
- TanStack Query for server state management and data fetching

**Backend Architecture**
- Express.js server with TypeScript for API endpoints
- RESTful API design with standard HTTP methods
- Modular route structure separating concerns (vendors, requisitions, purchase orders, invoices)
- Custom storage interface abstraction for flexible data layer implementation
- Middleware for request logging, error handling, and JSON parsing

**Database Design**
- PostgreSQL with Drizzle ORM for type-safe database operations
- Schema-first approach with Zod validation integration
- Comprehensive data model covering users, vendors, requisitions, purchase orders, invoices, and workflow steps
- Support for multi-vendor requisitions and complex approval workflows
- Audit trails with timestamp tracking

**Authentication & Authorization**
- Role-based access control system (Manager, Department Director, Finance, Legal, Procurement)
- User context management through React Context API
- Session-based authentication preparation (connect-pg-simple integration)

**State Management**
- Global app state using React Context for user information and UI state
- Server state managed by TanStack Query with optimistic updates
- Local form state handled by React Hook Form
- Error boundary implementation for graceful error handling

**External Integrations**
- Vendor catalog integrations supporting cXML, OCI, and hosted catalog protocols
- Neon Database serverless PostgreSQL for cloud-native data storage
- AI chat interface for procurement assistance and workflow navigation

**Development Tooling**
- TypeScript for comprehensive type checking
- ESBuild for production bundling
- Drizzle Kit for database migrations and schema management
- Replit-specific development enhancements and error overlays

## External Dependencies

**Database Services**
- Neon Database (serverless PostgreSQL)
- Drizzle ORM with PostgreSQL dialect
- connect-pg-simple for session storage

**UI & Styling**
- shadcn/ui component system
- Radix UI primitives for accessibility
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

**Development & Build Tools**
- Vite with React plugin
- TypeScript compiler
- ESBuild for production bundling
- PostCSS with Autoprefixer

**Form & Validation**
- React Hook Form for form state management
- Zod for schema validation
- Hookform resolvers for integration

**State Management & Data Fetching**
- TanStack React Query for server state
- React Context API for global state

**Third-party Integrations**
- Vendor catalog systems (cXML, OCI, hosted catalogs)
- AI chat capabilities for procurement assistance
- Date manipulation with date-fns
- Embla Carousel for UI components

**Utility Libraries**
- clsx and tailwind-merge for conditional styling
- class-variance-authority for component variants
- nanoid for unique ID generation
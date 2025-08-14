# PPO System - Unified Procure-to-Pay Platform

## Overview

A comprehensive full-stack web application that provides a unified Procure-to-Pay (P2P) procurement system for professional procurement organizations. The system handles the complete procurement workflow from requisition intake through approval workflows to purchase order management and invoice processing, with AI-assisted chat functionality and analytics capabilities.

The application follows standard P2P workflow: Purchase Requisition → Approval Workflow → PO (fully approved) → Sent to vendor for processing. It supports role-based dashboards, multi-vendor requisitions, vendor integrations (cXML, OCI, hosted catalogs), Blanket POs for recurring purchases, contract management through PO fields, and provides analytics with realistic anomaly detection. Budget management is handled by external ERP systems, not within the P2P system.

## Recent Changes (August 2025)

✅ **Renamed "Procurement Request" to "Purchase Requisition"** throughout the application
✅ **Moved General Ledger Codes from requisition level to line items** with dropdown options for non-finance users  
✅ **Replaced Agreement Summary with risk-based Contracts page** showing expired, critical (≤30 days), upcoming (≤90 days), and active contracts
✅ **Added comprehensive dummy data** for approvals queue, purchase orders, and invoices with realistic workflows
✅ **Enhanced Purchase Orders page** with search functionality by vendor, PO#, product number and customizable columns
✅ **Created Invoice History page** with preview capabilities and detailed line item views with GL codes
✅ **Improved Approvals page** with priority-based tabs and comprehensive approval workflow data
✅ **Added User Profile page** with image upload, contact information management, and account settings
✅ **Created Administration module** for user management, role assignment, workflow customization, and system settings
✅ **Enhanced Header navigation** with user profile dropdown and role-based administration access
✅ **Fixed all UI issues** including Purchase Order date approved column, contract search functionality, approval table formatting consistency, and invoice search capabilities
✅ **Streamlined navigation** by removing duplicate invoice tabs and improving interface consistency
✅ **Updated terminology** from "Purchase Requisition" to "Requisition" for simplified navigation
✅ **Integrated Change Order into Requisition module** with dynamic fields based on request type (New Purchase/Change Order/Blanket PO)
✅ **Unified Contracts module** showing all contracts with comprehensive visibility, sorting, and professional interface
✅ **Professional Approvals Queue** with detailed review capabilities, performance metrics, and streamlined workflow
✅ **AI-First Modern Dashboard** with top-positioned quick actions, balanced two-column layout, enhanced neural assistant, and 2030-ready design patterns
✅ **Enhanced Dashboard with Real Metrics** - Display actual numbers for pending approvals (2), contracts expiring within 90 days (2), and total active contracts (23)
✅ **Comprehensive Vendor Onboarding Form** - Complete new vendor request form with W9 upload, EIN, banking details, contact information, address, and supporting documents
✅ **Contract-PO Integration with Change Orders** - Added PO# column to contracts table with direct navigation to PO details and change order capability for expiring contracts
✅ **Database Schema Enhancement** - Updated vendor and new vendor request tables with comprehensive fields for banking, compliance, and document management
✅ **Data-Driven Cost Savings Module** - Complete redesign with direct discount capture fields on requisitions and AI-powered consolidation analysis based on product similarity
✅ **Role-Based Data Filtering System** - End users see department-specific data while SMEs like procurement view organization-wide activities with visual indicators

## Key Features Implemented

- **Line-item GL Codes**: Each requisition line item requires a GL code selection from predefined dropdown options
- **Contract Risk Management**: Proactive contract expiration tracking with color-coded risk tiers
- **Advanced Search & Filtering**: Vendor, PO number, product number search across all tables
- **Invoice Preview**: Detailed invoice preview with line items, GL codes, and attachment management
- **Complete Approval Workflow**: Priority-based approval queues with pending POs, requisitions, and invoices
- **User Profile Management**: Full profile editing with image upload, contact info, and role-based settings
- **Administration Panel**: Comprehensive user management, role assignment, workflow customization, and system configuration
- **Enhanced Navigation**: User-centric header with profile access and role-based administration features
- **Unified Requisition System**: Integrated New Purchase, Change Order, and Blanket PO functionality with dynamic fields
- **Professional Contract Management**: Complete contract visibility with advanced filtering, sorting, and risk assessment
- **Enhanced Approval Queue**: Professional workflow with detailed review capabilities and performance dashboards
- **Intelligent Dashboard**: Action-oriented design with integrated chat assistant for workflow navigation
- **Modernized UI**: Improved table formatting, consistent search functionality, and streamlined interface design
- **Data-Driven Dashboard Metrics**: Real-time display of specific numbers including 2 pending approvals ($47,500 total), 2 contracts expiring under 90 days, and 23 total active contracts
- **Comprehensive Vendor Onboarding**: Full vendor request form with W9 tax form upload, EIN/Tax ID capture, complete banking details (account, routing), full address information, contact details, and supporting document uploads
- **Contract-PO Integration**: Purchase Order column in contracts table with clickable PO numbers for direct navigation and change order buttons for contracts expiring within 30 days
- **Enhanced Database Schema**: Expanded vendor and request tables with banking, compliance, and document management fields
- **Data-Driven Cost Savings**: Comprehensive cost tracking with direct discount fields on requisitions (original price, discount amount, discount percentage) and AI-powered consolidation opportunities based on product codes and descriptions
- **AI-Powered Savings Analysis**: Machine learning system that identifies consolidation potential through vendor analysis, volume discounts, and contract renewals with confidence scoring and implementation effort assessment

## User Preferences

Preferred communication style: Simple, everyday language.
Dashboard design preference: Professional, visually rich interfaces over simplified layouts. Prefers sophisticated design with visual depth and modern aesthetics rather than sterile, minimal approaches. Wants efficient use of dashboard space - avoid redundant sections and minimize oversized components that don't add value.

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
# PPO System - Unified Procure-to-Pay Platform

A comprehensive full-stack web application that provides a unified Procure-to-Pay (P2P) procurement system for professional procurement organizations. The system handles the complete procurement workflow from requisition intake through approval workflows to purchase order management and invoice processing, with AI-assisted chat functionality and analytics capabilities.

Demo Link: https://689e8a8c391bf504649960e7--stalwart-dieffenbachia-16561b.netlify.app/

## Key Features![Uploading Screenshot 2025-08-14 at 6.42.59 PM.png…]()


![Uploading Screenshot 2025-08-14 at 6.43.17 PM.png…]()



### Core P2P Workflow
- **Purchase Requisitions**: New Purchase, Change Orders, and Blanket PO management
- **Approval Workflows**: Priority-based approval queues with role-based access
- **Purchase Orders**: Comprehensive PO management with vendor integration
- **Invoice Processing**: Complete invoice history with preview capabilities
- **Contract Management**: Risk-based contract tracking with expiration monitoring

### Advanced Capabilities
- **Cost Savings Tracking**: Data-driven cost optimization with AI-powered consolidation analysis
- **Vendor Management**: Complete vendor onboarding with W9 upload and banking details
- **Analytics & Reporting**: Real-time metrics and procurement insights
- **RFP Management**: Request for Proposal workflow integration
- **Messaging System**: Comprehensive communication platform

### Modern UI/UX
- **Google-Style Dashboard**: Clean, professional interface with intelligent search
- **Futuristic Design Language**: 2030-ready aesthetics with Apple-inspired navigation
- **Professional Color Harmony**: Blue-violet-emerald-red-amber theme (60-30-10 design)
- **Role-Based Access Control**: Tailored experiences for different user roles

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and builds
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** with custom design tokens
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **RESTful API** architecture
- **Role-based authentication** system

### Development Tools
- **TypeScript** for comprehensive type checking
- **Drizzle Kit** for database migrations
- **ESBuild** for production bundling

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LevierVentures/PPO.git
cd PPO
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Configure your database and other environment variables
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility libraries
├── server/                 # Backend Express application
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # Data access layer
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json
```

## Core Modules

### 1. Purchase Requisitions
- **New Purchase**: Standard procurement requests
- **Change Orders**: Modifications to existing orders
- **Blanket POs**: Recurring purchase agreements with product management

### 2. Approval Workflows
- Priority-based approval queues
- Role-specific approval capabilities
- Performance metrics and dashboards

### 3. Contract Management
- Risk-based contract tracking
- Expiration monitoring (Critical ≤30 days, Upcoming ≤90 days)
- Contract-PO integration with change order capabilities

### 4. Cost Savings
- Direct discount capture on requisitions
- AI-powered consolidation analysis
- Volume discount identification
- Contract renewal optimization

### 5. Analytics & Reporting
- Real-time procurement metrics
- Cost savings tracking
- Vendor performance analytics
- Department-specific insights

## Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ppo_db
NODE_ENV=development
PORT=5000
```

### Database Setup

The application uses Drizzle ORM with PostgreSQL. Schema is defined in `shared/schema.ts`.

To push schema changes:
```bash
npm run db:push
```

## 👥 User Roles

- **Manager**: Department-level access and approvals
- **Department Director**: Cross-department visibility and approvals
- **Finance**: Financial oversight and budget management
- **Legal**: Contract review and compliance
- **Procurement**: Organization-wide procurement management

## Design System

The application uses a professional color harmony system:
- **Blue** (60%): Trust and stability - primary navigation and data
- **Violet** (30%): Innovation and premium features 
- **Emerald** (10%): Growth and financial success
- **Red**: Priority actions and alerts
- **Amber**: Value optimization and warnings

## 🚀 Deployment

The application is designed for modern cloud deployment:

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, AWS, etc.)

##  API Documentation

### Key Endpoints

- `GET /api/vendors` - Retrieve vendor list
- `POST /api/requisitions` - Create new requisition
- `GET /api/purchase-orders` - Retrieve purchase orders
- `GET /api/contracts` - Retrieve contracts
- `POST /api/approvals` - Process approvals

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

##  License

This project is proprietary software owned by Levier Ventures.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ by the Levier Ventures team

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import { FuturisticBottomDock } from "@/components/layout/bottom-dock-futuristic";

import ChatDock from "@/components/ai-chat/chat-dock";
import ErrorOverlay from "@/components/common/error-overlay";
import Dashboard from "./pages/dashboard-google-style";
import RequisitionUnified from "./pages/requisition-unified";
import ApprovalsQueue from "./pages/approvals-professional";
import ContractsUnified from "./pages/contracts-unified";
import PurchaseOrders from "./pages/purchase-orders";
import POSummary from "./pages/po-summary";
import UserReview from "./pages/user-review";
import Vendors from "./pages/vendors";
import NewVendorRequest from "./pages/new-vendor-request";
import Invoices from "./pages/invoices";
import InvoiceHistory from "./pages/invoice-history";
import Analytics from "./pages/analytics";
import UserProfileRBAC from "./pages/user-profile-rbac";
import Administration from "./pages/admin";
import MyRequests from "./pages/my-requests";
import RFPManagement from "./pages/rfp-management";
import CostSavingsDataDriven from "./pages/cost-savings-data-driven";
import MessagingSystem from "./pages/messaging-comprehensive";

import { AppStateProvider } from "@/hooks/use-app-state";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/requisitions" component={RequisitionUnified} />
      <Route path="/approvals" component={ApprovalsQueue} />
      <Route path="/contracts" component={ContractsUnified} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/po-summary" component={POSummary} />
      <Route path="/user-review" component={UserReview} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/new-vendor-request" component={NewVendorRequest} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/invoice-history" component={InvoiceHistory} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/user-profile" component={UserProfileRBAC} />
      <Route path="/administration" component={Administration} />
      <Route path="/my-requests" component={MyRequests} />
      <Route path="/rfp" component={RFPManagement} />
      <Route path="/cost-savings" component={CostSavingsDataDriven} />
      <Route path="/messages" component={MessagingSystem} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <ErrorOverlay />
            <Header />
            <main className="pb-20 p-6"> {/* Add bottom padding for dock */}
              <div className="container mx-auto">
                <Router />
              </div>
            </main>
            <FuturisticBottomDock />
            <ChatDock />
            <Toaster />
          </div>
        </TooltipProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import ChatDock from "@/components/ai-chat/chat-dock";
import ErrorOverlay from "@/components/common/error-overlay";
import Dashboard from "./pages/dashboard-modernized";
import RequestIntake from "./pages/request-intake";
import Approvals from "./pages/approvals";
import ContractsRedesigned from "./pages/contracts-redesigned";
import PurchaseOrders from "./pages/purchase-orders";
import POSummary from "./pages/po-summary";
import UserReview from "./pages/user-review";
import Vendors from "./pages/vendors";
import Invoices from "./pages/invoices";
import InvoiceHistory from "./pages/invoice-history";
import Analytics from "./pages/analytics";
import UserProfile from "./pages/user-profile";
import Administration from "./pages/admin";
import ChangeOrder from "./pages/change-order";
import { AppStateProvider } from "@/hooks/use-app-state";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/request" component={RequestIntake} />
      <Route path="/change-order" component={ChangeOrder} />
      <Route path="/approvals" component={Approvals} />
      <Route path="/contracts" component={ContractsRedesigned} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/po-summary" component={POSummary} />
      <Route path="/user-review" component={UserReview} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/invoice-history" component={InvoiceHistory} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/user-profile" component={UserProfile} />
      <Route path="/admin" component={Administration} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <TooltipProvider>
          <div className="safe-boot">
            <ErrorOverlay />
            <Header />
            <Navigation />
            <main className="flex-1 p-6">
              <div className="container mx-auto">
                <Router />
              </div>
            </main>
            <ChatDock />
            <Toaster />
          </div>
        </TooltipProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;

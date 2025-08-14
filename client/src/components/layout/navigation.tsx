import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  CheckCircle, 
  FileText, 
  Handshake, 
  History, 
  Layout, 
  PlusCircle, 
  Receipt,
  Archive,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Layout },
  { path: "/request", label: "Requisition", icon: PlusCircle },
  { path: "/approvals", label: "Approvals", icon: CheckCircle },
  { path: "/contracts", label: "Contracts", icon: FileText },
  { path: "/purchase-orders", label: "Purchase Orders", icon: History },
  { path: "/rfp", label: "RFP", icon: FileText },
  { path: "/vendors", label: "Vendors", icon: Handshake },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { path: "/invoice-history", label: "Invoices", icon: Receipt },
  { path: "/cost-savings", label: "Cost Savings", icon: BarChart3 },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-3 transition-colors",
                location === path
                  ? "border-primary text-primary bg-accent"
                  : "border-transparent hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  ShoppingCart, 
  Receipt, 
  TrendingUp,
  Settings,
  FileCheck,
  Send,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DockItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
  color: string;
}

const dockItems: DockItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', color: 'bg-blue-500' },
  { icon: FileText, label: 'Requisitions', href: '/requisitions', color: 'bg-green-500' },
  { icon: CheckSquare, label: 'Approvals', href: '/approvals', color: 'bg-orange-500', badge: 2 },
  { icon: FileCheck, label: 'Contracts', href: '/contracts', color: 'bg-purple-500' },
  { icon: ShoppingCart, label: 'Orders', href: '/purchase-orders', color: 'bg-indigo-500' },
  { icon: Send, label: 'RFP', href: '/rfp', color: 'bg-pink-500' },
  { icon: Users, label: 'Vendors', href: '/vendors', color: 'bg-cyan-500' },
  { icon: Receipt, label: 'Invoices', href: '/invoices', color: 'bg-teal-500' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', color: 'bg-red-500' },
  { icon: TrendingUp, label: 'Savings', href: '/cost-savings', color: 'bg-emerald-500' },
  { icon: Settings, label: 'Admin', href: '/administration', color: 'bg-gray-500' }
];

export function BottomDock() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-border/50"></div>
      
      {/* Dock container */}
      <div className="relative px-4 py-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 p-2 bg-white/90 dark:bg-black/90 rounded-2xl shadow-2xl border border-border/20 backdrop-blur-xl overflow-x-auto scrollbar-hide max-w-[95vw]">
            {dockItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "group relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 cursor-pointer min-w-[64px] flex-shrink-0",
                    "hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:scale-105",
                    isActive && "bg-gray-100 dark:bg-gray-800 shadow-lg"
                  )}>
                    {/* Icon container with dynamic background */}
                    <div className={cn(
                      "relative w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-300",
                      isActive ? item.color : "bg-gray-200 dark:bg-gray-700",
                      "group-hover:scale-110 group-hover:shadow-lg"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-colors duration-300",
                        isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
                      )} />
                      
                      {/* Badge for notifications */}
                      {item.badge && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] bg-red-500 text-white border-white dark:border-black">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      "text-[9px] font-medium transition-colors duration-300 text-center leading-tight px-1",
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
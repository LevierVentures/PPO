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
  BarChart3,
  Zap,
  Target
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
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', color: 'from-blue-500 to-cyan-500' },
  { icon: FileText, label: 'Requisitions', href: '/requisitions', color: 'from-green-500 to-emerald-500' },
  { icon: CheckSquare, label: 'Approvals', href: '/approvals', color: 'from-orange-500 to-red-500', badge: 2 },
  { icon: FileCheck, label: 'Contracts', href: '/contracts', color: 'from-purple-500 to-pink-500' },
  { icon: ShoppingCart, label: 'Orders', href: '/purchase-orders', color: 'from-indigo-500 to-blue-500' },
  { icon: Send, label: 'RFP', href: '/rfp', color: 'from-pink-500 to-rose-500' },
  { icon: Users, label: 'Vendors', href: '/vendors', color: 'from-cyan-500 to-teal-500' },
  { icon: Receipt, label: 'Invoices', href: '/invoices', color: 'from-teal-500 to-green-500' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', color: 'from-red-500 to-orange-500' },
  { icon: Target, label: 'Savings', href: '/cost-savings', color: 'from-emerald-500 to-green-500' },
  { icon: Settings, label: 'Admin', href: '/administration', color: 'from-gray-500 to-slate-500' }
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
          <div className="flex items-center gap-2 p-3 bg-white/80 dark:bg-black/80 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl overflow-x-auto scrollbar-hide max-w-[95vw]">
            {dockItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "group relative flex flex-col items-center p-3 rounded-2xl transition-all duration-500 cursor-pointer min-w-[68px] flex-shrink-0",
                    "hover:bg-white/60 dark:hover:bg-white/10 hover:scale-110 hover:shadow-xl",
                    isActive && "bg-white/60 dark:bg-white/10 shadow-xl scale-105 backdrop-blur-sm"
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
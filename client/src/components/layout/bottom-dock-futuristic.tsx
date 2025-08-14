import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
  Target
} from 'lucide-react';

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

export function FuturisticBottomDock() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Enhanced backdrop with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent dark:from-black/95 dark:via-black/80 dark:to-transparent backdrop-blur-2xl"></div>
      
      {/* Futuristic dock container */}
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 p-2 bg-white/60 dark:bg-black/60 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-3xl overflow-x-auto scrollbar-hide max-w-[95vw] relative">
            {/* Ambient glow behind dock */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50"></div>
            
            {dockItems.map((item, index) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "group relative flex flex-col items-center p-2 rounded-2xl transition-all duration-700 cursor-pointer min-w-[58px] flex-shrink-0",
                    "hover:bg-white/40 dark:hover:bg-white/10 hover:scale-125 hover:shadow-2xl hover:-translate-y-2",
                    isActive && "bg-white/40 dark:bg-white/10 shadow-2xl scale-110 -translate-y-1"
                  )}>
                    
                    {/* Futuristic Icon with advanced styling */}
                    <div className={cn(
                      "relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 mb-1 shadow-lg group-hover:shadow-2xl",
                      `bg-gradient-to-br ${item.color}`,
                      "group-hover:scale-125 group-hover:rotate-12",
                      isActive && "scale-110 rotate-6"
                    )}>
                      <Icon className="h-5 w-5 text-white drop-shadow-lg" />
                      
                      {/* Animated Badge */}
                      {item.badge && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-2xl border border-white animate-pulse">
                          {item.badge}
                        </div>
                      )}
                      
                      {/* Dynamic glow effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl transition-opacity duration-700 blur-lg",
                        `bg-gradient-to-br ${item.color}`,
                        "opacity-0 group-hover:opacity-30",
                        isActive && "opacity-20"
                      )}></div>
                      
                      {/* Active state inner glow */}
                      {isActive && (
                        <div className={cn(
                          "absolute inset-1 rounded-xl animate-pulse",
                          `bg-gradient-to-br ${item.color} opacity-20`
                        )}></div>
                      )}
                    </div>
                    
                    {/* Futuristic Label */}
                    <span className={cn(
                      "text-[8px] font-semibold transition-all duration-700 text-center leading-tight px-1 tracking-wide uppercase",
                      isActive 
                        ? "text-gray-900 dark:text-white font-bold" 
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Advanced active indicator */}
                    {isActive && (
                      <>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/10 animate-pulse"></div>
                      </>
                    )}
                    
                    {/* Hover ripple effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
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
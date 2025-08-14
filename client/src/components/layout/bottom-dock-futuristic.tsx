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
          <div className="flex items-center gap-2 p-4 bg-white/70 dark:bg-black/70 rounded-[2rem] shadow-2xl border border-white/40 backdrop-blur-3xl overflow-x-auto scrollbar-hide max-w-[95vw] relative">
            {/* Premium multi-layer dock background */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-2xl"></div>
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/20 to-transparent"></div>
            <div className="absolute inset-0.5 rounded-[2rem] shadow-inner bg-gradient-to-b from-transparent to-black/5"></div>
            
            {dockItems.map((item, index) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "group relative flex flex-col items-center p-3 rounded-3xl transition-all duration-1000 cursor-pointer min-w-[72px] flex-shrink-0 transform-gpu",
                    "hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-2xl",
                    isActive && "bg-white/30 dark:bg-white/10 shadow-2xl"
                  )}>
                    
                    {/* Ultra-Premium 2030 Icon - Beyond Apple Quality */}
                    <div className={cn(
                      "relative w-12 h-12 rounded-3xl transition-all duration-1000 mb-1 group-hover:scale-150 group-hover:-translate-y-3",
                      "group-hover:rotate-12 transform-gpu perspective-1000",
                      isActive && "scale-125 -translate-y-1 rotate-6"
                    )}>
                      
                      {/* Multi-layer depth background - Apple-beating technique */}
                      <div className={cn(
                        "absolute inset-0 rounded-3xl shadow-2xl",
                        `bg-gradient-to-br ${item.color}`,
                        "opacity-90"
                      )}></div>
                      
                      {/* Glossy reflection layer */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-80"></div>
                      
                      {/* Inner shadow for depth */}
                      <div className="absolute inset-0.5 rounded-3xl shadow-inner bg-gradient-to-br from-transparent via-black/5 to-black/20"></div>
                      
                      {/* Icon container with perfect centering */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-3xl">
                        <Icon className="h-6 w-6 text-white drop-shadow-xl filter brightness-110" />
                      </div>
                      
                      {/* Premium light reflection - top highlight */}
                      <div className="absolute top-1 left-1 right-1 h-4 rounded-t-3xl bg-gradient-to-b from-white/60 to-transparent opacity-70"></div>
                      
                      {/* Ambient glow - multiple layers */}
                      <div className={cn(
                        "absolute -inset-2 rounded-3xl transition-all duration-1000 blur-xl",
                        `bg-gradient-to-br ${item.color}`,
                        "opacity-0 group-hover:opacity-50",
                        isActive && "opacity-30 animate-pulse"
                      )}></div>
                      
                      {/* Secondary glow for extra depth */}
                      <div className={cn(
                        "absolute -inset-1 rounded-3xl transition-all duration-700 blur-lg",
                        `bg-gradient-to-br ${item.color}`,
                        "opacity-0 group-hover:opacity-40",
                        isActive && "opacity-25"
                      )}></div>
                      
                      {/* Ultra-premium badge with Apple-style depth */}
                      {item.badge && (
                        <div className="absolute -top-2 -right-2 group">
                          {/* Badge shadow */}
                          <div className="absolute inset-0 rounded-full bg-red-600 blur-sm opacity-50"></div>
                          {/* Badge main */}
                          <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-2xl border-2 border-white/80 flex items-center justify-center">
                            <span className="text-white text-[10px] font-black drop-shadow-sm">{item.badge}</span>
                            {/* Badge highlight */}
                            <div className="absolute top-0.5 left-0.5 right-1.5 h-1.5 rounded-full bg-gradient-to-r from-white/70 to-transparent"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Active state premium indicator */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-pulse"></div>
                          <div className="absolute inset-1 rounded-3xl border border-white/20"></div>
                        </>
                      )}
                      
                      {/* Hover interaction ripple */}
                      <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/10 transition-all duration-500"></div>
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
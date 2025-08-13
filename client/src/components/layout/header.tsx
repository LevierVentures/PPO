import { ShoppingCart, UserCircle, Settings } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { state } = useAppState();
  const [, setLocation] = useLocation();

  return (
    <header className="bg-primary text-primary-foreground py-3 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-6 w-6" />
            PPO System
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-xs">
              {state.currentUser.role}
            </span>
            <span className="font-medium">{state.currentUser.name}</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-primary-foreground/10 p-2 rounded-full transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                      {state.currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation("/user-profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {(state.currentUser.role === "Procurement Manager" || state.currentUser.role === "Finance Director") && (
                  <DropdownMenuItem onClick={() => setLocation("/admin")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Administration
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

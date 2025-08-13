import { ShoppingCart, UserCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

export default function Header() {
  const { state } = useAppState();

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
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}

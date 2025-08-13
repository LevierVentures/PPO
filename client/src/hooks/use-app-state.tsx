import React, { createContext, useContext, useState, useCallback } from "react";

interface AppState {
  currentUser: {
    id: string;
    name: string;
    role: string;
    department: string;
  };
  chatOpen: boolean;
  errorMessage: string | null;
}

interface AppStateContextType {
  state: AppState;
  setChatOpen: (open: boolean) => void;
  showError: (message: string) => void;
  clearError: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: {
      id: "user-1",
      name: "John Smith",
      role: "Procurement Manager",
      department: "Procurement",
    },
    chatOpen: false,
    errorMessage: null,
  });

  const setChatOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, chatOpen: open }));
  }, []);

  const showError = useCallback((message: string) => {
    setState(prev => ({ ...prev, errorMessage: message }));
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, errorMessage: null }));
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, errorMessage: null }));
  }, []);

  const contextValue = {
    state,
    setChatOpen,
    showError,
    clearError,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

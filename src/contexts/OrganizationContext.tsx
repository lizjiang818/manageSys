import { createContext, useContext, useState, ReactNode } from 'react';

interface OrganizationContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <OrganizationContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizationContext必须在OrganizationProvider内使用');
  }
  return context;
}


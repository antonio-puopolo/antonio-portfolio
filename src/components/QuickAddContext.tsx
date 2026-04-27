import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { QuickAddSheet } from './QuickAddSheet';

type Ctx = {
  open: () => void;
  close: () => void;
};

const QuickAddCtx = createContext<Ctx | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<Ctx>(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  );

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <QuickAddCtx.Provider value={value}>
      {children}
      <QuickAddSheet open={isOpen} onClose={close} />
    </QuickAddCtx.Provider>
  );
}

export function useQuickAdd(): Ctx {
  const ctx = useContext(QuickAddCtx);
  if (!ctx) throw new Error('useQuickAdd must be used within <QuickAddProvider>');
  return ctx;
}

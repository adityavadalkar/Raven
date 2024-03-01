import React, { createContext, useContext, useMemo } from 'react';
import { useSetState } from 'react-use';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export function AppProvider({ children }) {
  const [state, setState] = useSetState({
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
  });

  const value = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

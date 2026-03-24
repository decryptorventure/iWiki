import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, appReducer, initialState } from '../store/useAppStore';

// Context
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType>({
    state: initialState,
    dispatch: () => { },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}

// Convenience hooks
export function useNavigate() {
    const { dispatch } = useApp();
    return (screen: string) => dispatch({ type: 'SET_SCREEN', screen });
}

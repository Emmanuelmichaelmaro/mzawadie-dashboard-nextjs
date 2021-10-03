/* eslint-disable react/prop-types */
import { useRouter } from "next/router";
import React from "react";

import appStateReducer, { AppStateReducerAction } from "./reducer";
import IAppState, { initialAppState } from "./state";

export type AppStateContextType = [IAppState, React.Dispatch<AppStateReducerAction>];

export const AppStateContext = React.createContext<AppStateContextType>([
    initialAppState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
]);

const AppStateProvider: React.FC = ({ children }) => {
    const router = useRouter();
    const stateAndDispatch = React.useReducer(appStateReducer, initialAppState);
    const [state, dispatch] = stateAndDispatch;

    React.useEffect(() => {
        if (state.error) {
            dispatch({
                payload: {
                    error: undefined,
                },
                type: "displayError",
            });
        }
    }, [dispatch, router, state.error]);

    return <AppStateContext.Provider value={stateAndDispatch}>{children}</AppStateContext.Provider>;
};

export const { Consumer } = AppStateContext;

export default AppStateProvider;

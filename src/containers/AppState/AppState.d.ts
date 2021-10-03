import React from "react";
import { AppStateReducerAction } from "./reducer";
import IAppState from "./state";
export declare type AppStateContextType = [IAppState, React.Dispatch<AppStateReducerAction>];
export declare const AppStateContext: React.Context<AppStateContextType>;
declare const AppStateProvider: React.FC;
export declare const Consumer: React.Consumer<AppStateContextType>;
export default AppStateProvider;

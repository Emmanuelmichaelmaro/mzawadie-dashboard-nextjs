import IAppState, { AppError } from "./state";
export declare type AppStateReducerActionType = "displayError" | "displayLoader";
export interface AppStateReducerAction {
    payload: Partial<{
        error: AppError["type"];
        errorId: AppError["id"];
        value: boolean | undefined;
    }>;
    type: AppStateReducerActionType;
}
declare function reduceAppState(previousState: IAppState, action: AppStateReducerAction): IAppState;
export default reduceAppState;

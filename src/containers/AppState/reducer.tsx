import IAppState, { AppError } from "./state";

export type AppStateReducerActionType = "displayError" | "displayLoader";

export interface AppStateReducerAction {
    payload: Partial<{
        error: AppError["type"];
        errorId: AppError["id"];
        value: boolean | undefined;
    }>;
    type: AppStateReducerActionType;
}

function displayError(
    previousState: IAppState,
    errorType: AppError["type"],
    errorId?: AppError["id"]
): IAppState {
    return {
        ...previousState,
        error: {
            id: errorId,
            type: errorType,
        },
        loading: false,
    };
}

function displayLoader(previousState: IAppState, value: boolean | undefined): IAppState {
    return {
        ...previousState,
        loading: value,
    };
}

function reduceAppState(previousState: IAppState, action: AppStateReducerAction): IAppState {
    switch (action.type) {
        case "displayError":
            return displayError(previousState, action.payload.error, action.payload.errorId);
        case "displayLoader":
            return displayLoader(previousState, action.payload.value);
        default:
            return previousState;
    }
}

export default reduceAppState;

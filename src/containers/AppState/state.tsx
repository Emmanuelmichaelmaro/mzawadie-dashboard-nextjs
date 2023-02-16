export interface AppError {
    type: "unhandled" | undefined;
    id: string | null | undefined;
}

interface IAppState {
    error: AppError | null;
    loading: boolean | undefined;
}

export const initialAppState: IAppState = {
    error: null,
    loading: false,
};

export default IAppState;

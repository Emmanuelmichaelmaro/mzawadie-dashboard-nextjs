export interface AppError {
    type: "unhandled" | undefined;
    id: string | null | undefined;
}
interface IAppState {
    error: AppError | null;
    loading: boolean | undefined;
}
export declare const initialAppState: IAppState;
export default IAppState;

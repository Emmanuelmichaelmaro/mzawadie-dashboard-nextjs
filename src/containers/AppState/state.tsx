export interface AppError {
    type: "unhandled"
    id: string | null | undefined
}

interface IAppState {
    error: AppError | null
    loading: boolean
}

export const initialAppState: IAppState = {
    // eslint-disable-next-line unicorn/no-null
    error: null,
    loading: false,
}

export default IAppState

import { AppErrorCode, PermissionEnum } from "./../../types/globalTypes";
export interface AppErrorFragment {
    __typename: "AppError";
    field: string | null;
    message: string | null;
    code: AppErrorCode;
    permissions: PermissionEnum[] | null;
}

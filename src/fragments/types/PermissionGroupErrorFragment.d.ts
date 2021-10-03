import { PermissionGroupErrorCode } from "./../../types/globalTypes";
export interface PermissionGroupErrorFragment {
    __typename: "PermissionGroupError";
    code: PermissionGroupErrorCode;
    field: string | null;
}

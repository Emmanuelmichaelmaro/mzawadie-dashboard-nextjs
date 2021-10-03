import { PermissionEnum } from "./../../types/globalTypes";
export interface PermissionFragment {
    __typename: "Permission";
    code: PermissionEnum;
    name: string;
}

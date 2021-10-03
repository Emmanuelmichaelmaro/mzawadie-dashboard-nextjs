import { PermissionEnum } from "./../../types/globalTypes";
export interface ExternalVerifyToken_externalVerify_user_userPermissions {
    __typename: "UserPermission";
    code: PermissionEnum;
    name: string;
}
export interface ExternalVerifyToken_externalVerify_user_avatar {
    __typename: "Image";
    url: string;
}
export interface ExternalVerifyToken_externalVerify_user {
    __typename: "User";
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isStaff: boolean;
    userPermissions: (ExternalVerifyToken_externalVerify_user_userPermissions | null)[] | null;
    avatar: ExternalVerifyToken_externalVerify_user_avatar | null;
}
export interface ExternalVerifyToken_externalVerify {
    __typename: "ExternalVerify";
    verifyData: any | null;
    user: ExternalVerifyToken_externalVerify_user | null;
}
export interface ExternalVerifyToken {
    externalVerify: ExternalVerifyToken_externalVerify | null;
}
export interface ExternalVerifyTokenVariables {
    pluginId: string;
    input: any;
}

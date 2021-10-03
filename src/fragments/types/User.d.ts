import { PermissionEnum } from "./../../types/globalTypes";
export interface User_userPermissions {
    __typename: "UserPermission";
    code: PermissionEnum;
    name: string;
}
export interface User_avatar {
    __typename: "Image";
    url: string;
}
export interface User {
    __typename: "User";
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isStaff: boolean;
    userPermissions: (User_userPermissions | null)[] | null;
    avatar: User_avatar | null;
}

export interface PermissionGroupFragment_users {
    __typename: "User";
    id: string;
    firstName: string;
    lastName: string;
}
export interface PermissionGroupFragment {
    __typename: "Group";
    id: string;
    name: string;
    userCanManage: boolean;
    users: (PermissionGroupFragment_users | null)[] | null;
}

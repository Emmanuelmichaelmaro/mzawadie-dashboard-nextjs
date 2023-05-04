import { PermissionEnum } from "@mzawadie/graphql";

export type PrefixedPermissions = `PERMISSION_${PermissionEnum}`;

export interface Node {
    id: string
}

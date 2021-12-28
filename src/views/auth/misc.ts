import { User } from "@mzawadie/sdk/lib/src/fragments/gqlTypes/User";
import { PermissionEnum } from "@mzawadie/sdk/lib/src/gqlTypes/globalTypes";

export const hasPermission = (permission: PermissionEnum, user: User) =>
    user?.userPermissions?.map((perm) => perm?.code).includes(permission);

/* eslint-disable import/prefer-default-export */
import { User } from "@mzawadie/fragments/types/User";
import { PermissionEnum } from "@mzawadie/types/globalTypes";

export const hasPermission = (permission: PermissionEnum, user: User) =>
    user?.userPermissions?.map((perm) => perm?.code).includes(permission);

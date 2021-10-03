import { User } from "@mzawadie/fragments/types/User";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
export declare const hasPermission: (permission: PermissionEnum, user: User) => boolean | undefined;

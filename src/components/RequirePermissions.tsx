// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { User_userPermissions } from "@mzawadie/fragments/types/User";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import React from "react";

export function hasPermissions(
    userPermissions: User_userPermissions[],
    requiredPermissions: PermissionEnum[]
): boolean {
    return requiredPermissions.reduce(
        (acc, perm) => acc && !!userPermissions.find((userPerm) => userPerm.code === perm),
        true
    );
}

export interface RequirePermissionsProps {
    children: React.ReactNode | React.ReactNodeArray;
    requiredPermissions: PermissionEnum[];
    userPermissions: User_userPermissions[];
}

const RequirePermissions: React.FC<RequirePermissionsProps> = ({
    children,
    requiredPermissions,
    userPermissions,
}) => (hasPermissions(userPermissions, requiredPermissions) ? <>{children}</> : null);

RequirePermissions.displayName = "RequirePermissions";

export default RequirePermissions;

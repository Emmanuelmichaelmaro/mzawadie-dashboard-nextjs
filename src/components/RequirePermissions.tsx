// @ts-nocheck
import { PermissionEnum, UserPermissionFragment } from "@mzawadie/graphql";
import React from "react";

export function hasPermissions(
    userPermissions: UserPermissionFragment[],
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
    userPermissions: UserPermissionFragment[];
}

const RequirePermissions: React.FC<RequirePermissionsProps> = ({
    children,
    requiredPermissions,
    userPermissions,
}) => (hasPermissions(userPermissions, requiredPermissions) ? <>{children}</> : null);

RequirePermissions.displayName = "RequirePermissions";

export default RequirePermissions;

// @ts-nocheck
import { PermissionEnum, UserPermissionFragment } from "@mzawadie/graphql";
import { useUserPermissions } from "@mzawadie/pages/auth/hooks/useUserPermissions";
import React from "react";

const findPerm = (permList, perm) => permList.find((userPerm: any) => userPerm.code === perm);

export function hasPermissions(
    userPermissions: UserPermissionFragment[],
    requiredPermissions: PermissionEnum[]
): boolean {
    return requiredPermissions.reduce((acc, perm) => acc && !!findPerm(userPermissions, perm), true);
}

export function hasOneOfPermissions(
    userPermissions: UserPermissionFragment[],
    givenPermissions: PermissionEnum[]
): boolean {
    return givenPermissions.some((perm) => !!findPerm(userPermissions, perm));
}

export interface RequirePermissionsProps {
    children: React.ReactNode | React.ReactNodeArray;
    requiredPermissions?: PermissionEnum[];
    oneOfPermissions?: PermissionEnum[];
}

const RequirePermissions: React.FC<RequirePermissionsProps> = ({
    children,
    requiredPermissions,
    oneOfPermissions,
}) => {
    const userPermissions = useUserPermissions();

    if (!userPermissions) {
        return null;
    }

    if (requiredPermissions && hasPermissions(userPermissions, requiredPermissions)) {
        return <>{children}</>;
    }

    if (oneOfPermissions && hasOneOfPermissions(userPermissions, oneOfPermissions)) {
        return <>{children}</>;
    }

    return null;
};

RequirePermissions.displayName = "RequirePermissions";

export default RequirePermissions;

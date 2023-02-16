// @ts-nocheck
import NotFound from "@mzawadie/components/NotFound";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { Route, RouteProps } from "react-router-dom";

import { useUser } from "..";
import { hasAllPermissions, hasAnyPermissions } from "../misc";

type MatchPermissionType = "all" | "any";

interface SectionRouteProps extends RouteProps {
    permissions?: PermissionEnum[];
    matchPermission?: MatchPermissionType;
}

const matchAll = (match: MatchPermissionType) => match === "all";

export const SectionRoute: React.FC<SectionRouteProps> = ({
    permissions,
    matchPermission = "all",
    ...props
}) => {
    const { user } = useUser();

    const hasSectionPermissions = () => {
        if (!permissions) {
            return true;
        }

        if (matchAll(matchPermission)) {
            return hasAllPermissions(permissions, user);
        }

        return hasAnyPermissions(permissions, user);
    };

    return hasSectionPermissions() ? <Route {...props} /> : <NotFound />;
};

SectionRoute.displayName = "Route";

export default SectionRoute;

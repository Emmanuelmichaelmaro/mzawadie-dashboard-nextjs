// @ts-nocheck
import NotFound from "@mzawadie/NotFound";
import useUser from "@mzawadie/hooks/useUser";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { RouteProps, Route } from "react-router-dom";

import { hasPermission } from "../misc";

interface SectionRouteProps extends RouteProps {
    permissions?: PermissionEnum[];
}

export const SectionRoute: React.FC<SectionRouteProps> = ({ permissions, ...props }) => {
    const { user } = useUser();

    const hasPermissions =
        !permissions ||
        permissions
            .map((permission) => hasPermission(permission, user))
            .reduce((prev, curr) => prev && curr);

    return hasPermissions ? <Route {...props} /> : <NotFound />;
};

SectionRoute.displayName = "Route";

export default SectionRoute;

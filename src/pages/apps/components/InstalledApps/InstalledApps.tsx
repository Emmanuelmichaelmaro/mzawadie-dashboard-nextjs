// @ts-nocheck
import { Card, Switch, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { IconButton } from "@mzawadie/components/IconButton";
import { TableButtonWrapper } from "@mzawadie/components/TableButtonWrapper/TableButtonWrapper";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { ListProps, renderCollection } from "@mzawadie/core";
import { AppListItemFragment, AppsListQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useAppListContext } from "@mzawadie/pages/apps/context";
import { appUrl, createAppInstallUrl } from "@mzawadie/pages/apps/urls";
import { isAppInTunnel } from "@mzawadie/pages/apps/utils";
import { DeleteIcon, ResponsiveTable } from "@saleor/macaw-ui";
import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppManifestTableDisplay } from "../AppManifestTableDisplay/AppManifestTableDisplay";
import { AppPermissions } from "../AppPermissions/AppPermissions";
import { AppsSkeleton } from "../AppsSkeleton";
import { InstallWithManifestFormButton } from "../InstallWithManifestFormButton";

export interface InstalledAppsProps extends ListProps {
    appsList: AppsListQuery["apps"]["edges"];
    onRemove: (id: string) => void;
    displayQuickManifestButton?: boolean;
    title: string;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({
    appsList,
    onRemove,
    title,
    displayQuickManifestButton = false,
    ...props
}) => {
    const classes = useStyles(props);

    const { activateApp, deactivateApp } = useAppListContext();

    const navigate = useNavigator();

    const navigateToAppInstallPage = useCallback(
        (url: string) => {
            navigate(createAppInstallUrl(url));
        },
        [navigate]
    );

    const getHandleToggle = (app: AppListItemFragment) => () => {
        if (app.isActive) {
            deactivateApp(app.id);
        } else {
            activateApp(app.id);
        }
    };

    return (
        <Card className={classes.apps}>
            <CardTitle
                title={title}
                toolbar={
                    displayQuickManifestButton ? (
                        <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
                    ) : undefined
                }
            />

            <ResponsiveTable>
                <TableBody>
                    {renderCollection(
                        appsList,
                        (app, index) =>
                            app ? (
                                <TableRowLink
                                    key={app.node.id}
                                    className={classes.tableRow}
                                    href={appUrl(app.node.id)}
                                >
                                    <TableCell className={classes.colName}>
                                        <span data-tc="name" className={classes.appName}>
                                            {app.node.name}
                                        </span>

                                        {app.node.manifestUrl && isAppInTunnel(app.node.manifestUrl) ? (
                                            <Typography variant="caption">
                                                <FormattedMessage
                                                    defaultMessage="(TUNNEL - DEVELOPMENT)"
                                                    id="QdQ9z7"
                                                />
                                            </Typography>
                                        ) : null}
                                    </TableCell>

                                    <TableCell className={classes.colAction}>
                                        {app.node.manifestUrl && (
                                            <AppManifestTableDisplay
                                                manifestUrl={app.node.manifestUrl}
                                            />
                                        )}

                                        <TableButtonWrapper>
                                            <Switch
                                                checked={app.node.isActive}
                                                onChange={getHandleToggle(app.node)}
                                            />
                                        </TableButtonWrapper>

                                        <AppPermissions permissions={app.node.permissions} />

                                        <TableButtonWrapper>
                                            <IconButton
                                                variant="secondary"
                                                color="primary"
                                                onClick={() => onRemove(app.node.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableButtonWrapper>
                                    </TableCell>
                                </TableRowLink>
                            ) : (
                                <AppsSkeleton key={index} />
                            ),
                        () => (
                            <TableRow className={classes.tableRow}>
                                <TableCell className={classes.colName}>
                                    <Typography className={classes.text} variant="body2">
                                        <FormattedMessage
                                            id="9tgY4G"
                                            defaultMessage="You don’t have any installed apps in your dashboard"
                                            description="apps content"
                                        />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

InstalledApps.displayName = "InstalledApps";

export default InstalledApps;

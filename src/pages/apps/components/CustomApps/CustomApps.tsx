// @ts-nocheck
import { Card, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages, renderCollection, stopPropagation } from "@mzawadie/core";
import { DeleteIcon, ResponsiveTable, Button, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useStyles } from "../../styles";
import { AppsList_apps_edges } from "../../types/AppsList";
import { AppsSkeleton } from "../AppsSkeleton";
import { DeactivatedText } from "../DeactivatedText";

export interface CustomAppsProps {
    appsList: AppsList_apps_edges[];
    navigateToCustomApp: (id: string) => () => void;
    navigateToCustomAppCreate?: () => void;
    onRemove: (id: string) => void;
}

const CustomApps: React.FC<CustomAppsProps> = ({
    appsList,
    navigateToCustomAppCreate,
    onRemove,
    navigateToCustomApp,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <Card className={classes.customApps}>
            <CardTitle
                toolbar={
                    !!navigateToCustomAppCreate && (
                        <Button
                            variant="secondary"
                            onClick={navigateToCustomAppCreate}
                            data-test-id="create-app"
                        >
                            <FormattedMessage
                                defaultMessage="Create App"
                                id="XB2Jj9"
                                description="create app button"
                            />
                        </Button>
                    )
                }
                title={intl.formatMessage(commonMessages.customApps)}
            />

            <ResponsiveTable>
                <TableBody>
                    {renderCollection(
                        appsList,
                        (app, index) =>
                            app ? (
                                <TableRow
                                    key={app.node.id}
                                    className={classes.tableRow}
                                    onClick={navigateToCustomApp(app.node.id)}
                                >
                                    <TableCell className={classes.colName}>
                                        <span data-tc="name" className={classes.appName}>
                                            {app.node.name}
                                        </span>
                                        {!app.node.isActive && (
                                            <div className={classes.statusWrapper}>
                                                <DeactivatedText />
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className={classes.colAction}>
                                        <IconButton
                                            variant="secondary"
                                            color="primary"
                                            onClick={stopPropagation(() => onRemove(app.node.id))}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AppsSkeleton key={index} />
                            ),
                        () => (
                            <TableRow className={classes.tableRow}>
                                <TableCell className={classes.colName}>
                                    <Typography className={classes.text} variant="body2">
                                        <FormattedMessage
                                            defaultMessage="Your custom-created apps will be shown here."
                                            id="voRaz3"
                                            description="custom apps content"
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

CustomApps.displayName = "CustomApps";

export default CustomApps;

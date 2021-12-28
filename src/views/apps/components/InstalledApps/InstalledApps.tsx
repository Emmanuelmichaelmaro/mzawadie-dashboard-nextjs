// @ts-nocheck
import {
    Button,
    IconButton,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
    Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@mzawadie/components/CardTitle";
import TablePagination from "@mzawadie/components/TablePagination";
import { renderCollection, stopPropagation, ListProps } from "@mzawadie/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppsList_apps_edges } from "../../types/AppsList";
import AppsSkeleton from "../AppsSkeleton";
import CardContainer from "../CardContainer";
import DeactivatedText from "../DeactivatedText";

export interface InstalledAppsProps extends ListProps {
    appsList: AppsList_apps_edges[];
    onRemove: (id: string) => void;
    onSettingsRowClick: (id: string) => () => void;
}
const numberOfColumns = 2;

const InstalledApps: React.FC<InstalledAppsProps> = ({
    appsList,
    onRemove,
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onRowClick,
    onUpdateListSettings,
    onSettingsRowClick,
    pageInfo,
    ...props
}) => {
    const intl = useIntl();
    const classes = useStyles(props);

    return (
        <CardContainer
            header={
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Third-party Apps",
                        id: "ZeD2TK",
                        description: "section header",
                    })}
                />
            }
        >
            <>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={numberOfColumns}
                            settings={settings}
                            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                            onNextPage={onNextPage}
                            onUpdateListSettings={onUpdateListSettings}
                            hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                            onPreviousPage={onPreviousPage}
                        />
                    </TableRow>
                </TableFooter>
                <TableBody>
                    {renderCollection(
                        appsList,
                        (app, index) =>
                            app ? (
                                <TableRow
                                    key={app.node.id}
                                    className={classes.tableRow}
                                    onClick={onSettingsRowClick(app.node.id)}
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
                                        <Button
                                            color="primary"
                                            onClick={stopPropagation(onRowClick(app.node.id))}
                                        >
                                            <FormattedMessage
                                                defaultMessage="About"
                                                id="TBaMo2"
                                                description="about app"
                                            />
                                        </Button>
                                        <IconButton
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
                                            defaultMessage="You don’t have any installed apps in your dashboard"
                                            id="9tgY4G"
                                            description="apps content"
                                        />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </>
        </CardContainer>
    );
};

InstalledApps.displayName = "InstalledApps";

export default InstalledApps;

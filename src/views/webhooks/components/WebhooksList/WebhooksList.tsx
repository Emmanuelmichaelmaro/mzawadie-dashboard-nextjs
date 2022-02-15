// @ts-nocheck
import { Button, Card, IconButton, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@mzawadie/components/CardTitle";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TableCellHeader from "@mzawadie/components/TableCellHeader";
import { renderCollection, stopPropagation } from "@mzawadie/core";
import { App_app_webhooks } from "@mzawadie/views/apps/types/App";
import { isUnnamed } from "@mzawadie/views/webhooks/utils";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface WebhooksListProps {
    webhooks: App_app_webhooks[];
    onRemove: (id: string) => void;
    onRowClick: (id: string) => () => void;
    onCreate?: () => void;
}
const numberOfColumns = 3;

const WebhooksList: React.FC<WebhooksListProps> = ({ webhooks, onCreate, onRowClick, onRemove }) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Webhooks",
                    id: "jqnwW9",
                    description: "header",
                })}
                toolbar={
                    !!onCreate && (
                        <Button color="primary" onClick={onCreate} data-test-id="createWebhook">
                            <FormattedMessage
                                defaultMessage="Create Webhook"
                                id="wlr0Si"
                                description="button"
                            />
                        </Button>
                    )
                }
            />

            <ResponsiveTable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCellHeader>
                            {intl.formatMessage({
                                defaultMessage: "Name",
                                id: "OTpV1t",
                                description: "webhook name",
                            })}
                        </TableCellHeader>

                        <TableCell className={classNames(classes.colAction, classes.colRight)}>
                            {intl.formatMessage({
                                defaultMessage: "Action",
                                id: "a/QJBx",
                                description: "user action bar",
                            })}
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {renderCollection(
                        webhooks,
                        (webhook) => (
                            <TableRow
                                hover={!!webhook}
                                className={webhook ? classes.tableRow : undefined}
                                onClick={webhook ? onRowClick(webhook.id) : undefined}
                                key={webhook ? webhook.id : "skeleton"}
                            >
                                <TableCell
                                    className={classNames(classes.colName, {
                                        [classes.colNameUnnamed]: isUnnamed(webhook),
                                    })}
                                >
                                    {isUnnamed(webhook) ? (
                                        <FormattedMessage
                                            defaultMessage="Unnamed webhook"
                                            id="1eCau/"
                                        />
                                    ) : (
                                        webhook?.name || <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell className={classNames(classes.colAction, classes.colRight)}>
                                    <IconButton
                                        color="primary"
                                        onClick={
                                            webhook
                                                ? stopPropagation(() => onRemove(webhook.id))
                                                : undefined
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    {intl.formatMessage({
                                        defaultMessage: "No webhooks found",
                                        id: "wbjuR4",
                                    })}
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

WebhooksList.displayName = "WebhooksList";

export default WebhooksList;

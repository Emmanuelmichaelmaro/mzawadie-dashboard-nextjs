// @ts-nocheck
import { Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { renderCollection, stopPropagation } from "@mzawadie/core";
import { App_app_webhooks } from "@mzawadie/pages/apps/types/App";
import { isUnnamed } from "@mzawadie/pages/webhooks/utils";
import { Button, DeleteIcon, IconButton } from "@saleor/macaw-ui";
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

const WebhooksList: React.FC<WebhooksListProps> = ({ webhooks, onCreate, onRowClick, onRemove }) => {
    const intl = useIntl();
    const classes = useStyles({});
    const numberOfColumns = webhooks?.length === 0 ? 2 : 3;

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
                        <Button variant="secondary" onClick={onCreate} data-test-id="create-webhook">
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
                                className={!!webhook ? classes.tableRow : undefined}
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
                                        variant="secondary"
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

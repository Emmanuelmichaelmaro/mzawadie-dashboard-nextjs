// @ts-nocheck
import { Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableButtonWrapper } from "@mzawadie/components/TableButtonWrapper/TableButtonWrapper";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { renderCollection, stopPropagation } from "@mzawadie/core";
import { AppQuery } from "@mzawadie/graphql";
import { webhookPath } from "@mzawadie/pages/webhooks/urls";
import { isUnnamed } from "@mzawadie/pages/webhooks/utils";
import { DeleteIcon, IconButton, Pill } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export interface WebhooksListProps {
    webhooks: AppQuery["app"]["webhooks"];
    onRemove: (id: string) => void;
    createHref?: string;
}

const WebhooksList: React.FC<WebhooksListProps> = ({ webhooks, createHref, onRemove }) => {
    const intl = useIntl();
    const classes = useStyles();
    const numberOfColumns = webhooks?.length === 0 ? 2 : 3;

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage(sectionNames.webhooks)}
                toolbar={
                    !!createHref && (
                        <Button variant="secondary" href={createHref} data-test-id="create-webhook">
                            <FormattedMessage {...messages.createWebhook} />
                        </Button>
                    )
                }
            />

            <ResponsiveTable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCellHeader>{intl.formatMessage(commonMessages.name)}</TableCellHeader>
                        <TableCellHeader>{intl.formatMessage(commonMessages.status)}</TableCellHeader>
                        <TableCell className={classNames(classes.colAction, classes.colRight)}>
                            <FormattedMessage {...messages.action} />
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {renderCollection(
                        webhooks,
                        (webhook) => (
                            <TableRowLink
                                hover={!!webhook}
                                className={!!webhook ? classes.tableRow : undefined}
                                href={webhook && webhookPath(webhook.id)}
                                key={webhook ? webhook.id : "skeleton"}
                            >
                                <TableCell
                                    className={classNames(classes.colName, {
                                        [classes.colNameUnnamed]: isUnnamed(webhook),
                                    })}
                                >
                                    {isUnnamed(webhook) ? (
                                        <FormattedMessage {...messages.unnamedWebhook} />
                                    ) : (
                                        webhook?.name || <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell>
                                    {webhook ? (
                                        <Pill
                                            label={
                                                webhook.isActive
                                                    ? intl.formatMessage(commonMessages.active)
                                                    : intl.formatMessage(commonMessages.notActive)
                                            }
                                            color={webhook.isActive ? "success" : "error"}
                                        />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell className={classNames(classes.colAction, classes.colRight)}>
                                    <TableButtonWrapper>
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
                                    </TableButtonWrapper>
                                </TableCell>
                            </TableRowLink>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    {intl.formatMessage(messages.noWebhooks)}
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

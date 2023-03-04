import { Card, CardContent, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Date } from "@mzawadie/components/Date";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { buttonMessages } from "@mzawadie/core";
import { InvoiceFragment } from "@mzawadie/fragments/types/InvoiceFragment";
import { Button, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    () => ({
        card: {
            overflow: "hidden",
        },
        cardContentTable: {
            "&:last-child": {
                padding: 0,
            },
            padding: 0,
        },
        colAction: {
            button: {
                padding: "0",
            },
            padding: "0 0.5rem",
            width: "auto",
        },
        colNumber: { width: "100%" },
        colNumberClickable: {
            cursor: "pointer",
            width: "100%",
        },
        invoicesTable: {
            display: "flex",
        },
        invoicesTableBody: {
            width: "100%",
        },
    }),
    { name: "OrderInvoiceList" }
);

export interface OrderInvoiceListProps {
    invoices: InvoiceFragment[];
    onInvoiceGenerate: () => void;
    onInvoiceClick: (invoiceId: string) => void;
    onInvoiceSend: (invoiceId: string) => void;
}

const OrderInvoiceList: React.FC<OrderInvoiceListProps> = (props) => {
    const { invoices, onInvoiceGenerate, onInvoiceClick, onInvoiceSend } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    const generatedInvoices = invoices?.filter((invoice) => invoice.status === "SUCCESS");

    return (
        <Card className={classes.card}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Invoices",
                    id: "Gzg8hy",
                    description: "section header",
                })}
                toolbar={
                    onInvoiceGenerate && (
                        <Button onClick={onInvoiceGenerate}>
                            <FormattedMessage
                                defaultMessage="Generate"
                                id="e0RKe+"
                                description="generate invoice button"
                            />
                        </Button>
                    )
                }
            />

            <CardContent
                className={classNames({
                    [classes.cardContentTable]: generatedInvoices?.length,
                })}
            >
                {!generatedInvoices ? (
                    <Skeleton />
                ) : !generatedInvoices?.length ? (
                    <Typography color="textSecondary">
                        <FormattedMessage defaultMessage="No invoices to be shown" id="hPB89Y" />
                    </Typography>
                ) : (
                    <ResponsiveTable className={classes.invoicesTable}>
                        <TableBody className={classes.invoicesTableBody}>
                            {generatedInvoices.map((invoice) => (
                                <TableRow key={invoice.id} hover={!!invoice}>
                                    <TableCell
                                        className={
                                            onInvoiceClick
                                                ? classes.colNumberClickable
                                                : classes.colNumber
                                        }
                                        onClick={() => onInvoiceClick(invoice.id)}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Invoice"
                                            id="m6IBe5"
                                            description="invoice number prefix"
                                        />{" "}
                                        {invoice.number}
                                        <Typography variant="caption">
                                            <FormattedMessage
                                                defaultMessage="created"
                                                id="F0AXNs"
                                                description="invoice create date prefix"
                                            />{" "}
                                            <Date date={invoice.createdAt} plain />
                                        </Typography>
                                    </TableCell>

                                    {onInvoiceSend && (
                                        <TableCell
                                            className={classes.colAction}
                                            onClick={() => onInvoiceSend(invoice.id)}
                                        >
                                            <Button>
                                                <FormattedMessage {...buttonMessages.send} />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </ResponsiveTable>
                )}
            </CardContent>
        </Card>
    );
};

OrderInvoiceList.displayName = "OrderInvoiceList";

export default OrderInvoiceList;

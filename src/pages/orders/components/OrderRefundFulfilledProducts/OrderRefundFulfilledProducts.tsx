// @ts-nocheck
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Money } from "@mzawadie/components/Money";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { renderCollection } from "@mzawadie/core";
import { OrderRefundDataQuery } from "@mzawadie/graphql";
import { FormsetChange } from "@mzawadie/hooks/useFormset";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { getTitle } from "./messages";

const useStyles = makeStyles(
    (theme) => {
        const inputPadding = {
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
        };

        return {
            cartContent: {
                paddingBottom: 0,
                paddingTop: 0,
            },
            colQuantity: {
                textAlign: "right",
                width: 210,
            },
            notice: {
                marginBottom: theme.spacing(1),
                marginTop: theme.spacing(2),
            },
            orderNumber: {
                display: "inline",
                marginLeft: theme.spacing(1),
            },
            quantityInnerInput: {
                ...inputPadding,
            },
            quantityInnerInputNoRemaining: {
                paddingRight: 0,
            },
            remainingQuantity: {
                ...inputPadding,
                color: theme.palette.text.secondary,
                whiteSpace: "nowrap",
            },
            setMaximalQuantityButton: {
                marginTop: theme.spacing(1),
            },
        };
    },
    { name: "OrderRefundFulfilledProducts" }
);

interface OrderRefundFulfilledProductsProps {
    fulfillment: OrderRefundDataQuery["order"]["fulfillments"][0];
    data: OrderRefundFormData;
    disabled: boolean;
    orderNumber: string;
    onRefundedProductQuantityChange: FormsetChange<string>;
    onSetMaximalQuantities: () => void;
}

const OrderRefundFulfilledProducts: React.FC<OrderRefundFulfilledProductsProps> = (props) => {
    const {
        fulfillment,
        data,
        disabled,
        orderNumber,
        onRefundedProductQuantityChange,
        onSetMaximalQuantities,
    } = props;

    const classes = useStyles({});
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={
                    <>
                        {getTitle(fulfillment.status, intl)}
                        {fulfillment && (
                            <Typography className={classes.orderNumber} variant="body1">
                                {`#${orderNumber}-${fulfillment?.fulfillmentOrder}`}
                            </Typography>
                        )}
                    </>
                }
            />

            <CardContent className={classes.cartContent}>
                <Button
                    className={classes.setMaximalQuantityButton}
                    onClick={onSetMaximalQuantities}
                    data-test-id={`set-maximal-quantity-fulfilled-button-${fulfillment?.id}`}
                >
                    <FormattedMessage
                        defaultMessage="Set maximal quantities"
                        id="2W4EBM"
                        description="button"
                    />
                </Button>
            </CardContent>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Product"
                                id="FNT4b+"
                                description="tabel column header"
                            />
                        </TableCell>

                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Price"
                                id="5aiFbL"
                                description="tabel column header"
                            />
                        </TableCell>

                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Refunded Qty"
                                id="Tl+7X4"
                                description="tabel column header"
                            />
                        </TableCell>

                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Total"
                                id="+PclgM"
                                description="tabel column header"
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {renderCollection(
                        fulfillment?.lines,
                        (line) => {
                            const selectedLineQuantity = data.refundedFulfilledProductQuantities.find(
                                (refundedLine) => refundedLine.id === line.id
                            );

                            const isError =
                                Number(selectedLineQuantity?.value) > line?.quantity ||
                                Number(selectedLineQuantity?.value) < 0;

                            return (
                                <TableRow key={line?.id}>
                                    <TableCellAvatar thumbnail={line?.orderLine?.thumbnail?.url}>
                                        {line?.orderLine?.productName ? (
                                            line?.orderLine?.productName
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCellAvatar>

                                    <TableCell>
                                        {line?.orderLine?.unitPrice ? (
                                            <Money money={line?.orderLine?.unitPrice.gross} />
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>

                                    <TableCell className={classes.colQuantity}>
                                        {line?.quantity ? (
                                            <TextField
                                                disabled={disabled}
                                                type="number"
                                                inputProps={{
                                                    className: classes.quantityInnerInput,
                                                    "data-test-id": `quantityInput${line?.id}`,
                                                    max: (line?.quantity).toString(),
                                                    min: 0,
                                                    style: { textAlign: "right" },
                                                }}
                                                fullWidth
                                                value={selectedLineQuantity?.value}
                                                onChange={(event) =>
                                                    onRefundedProductQuantityChange(
                                                        line.id,
                                                        event.target.value
                                                    )
                                                }
                                                InputProps={{
                                                    endAdornment: line?.quantity && (
                                                        <div className={classes.remainingQuantity}>
                                                            / {line?.quantity}
                                                        </div>
                                                    ),
                                                }}
                                                error={isError}
                                                helperText={
                                                    isError &&
                                                    intl.formatMessage({
                                                        defaultMessage: "Improper value",
                                                        id: "xoyCZ/",
                                                        description: "error message",
                                                    })
                                                }
                                            />
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {(line?.quantity && line?.orderLine?.unitPrice.gross && (
                                            <Money
                                                money={{
                                                    ...line?.orderLine.unitPrice.gross,
                                                    amount:
                                                        (line?.orderLine.unitPrice.gross.amount || 0) *
                                                        Number(selectedLineQuantity?.value),
                                                }}
                                            />
                                        )) || <Skeleton />}
                                    </TableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <FormattedMessage defaultMessage="No products found" id="Q1Uzbb" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};

OrderRefundFulfilledProducts.displayName = "OrderRefundFulfilledProducts";

export default OrderRefundFulfilledProducts;

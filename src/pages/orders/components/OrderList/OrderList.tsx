// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { CSSProperties } from "@material-ui/styles";
import { DateTime } from "@mzawadie/components/Date";
import { Money } from "@mzawadie/components/Money";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TablePagination } from "@mzawadie/components/TablePagination";
import {
    maybe,
    renderCollection,
    transformOrderStatus,
    transformPaymentStatus,
    ListProps,
    SortPage,
    RelayToFlat,
} from "@mzawadie/core";
import { OrderListQuery } from "@mzawadie/graphql";
import { OrderListUrlSortField } from "@mzawadie/pages/orders/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => {
        const overflowing: CSSProperties = {
            overflow: "hidden",
            textOverflow: "ellipsis",
        };

        return {
            [theme.breakpoints.up("lg")]: {
                colCustomer: {
                    width: 220,
                },
                colDate: {},
                colFulfillment: {
                    width: 230,
                },
                colNumber: {
                    width: 120,
                },
                colPayment: {
                    width: 220,
                },
                colTotal: {},
            },
            pill: {
                maxWidth: "100%",
                ...overflowing,
            },
            colCustomer: overflowing,
            colDate: {},
            colFulfillment: {},
            colNumber: {},
            colPayment: {},
            colTotal: {
                textAlign: "right",
            },
            link: {
                cursor: "pointer",
            },
        };
    },
    { name: "OrderList" }
);

interface OrderListProps extends ListProps, SortPage<OrderListUrlSortField> {
    orders: RelayToFlat<OrderListQuery["orders"]>;
}

const numberOfColumns = 6;

export const OrderList: React.FC<OrderListProps> = (props) => {
    const {
        disabled,
        settings,
        orders,
        pageInfo,
        onPreviousPage,
        onNextPage,
        onUpdateListSettings,
        onRowClick,
        onSort,
        sort,
    } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    const orderList = orders
        ? orders.map((order) => ({
              ...order,
              paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
              status: transformOrderStatus(order.status, intl),
          }))
        : undefined;

    return (
        <ResponsiveTable>
            <TableHead>
                <TableRow>
                    <TableCellHeader
                        direction={
                            sort.sort === OrderListUrlSortField.number
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(OrderListUrlSortField.number)}
                        className={classes.colNumber}
                    >
                        <FormattedMessage defaultMessage="No. of Order" id="ps0WUQ" />
                    </TableCellHeader>

                    <TableCellHeader
                        direction={
                            sort.sort === OrderListUrlSortField.date
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        onClick={() => onSort(OrderListUrlSortField.date)}
                        className={classes.colDate}
                    >
                        <FormattedMessage
                            defaultMessage="Date"
                            id="PHUcrU"
                            description="date when order was placed"
                        />
                    </TableCellHeader>

                    <TableCellHeader
                        direction={
                            sort.sort === OrderListUrlSortField.customer
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        onClick={() => onSort(OrderListUrlSortField.customer)}
                        className={classes.colCustomer}
                    >
                        <FormattedMessage
                            defaultMessage="Customer"
                            id="5blVMu"
                            description="e-mail or full name"
                        />
                    </TableCellHeader>

                    <TableCellHeader
                        direction={
                            sort.sort === OrderListUrlSortField.payment
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        onClick={() => onSort(OrderListUrlSortField.payment)}
                        className={classes.colPayment}
                    >
                        <FormattedMessage
                            defaultMessage="Payment"
                            id="p+UDec"
                            description="payment status"
                        />
                    </TableCellHeader>

                    <TableCellHeader
                        direction={
                            sort.sort === OrderListUrlSortField.fulfillment
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        onClick={() => onSort(OrderListUrlSortField.fulfillment)}
                        className={classes.colFulfillment}
                    >
                        <FormattedMessage defaultMessage="Fulfillment status" id="NWxomz" />
                    </TableCellHeader>

                    <TableCellHeader textAlign="right" className={classes.colTotal}>
                        <FormattedMessage
                            defaultMessage="Total"
                            id="k9hf7F"
                            description="total order price"
                        />
                    </TableCellHeader>
                </TableRow>
            </TableHead>

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
                    orderList,
                    (order) => (
                        <TableRow
                            data-test-id="order-table-row"
                            hover={!!order}
                            className={!!order ? classes.link : undefined}
                            onClick={order ? onRowClick(order.id) : undefined}
                            key={order ? order.id : "skeleton"}
                        >
                            <TableCell className={classes.colNumber}>
                                {maybe(() => order.number) ? `#${order.number}` : <Skeleton />}
                            </TableCell>

                            <TableCell className={classes.colDate}>
                                {maybe(() => order.created) ? (
                                    <DateTime date={order.created} />
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colCustomer}>
                                {maybe(() => order.billingAddress) ? (
                                    <>
                                        {order.billingAddress.firstName}
                                        &nbsp;
                                        {order.billingAddress.lastName}
                                    </>
                                ) : maybe(() => order.userEmail) !== undefined ? (
                                    order.userEmail
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colPayment}>
                                {maybe(() => order.paymentStatus.status) !== undefined ? (
                                    order.paymentStatus.status === null ? null : (
                                        <Pill
                                            className={classes.pill}
                                            color={order.paymentStatus.status}
                                            label={order.paymentStatus.localized}
                                        />
                                    )
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colFulfillment}>
                                {maybe(() => order.status) ? (
                                    <Pill
                                        className={classes.pill}
                                        color={order.status.status}
                                        label={order.status.localized}
                                    />
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colTotal} align="right">
                                {maybe(() => order.total.gross) ? (
                                    <Money money={order.total.gross} />
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>
                        </TableRow>
                    ),
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage defaultMessage="No orders found" id="RlfqSV" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

OrderList.displayName = "OrderList";

export default OrderList;

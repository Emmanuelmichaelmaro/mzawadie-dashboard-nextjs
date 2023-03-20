// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { DateTime } from "@mzawadie/components/Date";
import { Money } from "@mzawadie/components/Money";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import {
    maybe,
    renderCollection,
    transformOrderStatus,
    transformPaymentStatus,
    ListActions,
    ListProps,
    SortPage,
    RelayToFlat,
} from "@mzawadie/core";
import { OrderDraftListQuery } from "@mzawadie/graphql";
import { OrderDraftListUrlSortField } from "@mzawadie/pages/orders/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colCustomer: {
                width: 300,
            },
            colDate: {
                width: 300,
            },
            colNumber: {
                width: 160,
            },
            colTotal: {},
        },
        colCustomer: {},
        colDate: {},
        colNumber: {
            paddingLeft: 0,
        },
        colTotal: {
            textAlign: "right",
        },
        link: {
            cursor: "pointer",
        },
    }),
    { name: "OrderDraftList" }
);

interface OrderDraftListProps extends ListProps, ListActions, SortPage<OrderDraftListUrlSortField> {
    orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = (props) => {
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
        isChecked,
        selected,
        sort,
        toggle,
        toggleAll,
        toolbar,
    } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    const orderDraftList = orders
        ? orders.map((order) => ({
              ...order,
              paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
              status: transformOrderStatus(order.status, intl),
          }))
        : undefined;

    const numberOfColumns = orderDraftList?.length === 0 ? 4 : 5;

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={orders}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        sort.sort === OrderDraftListUrlSortField.number
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(OrderDraftListUrlSortField.number)}
                    className={classes.colNumber}
                >
                    <FormattedMessage defaultMessage="No. of Order" id="ps0WUQ" />
                </TableCellHeader>

                <TableCellHeader
                    direction={
                        sort.sort === OrderDraftListUrlSortField.date
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    onClick={() => onSort(OrderDraftListUrlSortField.date)}
                    className={classes.colDate}
                >
                    <FormattedMessage
                        defaultMessage="Date"
                        id="mCP0UD"
                        description="order draft creation date"
                    />
                </TableCellHeader>

                <TableCellHeader
                    direction={
                        sort.sort === OrderDraftListUrlSortField.customer
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    onClick={() => onSort(OrderDraftListUrlSortField.customer)}
                    className={classes.colCustomer}
                >
                    <FormattedMessage defaultMessage="Customer" id="hkENym" />
                </TableCellHeader>

                <TableCellHeader textAlign="right" className={classes.colTotal}>
                    <FormattedMessage
                        defaultMessage="Total"
                        id="1Uj0Wd"
                        description="order draft total price"
                    />
                </TableCellHeader>
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
                    orderDraftList,
                    (order) => {
                        const isSelected = order ? isChecked(order.id) : false;

                        return (
                            <TableRow
                                data-test-id="draft-order-table-row"
                                hover={!!order}
                                className={!!order ? classes.link : undefined}
                                onClick={order ? onRowClick(order.id) : undefined}
                                key={order ? order.id : "skeleton"}
                                selected={isSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(order?.id)}
                                    />
                                </TableCell>

                                <TableCell className={classes.colNumber}>
                                    {maybe(() => order?.number) ? `#${order?.number}` : <Skeleton />}
                                </TableCell>

                                <TableCell className={classes.colDate}>
                                    {maybe(() => order?.created) ? (
                                        <DateTime date={order?.created} />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell className={classes.colCustomer}>
                                    {maybe(() => order?.billingAddress) ? (
                                        <>
                                            {order.billingAddress?.firstName}
                                            &nbsp;
                                            {order.billingAddress?.lastName}
                                        </>
                                    ) : maybe(() => order?.userEmail) !== undefined ? (
                                        order?.userEmail
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell className={classes.colTotal} align="right">
                                    {maybe(() => order?.total.gross) ? (
                                        <Money money={order?.total.gross} />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    },
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage defaultMessage="No draft orders found" id="KIh25E" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

OrderDraftList.displayName = "OrderDraftList";

export default OrderDraftList;

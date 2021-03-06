// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import { DateTime } from "@mzawadie/components/Date";
import Money from "@mzawadie/components/Money";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import StatusLabel from "@mzawadie/components/StatusLabel";
import { maybe, renderCollection, transformPaymentStatus } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerDetails_user_orders_edges_node } from "../../types/CustomerDetails";

const useStyles = makeStyles(
    {
        link: {
            cursor: "pointer",
        },
        textRight: {
            textAlign: "right",
        },
    },
    { name: "CustomerOrders" }
);

export interface CustomerOrdersProps {
    orders: CustomerDetails_user_orders_edges_node[];
    onViewAllOrdersClick: () => void;
    onRowClick: (id: string) => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = (props) => {
    const { orders, onRowClick, onViewAllOrdersClick } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    const orderList = orders
        ? orders.map((order) => ({
              ...order,
              paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
          }))
        : undefined;
    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Recent Orders",
                    id: "1LiVhv",
                    description: "section header",
                })}
                toolbar={
                    <Button variant="text" color="primary" onClick={onViewAllOrdersClick}>
                        <FormattedMessage
                            defaultMessage="View all orders"
                            id="3+990c"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage
                                defaultMessage="No. of Order"
                                id="nTF6tG"
                                description="number of order"
                            />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Date"
                                id="ri3kK9"
                                description="order placement date"
                            />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage
                                defaultMessage="Status"
                                id="pURrk1"
                                description="order status"
                            />
                        </TableCell>
                        <TableCell className={classes.textRight}>
                            <FormattedMessage
                                defaultMessage="Total"
                                id="taX/V3"
                                description="order total amount"
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderCollection(
                        orderList,
                        (order) => (
                            <TableRow
                                hover={!!order}
                                className={order ? classes.link : undefined}
                                onClick={order ? () => onRowClick(order.id) : undefined}
                                key={order ? order.id : "skeleton"}
                            >
                                <TableCell>
                                    {maybe(() => order.number) ? `#${order.number}` : <Skeleton />}
                                </TableCell>
                                <TableCell>
                                    {maybe(() => order.created) ? (
                                        <DateTime date={order.created} />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {maybe(() => order.paymentStatus.status) !== undefined ? (
                                        order.paymentStatus.status === null ? null : (
                                            <StatusLabel
                                                status={order.paymentStatus.status}
                                                label={order.paymentStatus.localized}
                                            />
                                        )
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell className={classes.textRight}>
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
                                <TableCell colSpan={6}>
                                    <FormattedMessage defaultMessage="No orders found" id="RlfqSV" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

CustomerOrders.displayName = "CustomerOrders";
export default CustomerOrders;

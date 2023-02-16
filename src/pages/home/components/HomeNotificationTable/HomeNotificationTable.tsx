// @ts-nocheck
import { Card, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { RequirePermissions, ResponsiveTable, Skeleton } from "@mzawadie/components";
import { UserPermissionProps } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { homeNotificationTableMessages as messages } from "./messages";

const useStyles = makeStyles(
    () => ({
        arrowIcon: {
            textAlign: "right",
            width: 100,
        },
        tableCard: {
            overflow: "hidden",
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "HomeNotificationTable" }
);

interface HomeNotificationTableProps extends UserPermissionProps {
    ordersToCapture: number;
    ordersToFulfill: number;
    productsOutOfStock: number;
    onCreateNewChannelClick: () => void;
    onOrdersToFulfillClick: () => void;
    onOrdersToCaptureClick: () => void;
    onProductsOutOfStockClick: () => void;
    noChannel: boolean;
}

const HomeNotificationTable: React.FC<HomeNotificationTableProps> = (props) => {
    const {
        onCreateNewChannelClick,
        onOrdersToCaptureClick,
        onOrdersToFulfillClick,
        onProductsOutOfStockClick,
        ordersToCapture,
        ordersToFulfill,
        productsOutOfStock,
        userPermissions,
        noChannel,
    } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card className={classes.tableCard}>
            <ResponsiveTable>
                <TableBody className={classes.tableRow}>
                    {noChannel && (
                        <RequirePermissions
                            userPermissions={userPermissions}
                            requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
                        >
                            <TableRow hover onClick={onCreateNewChannelClick}>
                                <TableCell>
                                    <Typography>
                                        {intl.formatMessage(messages.createNewChannel)}
                                    </Typography>
                                </TableCell>
                                <TableCell className={classes.arrowIcon}>
                                    <KeyboardArrowRight />
                                </TableCell>
                            </TableRow>
                        </RequirePermissions>
                    )}
                    <RequirePermissions
                        userPermissions={userPermissions}
                        requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
                    >
                        <TableRow hover onClick={onOrdersToFulfillClick}>
                            <TableCell data-test-id="orders-to-fulfill">
                                {ordersToFulfill === undefined ? (
                                    <Skeleton />
                                ) : ordersToFulfill === 0 ? (
                                    <Typography>{intl.formatMessage(messages.noOrders)}</Typography>
                                ) : (
                                    <Typography>
                                        {intl.formatMessage(messages.orderReady, {
                                            amount: <strong>{ordersToFulfill}</strong>,
                                        })}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell className={classes.arrowIcon}>
                                <KeyboardArrowRight />
                            </TableCell>
                        </TableRow>
                        <TableRow hover onClick={onOrdersToCaptureClick}>
                            <TableCell data-test-id="orders-to-capture">
                                {ordersToCapture === undefined ? (
                                    <Skeleton />
                                ) : ordersToCapture === 0 ? (
                                    <Typography>
                                        {intl.formatMessage(messages.noPaymentWaiting)}
                                    </Typography>
                                ) : (
                                    <Typography>
                                        {intl.formatMessage(messages.paymentCapture, {
                                            amount: <strong>{ordersToCapture}</strong>,
                                        })}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell className={classes.arrowIcon}>
                                <KeyboardArrowRight />
                            </TableCell>
                        </TableRow>
                    </RequirePermissions>
                    <RequirePermissions
                        userPermissions={userPermissions}
                        requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                    >
                        <TableRow hover onClick={onProductsOutOfStockClick}>
                            <TableCell data-test-id="products-out-of-stock">
                                {productsOutOfStock === undefined ? (
                                    <Skeleton />
                                ) : productsOutOfStock === 0 ? (
                                    <Typography>
                                        {intl.formatMessage(messages.noProductsOut)}
                                    </Typography>
                                ) : (
                                    <Typography>
                                        {intl.formatMessage(messages.productOut, {
                                            amount: <strong>{productsOutOfStock}</strong>,
                                        })}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell className={classes.arrowIcon}>
                                <KeyboardArrowRight />
                            </TableCell>
                        </TableRow>
                    </RequirePermissions>
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};
HomeNotificationTable.displayName = "HomeNotificationTable";
export default HomeNotificationTable;

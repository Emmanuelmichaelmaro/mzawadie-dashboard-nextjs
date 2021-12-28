// @ts-nocheck
import { Card, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import Money from "@mzawadie/components/Money";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TableCellAvatar from "@mzawadie/components/TableCellAvatar";
import { maybe, renderCollection } from "@mzawadie/core/misc";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Home_productTopToday_edges_node } from "../../types/Home";

const useStyles = makeStyles(
    (theme) => ({
        avatarProps: {
            height: 64,
            width: 64,
        },
        colAvatar: {
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(),
            paddingTop: theme.spacing(2),
            width: 112,
        },
        colName: {
            width: "auto",
        },
        label: {
            paddingLeft: 0,
        },
        noProducts: {
            paddingBottom: 20,
            paddingTop: 20,
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "HomeProductListCard" }
);

interface HomeProductListProps {
    testId?: string;
    topProducts: Home_productTopToday_edges_node[];
    onRowClick: (productId: string, variantId: string) => void;
}

export const HomeProductList: React.FC<HomeProductListProps> = (props) => {
    const { topProducts, onRowClick, testId } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card data-test-id={testId}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Top Products",
                    description: "header",
                    id: "rr8fyf",
                })}
            />
            <ResponsiveTable>
                <colgroup>
                    <col className={classes.colAvatar} />
                    <col className={classes.colName} />
                    <col />
                </colgroup>
                <TableBody>
                    {renderCollection(
                        topProducts,
                        (variant) => (
                            <TableRow
                                key={variant ? variant.id : "skeleton"}
                                hover={!!variant}
                                className={classNames({
                                    [classes.tableRow]: !!variant,
                                })}
                                onClick={
                                    variant
                                        ? () => onRowClick(variant.product.id, variant.id)
                                        : undefined
                                }
                            >
                                <TableCellAvatar
                                    className={classes.colAvatar}
                                    thumbnail={maybe(() => variant?.product?.thumbnail?.url)}
                                    avatarProps={classes.avatarProps}
                                />

                                <TableCell className={classes.label}>
                                    {variant ? (
                                        <>
                                            <Typography color="primary">
                                                {variant.product.name}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {maybe(() =>
                                                    variant.attributes
                                                        .map((attribute) => attribute.values[0]?.name)
                                                        .join(" / ")
                                                )}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                <FormattedMessage
                                                    defaultMessage="{amount, plural,one {One ordered}other {{amount} Ordered}}"
                                                    description="number of ordered products"
                                                    id="0opVvi"
                                                    values={{
                                                        amount: variant.quantityOrdered,
                                                    }}
                                                />
                                            </Typography>
                                        </>
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>

                                <TableCell>
                                    <Typography align="right">
                                        {maybe(
                                            () => (
                                                <Money money={variant?.revenue?.gross} />
                                            ),
                                            <Skeleton />
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={3} className={classes.noProducts}>
                                    <Typography>
                                        <FormattedMessage
                                            defaultMessage="No products found"
                                            id="Q1Uzbb"
                                        />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

HomeProductList.displayName = "HomeProductList";

export default HomeProductList;

// @ts-nocheck
import { Card, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Money } from "@mzawadie/components/Money";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { RelayToFlat, maybe, renderCollection } from "@mzawadie/core";
import { HomeQuery } from "@mzawadie/graphql";
import { productVariantEditUrl } from "@mzawadie/pages/products/urls";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    topProducts: RelayToFlat<HomeQuery["productTopToday"]>;
}

export const HomeProductList: React.FC<HomeProductListProps> = (props) => {
    const { topProducts, testId } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card data-test-id={testId}>
            <CardTitle
                title={intl.formatMessage({
                    id: "rr8fyf",
                    defaultMessage: "Top Products",
                    description: "header",
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
                            <TableRowLink
                                key={variant ? variant.id : "skeleton"}
                                hover={!!variant}
                                className={classNames({
                                    [classes.tableRow]: !!variant,
                                })}
                                href={productVariantEditUrl(variant.product.id, variant.id)}
                            >
                                <TableCellAvatar
                                    className={classes.colAvatar}
                                    thumbnail={maybe(() => variant.product.thumbnail.url)}
                                    avatarProps={classes.avatarProps}
                                />

                                <TableCell className={classes.label}>
                                    {variant ? (
                                        <>
                                            <Typography color={"primary"}>
                                                {variant.product.name}
                                            </Typography>

                                            <Typography color={"textSecondary"}>
                                                {maybe(() =>
                                                    variant.attributes
                                                        .map((attribute) => attribute.values[0].name)
                                                        .join(" / ")
                                                )}
                                            </Typography>

                                            <Typography color={"textSecondary"}>
                                                <FormattedMessage
                                                    id="0opVvi"
                                                    defaultMessage="{amount, plural,one {One ordered}other {{amount} Ordered}}"
                                                    description="number of ordered products"
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
                                    <Typography align={"right"}>
                                        {maybe(
                                            () => (
                                                <Money money={variant.revenue.gross} />
                                            ),
                                            <Skeleton />
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRowLink>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={3} className={classes.noProducts}>
                                    <Typography>
                                        <FormattedMessage
                                            id="Q1Uzbb"
                                            defaultMessage="No products found"
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

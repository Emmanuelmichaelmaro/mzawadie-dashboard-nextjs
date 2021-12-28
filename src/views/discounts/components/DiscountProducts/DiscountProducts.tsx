// @ts-nocheck
import {
    Button,
    Card,
    IconButton,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@mzawadie/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@mzawadie/components/ChannelsAvailabilityDropdown";
import Checkbox from "@mzawadie/components/Checkbox";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TableCellAvatar from "@mzawadie/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@mzawadie/components/TableCellAvatar/Avatar";
import TableHead from "@mzawadie/components/TableHead";
import TablePagination from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, ListProps } from "@mzawadie/core";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetails_sale } from "../../types/SaleDetails";
import { VoucherDetails_voucher } from "../../types/VoucherDetails";

export interface SaleProductsProps extends ListProps, ListActions {
    discount: SaleDetails_sale | VoucherDetails_voucher;
    channelsCount: number;
    onProductAssign: () => void;
    onProductUnassign: (id: string) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        colActions: {
            "&:last-child": {
                paddingRight: 0,
            },
            width: `calc(76px + ${theme.spacing(0.5)})`,
        },
        colName: {
            paddingLeft: 0,
            width: "auto",
        },
        colNameLabel: {
            marginLeft: `calc(${AVATAR_MARGIN}px + ${theme.spacing(3)})`,
        },
        colPublished: {
            width: 150,
        },
        colType: {
            width: 200,
        },
        table: {
            tableLayout: "fixed",
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "DiscountProducts" }
);

const numberOfColumns = 5;

const DiscountProducts: React.FC<SaleProductsProps> = (props) => {
    const {
        channelsCount,
        discount: sale,
        disabled,
        pageInfo,
        onRowClick,
        onPreviousPage,
        onProductAssign,
        onProductUnassign,
        onNextPage,
        isChecked,
        selected,
        toggle,
        toggleAll,
        toolbar,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Eligible Products",
                    id: "xqXYF+",
                    description: "section header",
                })}
                toolbar={
                    <Button color="primary" onClick={onProductAssign} data-test-id="assign-products">
                        <FormattedMessage
                            defaultMessage="Assign products"
                            id="U8eeLW"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <colgroup>
                    <col />
                    <col className={classes.colName} />
                    <col className={classes.colType} />
                    <col className={classes.colPublished} />
                    <col className={classes.colActions} />
                </colgroup>
                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={mapEdgesToItems(sale?.products)}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCell className={classes.colName}>
                        <span className={classes.colNameLabel}>
                            <FormattedMessage defaultMessage="Product Name" id="ZIc5lM" />
                        </span>
                    </TableCell>
                    <TableCell className={classes.colType}>
                        <FormattedMessage defaultMessage="Product Type" id="anK7jD" />
                    </TableCell>
                    <TableCell className={classes.colPublished}>
                        <FormattedMessage
                            defaultMessage="Availability"
                            id="Oe62bR"
                            description="product availability"
                        />
                    </TableCell>
                    <TableCell className={classes.colActions} />
                </TableHead>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={numberOfColumns}
                            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                            onNextPage={onNextPage}
                            hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                            onPreviousPage={onPreviousPage}
                        />
                    </TableRow>
                </TableFooter>
                <TableBody>
                    {renderCollection(
                        mapEdgesToItems(sale?.products),
                        (product) => {
                            const isSelected = product ? isChecked(product.id) : false;

                            return (
                                <TableRow
                                    hover={!!product}
                                    key={product ? product.id : "skeleton"}
                                    onClick={product && onRowClick(product.id)}
                                    className={classes.tableRow}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(product?.id)}
                                        />
                                    </TableCell>
                                    <TableCellAvatar
                                        className={classes.colName}
                                        thumbnail={maybe(() => product?.thumbnail?.url)}
                                    >
                                        {maybe<React.ReactNode>(() => product?.name, <Skeleton />)}
                                    </TableCellAvatar>
                                    <TableCell className={classes.colType}>
                                        {maybe<React.ReactNode>(
                                            () => product?.productType.name,
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colType}>
                                        {product && !product?.channelListings?.length ? (
                                            "-"
                                        ) : product?.channelListings !== undefined ? (
                                            <ChannelsAvailabilityDropdown
                                                allChannelsCount={channelsCount}
                                                channels={product?.channelListings}
                                            />
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colActions}>
                                        <IconButton
                                            disabled={!product || disabled}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onProductUnassign(product?.id);
                                            }}
                                        >
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage defaultMessage="No products found" id="Q1Uzbb" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

DiscountProducts.displayName = "DiscountProducts";

export default DiscountProducts;

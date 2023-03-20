// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { ChannelsAvailabilityDropdown } from "@mzawadie/components/ChannelsAvailabilityDropdown";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { MoneyRange } from "@mzawadie/components/MoneyRange";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@mzawadie/components/TableCellAvatar/Avatar";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import {
    ChannelProps,
    ListActions,
    ListProps,
    maybe,
    RelayToFlat,
    renderCollection,
} from "@mzawadie/core";
import { CategoryDetailsQuery } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colName: {
                width: "auto",
            },
            colPrice: {
                width: 300,
            },
            colPublished: {
                width: 200,
            },
            colType: {
                width: 200,
            },
        },
        colFill: {
            padding: 0,
            width: "100%",
        },
        colName: {},
        colNameHeader: {
            marginLeft: AVATAR_MARGIN,
        },
        colPrice: {
            textAlign: "right",
        },
        colPublished: {},
        colType: {},
        link: {
            cursor: "pointer",
        },
        table: {
            tableLayout: "fixed",
        },
        tableContainer: {
            overflowX: "scroll",
        },
        textLeft: {
            textAlign: "left",
        },
        textRight: {
            textAlign: "right",
        },
    }),
    {
        name: "CategoryProductList",
    }
);

interface CategoryProductListProps extends ListProps, ListActions, ChannelProps {
    channelsCount: number;
    products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
}

export const CategoryProductList: React.FC<CategoryProductListProps> = (props) => {
    const {
        channelsCount,
        disabled,
        isChecked,
        pageInfo,
        products,
        selected,
        toggle,
        toggleAll,
        toolbar,
        onNextPage,
        onPreviousPage,
        onRowClick,
        selectedChannelId,
    } = props;

    const classes = useStyles(props);

    const numberOfColumns = 5;

    return (
        <div className={classes.tableContainer}>
            <ResponsiveTable className={classes.table}>
                <colgroup>
                    <col />
                    <col className={classes.colName} />
                    <col className={classes.colType} />
                    <col className={classes.colPublished} />
                    <col className={classes.colPrice} />
                </colgroup>
                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={products}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCell className={classes.colName}>
                        <span className={classes.colNameHeader}>
                            <FormattedMessage defaultMessage="Name" id="VQLIXd" description="product" />
                        </span>
                    </TableCell>
                    <TableCell className={classes.colType}>
                        <FormattedMessage
                            defaultMessage="Type"
                            id="k+HcTv"
                            description="product type"
                        />
                    </TableCell>
                    <TableCell className={classes.colPublished}>
                        <FormattedMessage
                            defaultMessage="Availability"
                            id="c4fjY/"
                            description="availability status"
                        />
                    </TableCell>
                    <TableCell className={classes.colPrice}>
                        <FormattedMessage
                            defaultMessage="Price"
                            id="b810WJ"
                            description="product price"
                        />
                    </TableCell>
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
                        products,
                        (product) => {
                            const isSelected = product ? isChecked(product.id) : false;
                            const channel = product?.channelListings?.find(
                                (listing) => listing.channel.id === selectedChannelId
                            );

                            return (
                                <TableRow
                                    data-test-id="productRow"
                                    selected={isSelected}
                                    hover={!!product}
                                    key={product ? product.id : "skeleton"}
                                    onClick={product && onRowClick(product.id)}
                                    className={classes.link}
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
                                        {product ? product.name : <Skeleton />}
                                    </TableCellAvatar>
                                    <TableCell className={classes.colType}>
                                        {product && product.productType ? (
                                            product.productType.name
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colPublished}>
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
                                    <TableCell className={classes.colPrice}>
                                        {product?.channelListings ? (
                                            <MoneyRange
                                                from={channel?.pricing?.priceRange?.start?.net}
                                                to={channel?.pricing?.priceRange?.stop?.net}
                                            />
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
                                    <FormattedMessage defaultMessage="No products found" id="Q1Uzbb" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </div>
    );
};

CategoryProductList.displayName = "CategoryProductList";

export default CategoryProductList;

// @ts-nocheck
import { Card, TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@mzawadie/components/ChannelsAvailabilityDropdown";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@mzawadie/components/TableCellAvatar/Avatar";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, PageListProps } from "@mzawadie/core";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CollectionDetails_collection } from "../../types/CollectionDetails";

const useStyles = makeStyles(
    (theme) => ({
        colActions: {
            width: `calc(76px + ${theme.spacing(1)})`,
            marginRight: theme.spacing(-2),
        },
        colName: {
            paddingLeft: 0,
            width: "auto",
        },
        colNameLabel: {
            marginLeft: AVATAR_MARGIN,
        },
        colPublished: {
            width: 200,
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
    { name: "CollectionProducts" }
);

export interface CollectionProductsProps extends PageListProps, ListActions {
    collection: CollectionDetails_collection;
    onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
}

const CollectionProducts: React.FC<CollectionProductsProps> = (props) => {
    const {
        collection,
        disabled,
        onAdd,
        onNextPage,
        onPreviousPage,
        onProductUnassign,
        onRowClick,
        pageInfo,
        isChecked,
        selected,
        toggle,
        toggleAll,
        toolbar,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const products = mapEdgesToItems(collection?.products);
    const numberOfColumns = products?.length === 0 ? 4 : 5;

    return (
        <Card>
            <CardTitle
                title={
                    !!collection ? (
                        intl.formatMessage(
                            {
                                defaultMessage: "Products in {name}",
                                id: "/dnWE8",
                                description: "products in collection",
                            },
                            {
                                name: maybe(() => collection.name, "..."),
                            }
                        )
                    ) : (
                        <Skeleton />
                    )
                }
                toolbar={
                    <Button
                        data-test-id="add-product"
                        disabled={disabled}
                        variant="tertiary"
                        onClick={onAdd}
                    >
                        <FormattedMessage
                            defaultMessage="Assign product"
                            id="scHVdW"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable className={classes.table}>
                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={mapEdgesToItems(collection?.products)}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCell className={classes.colName}>
                        <span className={classes.colNameLabel}>
                            <FormattedMessage
                                defaultMessage="Name"
                                id="6AMFki"
                                description="product name"
                            />
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
                            hasNextPage={pageInfo?.hasNextPage}
                            onNextPage={onNextPage}
                            hasPreviousPage={pageInfo?.hasPreviousPage}
                            onPreviousPage={onPreviousPage}
                        />
                    </TableRow>
                </TableFooter>
                <TableBody>
                    {renderCollection(
                        products,
                        (product) => {
                            const isSelected = product ? isChecked(product.id) : false;

                            return (
                                <TableRow
                                    className={classes.tableRow}
                                    hover={!!product}
                                    onClick={!!product ? onRowClick(product.id) : undefined}
                                    key={product ? product.id : "skeleton"}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(product.id)}
                                        />
                                    </TableCell>
                                    <TableCellAvatar
                                        className={classes.colName}
                                        thumbnail={maybe(() => product.thumbnail.url)}
                                    >
                                        {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                                    </TableCellAvatar>
                                    <TableCell className={classes.colType}>
                                        {maybe<React.ReactNode>(
                                            () => product.productType.name,
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colType}>
                                        {product && !product?.channelListings?.length ? (
                                            "-"
                                        ) : product?.channelListings !== undefined ? (
                                            <ChannelsAvailabilityDropdown
                                                channels={product?.channelListings}
                                            />
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colActions}>
                                        <IconButton
                                            variant="secondary"
                                            disabled={!product}
                                            onClick={(event) => onProductUnassign(product.id, event)}
                                        >
                                            <DeleteIcon />
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

CollectionProducts.displayName = "CollectionProducts";

export default CollectionProducts;

// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow, Typography } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { ListActions, ListProps, SortPage, maybe, renderCollection } from "@mzawadie/core";
import { ProductTypeFragment } from "@mzawadie/graphql";
import { ProductTypeListUrlSortField } from "@mzawadie/pages/productTypes/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colName: {},
            colTax: {
                width: 300,
            },
            colType: {
                width: 300,
            },
        },
        colName: {
            paddingLeft: 0,
        },
        colTax: {},
        colType: {},
        link: {
            cursor: "pointer",
        },
    }),
    { name: "ProductTypeList" }
);

interface ProductTypeListProps extends ListProps, ListActions, SortPage<ProductTypeListUrlSortField> {
    productTypes: ProductTypeFragment[];
}

const numberOfColumns = 4;

const ProductTypeList: React.FC<ProductTypeListProps> = (props) => {
    const {
        disabled,
        productTypes,
        pageInfo,
        onNextPage,
        onPreviousPage,
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

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={productTypes}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        sort.sort === ProductTypeListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(ProductTypeListUrlSortField.name)}
                    className={classes.colName}
                >
                    <FormattedMessage
                        defaultMessage="Type Name"
                        id="hHOI7D"
                        description="product type name"
                    />
                </TableCellHeader>
                <TableCellHeader
                    direction={
                        sort.sort === ProductTypeListUrlSortField.digital
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    onClick={() => onSort(ProductTypeListUrlSortField.digital)}
                    className={classes.colType}
                >
                    <FormattedMessage
                        defaultMessage="Type"
                        id="jyTwDR"
                        description="product type is either simple or configurable"
                    />
                </TableCellHeader>
                <TableCell className={classes.colTax}>
                    <FormattedMessage
                        defaultMessage="Tax"
                        id="TalJlD"
                        description="tax rate for a product type"
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
                    productTypes,
                    (productType) => {
                        const isSelected = productType ? isChecked(productType.id) : false;
                        return (
                            <TableRow
                                className={productType ? classes.link : undefined}
                                hover={!!productType}
                                key={productType ? productType.id : "skeleton"}
                                onClick={productType ? onRowClick(productType.id) : undefined}
                                selected={isSelected}
                                data-test="id"
                                data-test-id={maybe(() => productType?.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(productType?.id)}
                                    />
                                </TableCell>
                                <TableCell className={classes.colName}>
                                    {productType ? (
                                        <>
                                            <span data-test="name">{productType.name}</span>
                                            <Typography variant="caption">
                                                {maybe(() => productType.hasVariants)
                                                    ? intl.formatMessage({
                                                          defaultMessage: "Configurable",
                                                          id: "X90t9n",
                                                          description: "product type",
                                                      })
                                                    : intl.formatMessage({
                                                          defaultMessage: "Simple product",
                                                          id: "yNb+dT",
                                                          description: "product type",
                                                      })}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell className={classes.colType}>
                                    {maybe(() => productType?.isShippingRequired) !== undefined ? (
                                        productType?.isShippingRequired ? (
                                            <>
                                                <FormattedMessage
                                                    defaultMessage="Physical"
                                                    id="ADTNND"
                                                    description="product type"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FormattedMessage
                                                    defaultMessage="Digital"
                                                    id="asdvmK"
                                                    description="product type"
                                                />
                                            </>
                                        )
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell className={classes.colTax}>
                                    {maybe(() => productType?.taxType) ? (
                                        productType?.taxType?.description
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
                                <FormattedMessage defaultMessage="No product types found" id="0nLsyM" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

ProductTypeList.displayName = "ProductTypeList";

export default ProductTypeList;

// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow, Typography } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { maybe, renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, SortPage } from "@mzawadie/core";
import { ProductTypeFragment } from "@mzawadie/graphql";
import { ProductTypeListUrlSortField, productTypeUrl } from "@mzawadie/pages/productTypes/urls";
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
    const { disabled, productTypes, onSort, isChecked, selected, sort, toggle, toggleAll, toolbar } =
        props;

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
                        id="hHOI7D"
                        defaultMessage="Type Name"
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
                        id="jyTwDR"
                        defaultMessage="Type"
                        description="product type is either simple or configurable"
                    />
                </TableCellHeader>

                <TableCell className={classes.colTax}>
                    <FormattedMessage
                        id="TalJlD"
                        defaultMessage="Tax"
                        description="tax rate for a product type"
                    />
                </TableCell>
            </TableHead>

            <TableFooter>
                <TableRow>
                    <TablePaginationWithContext colSpan={numberOfColumns} />
                </TableRow>
            </TableFooter>

            <TableBody>
                {renderCollection(
                    productTypes,
                    (productType) => {
                        const isSelected = productType ? isChecked(productType.id) : false;
                        return (
                            <TableRowLink
                                className={!!productType ? classes.link : undefined}
                                hover={!!productType}
                                key={productType ? productType.id : "skeleton"}
                                href={productType && productTypeUrl(productType.id)}
                                selected={isSelected}
                                data-test-id={"id-" + maybe(() => productType.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(productType.id)}
                                    />
                                </TableCell>

                                <TableCell className={classes.colName}>
                                    {productType ? (
                                        <>
                                            <span data-test-id="name">{productType.name}</span>
                                            <Typography variant="caption">
                                                {maybe(() => productType.hasVariants)
                                                    ? intl.formatMessage({
                                                          id: "X90t9n",
                                                          defaultMessage: "Configurable",
                                                          description: "product type",
                                                      })
                                                    : intl.formatMessage({
                                                          id: "yNb+dT",
                                                          defaultMessage: "Simple product",
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
                                                    id="ADTNND"
                                                    defaultMessage="Physical"
                                                    description="product type"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FormattedMessage
                                                    id="asdvmK"
                                                    defaultMessage="Digital"
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
                            </TableRowLink>
                        );
                    },
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage id="0nLsyM" defaultMessage="No product types found" />
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

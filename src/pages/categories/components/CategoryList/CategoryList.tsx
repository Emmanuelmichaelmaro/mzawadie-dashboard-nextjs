// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, ListProps, SortPage } from "@mzawadie/core";
import { CategoryFragment } from "@mzawadie/fragments/types/CategoryFragment";
import { CategoryListUrlSortField } from "@mzawadie/pages/categories/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colName: {
                width: "auto",
            },
            colProducts: {
                width: 160,
            },
            colSubcategories: {
                width: 160,
            },
        },
        colName: {
            paddingLeft: 0,
        },
        colProducts: {
            textAlign: "center",
        },
        colSubcategories: {
            textAlign: "center",
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "CategoryList" }
);

interface CategoryListProps extends ListProps, ListActions, SortPage<CategoryListUrlSortField> {
    categories?: CategoryFragment[];
    isRoot: boolean;
    onAdd?: () => void;
}

const numberOfColumns = 4;

const CategoryList: React.FC<CategoryListProps> = (props) => {
    const {
        categories,
        disabled,
        settings,
        sort,
        pageInfo,
        isChecked,
        isRoot,
        selected,
        toggle,
        toggleAll,
        toolbar,
        onNextPage,
        onPreviousPage,
        onUpdateListSettings,
        onRowClick,
        onSort,
    } = props;

    const classes = useStyles(props);

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={categories}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        isRoot && sort.sort === CategoryListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    className={classes.colName}
                    disabled={!isRoot}
                    onClick={() => isRoot && onSort(CategoryListUrlSortField.name)}
                >
                    <FormattedMessage defaultMessage="Category Name" id="vEYtiq" />
                </TableCellHeader>
                <TableCellHeader
                    direction={
                        isRoot && sort.sort === CategoryListUrlSortField.subcategoryCount
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    className={classes.colSubcategories}
                    disabled={!isRoot}
                    onClick={() => isRoot && onSort(CategoryListUrlSortField.subcategoryCount)}
                >
                    <FormattedMessage
                        defaultMessage="Subcategories"
                        id="BHQrgz"
                        description="number of subcategories"
                    />
                </TableCellHeader>
                <TableCellHeader
                    direction={
                        isRoot && sort.sort === CategoryListUrlSortField.productCount
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    className={classes.colProducts}
                    disabled={!isRoot}
                    onClick={() => isRoot && onSort(CategoryListUrlSortField.productCount)}
                >
                    <FormattedMessage
                        defaultMessage="No. of Products"
                        id="k8ZJ5L"
                        description="number of products"
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
                    categories,
                    (category) => {
                        const isSelected = category ? isChecked(category.id) : false;

                        return (
                            <TableRow
                                className={classes.tableRow}
                                hover={!!category}
                                onClick={category ? onRowClick(category.id) : undefined}
                                key={category ? category.id : "skeleton"}
                                selected={isSelected}
                                data-test="id"
                                data-test-id={maybe(() => category?.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(category?.id)}
                                    />
                                </TableCell>
                                <TableCell className={classes.colName} data-test="name">
                                    {category && category.name ? category.name : <Skeleton />}
                                </TableCell>
                                <TableCell className={classes.colSubcategories}>
                                    {category &&
                                    category.children &&
                                    category.children.totalCount !== undefined ? (
                                        category.children.totalCount
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell className={classes.colProducts}>
                                    {category &&
                                    category.products &&
                                    category.products.totalCount !== undefined ? (
                                        category.products.totalCount
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
                                {isRoot ? (
                                    <FormattedMessage
                                        defaultMessage="No categories found"
                                        id="dM86a2"
                                    />
                                ) : (
                                    <FormattedMessage
                                        defaultMessage="No subcategories found"
                                        id="rrbzZt"
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

CategoryList.displayName = "CategoryList";
export default CategoryList;

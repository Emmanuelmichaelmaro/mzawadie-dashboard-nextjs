// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { maybe, renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, SortPage } from "@mzawadie/core";
import { CategoryFragment } from "@mzawadie/graphql";
import { CategoryListUrlSortField, categoryUrl } from "@mzawadie/pages/categories/urls";
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
}

const CategoryList: React.FC<CategoryListProps> = (props) => {
    const {
        categories,
        disabled,
        settings,
        sort,
        isChecked,
        isRoot,
        selected,
        toggle,
        toggleAll,
        toolbar,
        onUpdateListSettings,
        onSort,
    } = props;

    const classes = useStyles(props);
    const numberOfColumns = categories?.length === 0 ? 3 : 4;

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
                    <FormattedMessage id="vEYtiq" defaultMessage="Category Name" />
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
                        id="BHQrgz"
                        defaultMessage="Subcategories"
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
                        id="k8ZJ5L"
                        defaultMessage="No. of Products"
                        description="number of products"
                    />
                </TableCellHeader>
            </TableHead>

            <TableFooter>
                <TableRow>
                    <TablePaginationWithContext
                        colSpan={numberOfColumns}
                        settings={settings}
                        onUpdateListSettings={onUpdateListSettings}
                    />
                </TableRow>
            </TableFooter>

            <TableBody>
                {renderCollection(
                    categories,
                    (category) => {
                        const isSelected = category ? isChecked(category.id) : false;

                        return (
                            <TableRowLink
                                className={classes.tableRow}
                                hover={!!category}
                                href={category && categoryUrl(category.id)}
                                key={category ? category.id : "skeleton"}
                                selected={isSelected}
                                data-test-id={"id-" + maybe(() => category.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(category.id)}
                                    />
                                </TableCell>

                                <TableCell className={classes.colName} data-test-id="name">
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
                            </TableRowLink>
                        );
                    },
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                {isRoot ? (
                                    <FormattedMessage
                                        id="dM86a2"
                                        defaultMessage="No categories found"
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="rrbzZt"
                                        defaultMessage="No subcategories found"
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

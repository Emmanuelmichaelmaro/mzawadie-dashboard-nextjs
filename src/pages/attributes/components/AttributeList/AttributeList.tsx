// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import {
    translateBoolean,
    maybe,
    renderCollection,
    ListActions,
    ListProps,
    SortPage,
} from "@mzawadie/core";
import { AttributeListUrlSortField } from "@mzawadie/pages/attributes/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributeList_attributes_edges_node } from "../../types/AttributeList";

export interface AttributeListProps
    extends ListProps,
        ListActions,
        SortPage<AttributeListUrlSortField> {
    attributes: AttributeList_attributes_edges_node[];
}

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colFaceted: {
                width: 180,
            },
            colName: {
                width: "auto",
            },
            colSearchable: {
                width: 180,
            },
            colSlug: {
                width: 200,
            },
            colVisible: {
                width: 180,
            },
        },
        colFaceted: {
            textAlign: "center",
        },
        colName: {},
        colSearchable: {
            textAlign: "center",
        },
        colSlug: {
            paddingLeft: 0,
        },
        colVisible: {
            textAlign: "center",
        },
        link: {
            cursor: "pointer",
        },
    }),
    { name: "AttributeList" }
);

const numberOfColumns = 6;

const AttributeList: React.FC<AttributeListProps> = ({
    attributes,
    disabled,
    isChecked,
    onNextPage,
    onPreviousPage,
    onRowClick,
    pageInfo,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
    onSort,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={attributes}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    className={classes.colSlug}
                    direction={
                        sort.sort === AttributeListUrlSortField.slug
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(AttributeListUrlSortField.slug)}
                >
                    <FormattedMessage defaultMessage="Attribute Code" id="oJkeS6" />
                </TableCellHeader>
                <TableCellHeader
                    className={classes.colName}
                    direction={
                        sort.sort === AttributeListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    onClick={() => onSort(AttributeListUrlSortField.name)}
                >
                    <FormattedMessage
                        defaultMessage="Default Label"
                        id="HjUoHK"
                        description="attribute's label'"
                    />
                </TableCellHeader>
                <TableCellHeader
                    className={classes.colVisible}
                    direction={
                        sort.sort === AttributeListUrlSortField.visible
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="center"
                    onClick={() => onSort(AttributeListUrlSortField.visible)}
                >
                    <FormattedMessage
                        defaultMessage="Visible"
                        id="k6WDZl"
                        description="attribute is visible"
                    />
                </TableCellHeader>
                <TableCellHeader
                    className={classes.colSearchable}
                    direction={
                        sort.sort === AttributeListUrlSortField.searchable
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="center"
                    onClick={() => onSort(AttributeListUrlSortField.searchable)}
                >
                    <FormattedMessage
                        defaultMessage="Searchable"
                        id="yKuba7"
                        description="attribute can be searched in dashboard"
                    />
                </TableCellHeader>
                <TableCellHeader
                    className={classes.colFaceted}
                    direction={
                        sort.sort === AttributeListUrlSortField.useInFacetedSearch
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="center"
                    onClick={() => onSort(AttributeListUrlSortField.useInFacetedSearch)}
                >
                    <FormattedMessage
                        defaultMessage="Use in faceted search"
                        id="cbPfB1"
                        description="attribute can be searched in storefront"
                    />
                </TableCellHeader>
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
                    attributes,
                    (attribute) => {
                        const isSelected = attribute ? isChecked(attribute.id) : false;

                        return (
                            <TableRow
                                selected={isSelected}
                                hover={!!attribute}
                                key={attribute ? attribute.id : "skeleton"}
                                onClick={attribute && onRowClick(attribute.id)}
                                className={classes.link}
                                data-test="id"
                                data-test-id={maybe(() => attribute?.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(attribute?.id)}
                                    />
                                </TableCell>
                                <TableCell className={classes.colSlug} data-test="slug">
                                    {attribute ? attribute.slug : <Skeleton />}
                                </TableCell>
                                <TableCell className={classes.colName} data-test="name">
                                    {attribute ? attribute.name : <Skeleton />}
                                </TableCell>
                                <TableCell
                                    className={classes.colVisible}
                                    data-test="visible"
                                    data-test-visible={maybe(() => attribute?.visibleInStorefront)}
                                >
                                    {attribute ? (
                                        translateBoolean(attribute.visibleInStorefront, intl)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell
                                    className={classes.colSearchable}
                                    data-test="searchable"
                                    data-test-searchable={maybe(() => attribute?.filterableInDashboard)}
                                >
                                    {attribute ? (
                                        translateBoolean(attribute.filterableInDashboard, intl)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell
                                    className={classes.colFaceted}
                                    data-test="use-in-faceted-search"
                                    data-test-use-in-faceted-search={maybe(
                                        () => attribute?.filterableInStorefront
                                    )}
                                >
                                    {attribute ? (
                                        translateBoolean(attribute.filterableInStorefront, intl)
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
                                <FormattedMessage defaultMessage="No attributes found" id="ztQgD8" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

AttributeList.displayName = "AttributeList";

export default AttributeList;
// @ts-nocheck
import { Card, TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { StatusLabel } from "@mzawadie/components/StatusLabel";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, ListProps, SortPage } from "@mzawadie/core";
import { PageListUrlSortField } from "@mzawadie/pages/pages/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageList_pages_edges_node } from "../../types/PageList";

export interface PageListProps extends ListProps, ListActions, SortPage<PageListUrlSortField> {
    pages: PageList_pages_edges_node[];
}

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colSlug: {
                width: 250,
            },
            colTitle: {},
            colVisibility: {
                width: 200,
            },
        },
        colSlug: {},
        colTitle: {
            paddingLeft: 0,
        },
        colVisibility: {},
        link: {
            cursor: "pointer",
        },
    }),
    { name: "PageList" }
);

const numberOfColumns = 4;

const PageList: React.FC<PageListProps> = (props) => {
    const {
        settings,
        pages,
        disabled,
        onNextPage,
        pageInfo,
        onRowClick,
        onSort,
        onUpdateListSettings,
        onPreviousPage,
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
        <Card>
            <ResponsiveTable>
                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={pages}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCellHeader
                        direction={
                            sort.sort === PageListUrlSortField.title
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(PageListUrlSortField.title)}
                        className={classes.colTitle}
                    >
                        <FormattedMessage
                            defaultMessage="Title"
                            id="V2+HTM"
                            description="dialog header"
                        />
                    </TableCellHeader>
                    <TableCellHeader
                        direction={
                            sort.sort === PageListUrlSortField.slug
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(PageListUrlSortField.slug)}
                        className={classes.colSlug}
                    >
                        <FormattedMessage
                            defaultMessage="Slug"
                            id="I8dAAe"
                            description="page internal name"
                        />
                    </TableCellHeader>
                    <TableCellHeader
                        direction={
                            sort.sort === PageListUrlSortField.visible
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(PageListUrlSortField.visible)}
                        className={classes.colVisibility}
                    >
                        <FormattedMessage
                            defaultMessage="Visibility"
                            id="5GSYCR"
                            description="page status"
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
                        pages,
                        (page) => {
                            const isSelected = page ? isChecked(page.id) : false;

                            return (
                                <TableRow
                                    hover={!!page}
                                    className={page ? classes.link : undefined}
                                    onClick={page ? onRowClick(page.id) : undefined}
                                    key={page ? page.id : "skeleton"}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(page.id)}
                                        />
                                    </TableCell>
                                    <TableCellHeader className={classes.colTitle}>
                                        {maybe<React.ReactNode>(() => page.title, <Skeleton />)}
                                    </TableCellHeader>
                                    <TableCellHeader className={classes.colSlug}>
                                        {maybe<React.ReactNode>(() => page.slug, <Skeleton />)}
                                    </TableCellHeader>
                                    <TableCellHeader className={classes.colVisibility}>
                                        {maybe<React.ReactNode>(
                                            () => (
                                                <StatusLabel
                                                    label={
                                                        page.isPublished
                                                            ? intl.formatMessage({
                                                                  defaultMessage: "Published",
                                                                  id: "G1KzEx",
                                                                  description: "page status",
                                                              })
                                                            : intl.formatMessage({
                                                                  defaultMessage: "Not Published",
                                                                  id: "UN3qWD",
                                                                  description: "page status",
                                                              })
                                                    }
                                                    status={page.isPublished ? "success" : "error"}
                                                />
                                            ),
                                            <Skeleton />
                                        )}
                                    </TableCellHeader>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage defaultMessage="No pages found" id="iMJka8" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

PageList.displayName = "PageList";

export default PageList;

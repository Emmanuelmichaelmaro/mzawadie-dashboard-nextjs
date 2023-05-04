// @ts-nocheck
import { Card, TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { maybe, renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, SortPage } from "@mzawadie/core";
import { PageFragment } from "@mzawadie/graphql";
import { PageListUrlSortField, pageUrl } from "@mzawadie/pages/pages/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PageListProps extends ListProps, ListActions, SortPage<PageListUrlSortField> {
    pages: PageFragment[];
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
        onSort,
        onUpdateListSettings,
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
                            id="V2+HTM"
                            defaultMessage="Title"
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
                            id="I8dAAe"
                            defaultMessage="Slug"
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
                            id="5GSYCR"
                            defaultMessage="Visibility"
                            description="page status"
                        />
                    </TableCellHeader>
                </TableHead>

                <TableFooter>
                    <TableRow>
                        <TablePaginationWithContext
                            colSpan={numberOfColumns}
                            settings={settings}
                            disabled={disabled}
                            onUpdateListSettings={onUpdateListSettings}
                        />
                    </TableRow>
                </TableFooter>

                <TableBody>
                    {renderCollection(
                        pages,
                        (page) => {
                            const isSelected = page ? isChecked(page.id) : false;

                            return (
                                <TableRowLink
                                    hover={!!page}
                                    className={!!page ? classes.link : undefined}
                                    href={page && pageUrl(page.id)}
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

                                    <TableCell className={classes.colTitle}>
                                        {maybe<React.ReactNode>(() => page.title, <Skeleton />)}
                                    </TableCell>

                                    <TableCell className={classes.colSlug}>
                                        {maybe<React.ReactNode>(() => page.slug, <Skeleton />)}
                                    </TableCell>

                                    <TableCell className={classes.colVisibility}>
                                        {maybe<React.ReactNode>(
                                            () => (
                                                <Pill
                                                    label={
                                                        page.isPublished
                                                            ? intl.formatMessage({
                                                                  id: "G1KzEx",
                                                                  defaultMessage: "Published",
                                                                  description: "page status",
                                                              })
                                                            : intl.formatMessage({
                                                                  id: "UN3qWD",
                                                                  defaultMessage: "Not Published",
                                                                  description: "page status",
                                                              })
                                                    }
                                                    color={page.isPublished ? "success" : "error"}
                                                />
                                            ),
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                </TableRowLink>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage id="iMJka8" defaultMessage="No pages found" />
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

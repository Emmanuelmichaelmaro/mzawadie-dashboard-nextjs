// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { renderCollection, ListActions, ListProps, SortPage } from "@mzawadie/core";
import { PageTypeFragment } from "@mzawadie/graphql";
import { PageTypeListUrlSortField } from "@mzawadie/pages/pageTypes/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    {
        colName: {
            paddingLeft: 0,
        },
        link: {
            cursor: "pointer",
        },
    },
    { name: "PageTypeList" }
);

interface PageTypeListProps extends ListProps, ListActions, SortPage<PageTypeListUrlSortField> {
    pageTypes: PageTypeFragment[];
}

const numberOfColumns = 2;

const PageTypeList: React.FC<PageTypeListProps> = (props) => {
    const {
        disabled,
        pageTypes,
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

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={pageTypes}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        sort.sort === PageTypeListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(PageTypeListUrlSortField.name)}
                    className={classes.colName}
                >
                    <FormattedMessage
                        defaultMessage="Content Type Name"
                        id="BQ2NVl"
                        description="page type name"
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
                    pageTypes,
                    (pageType) => {
                        const isSelected = pageType ? isChecked(pageType.id) : false;
                        return (
                            <TableRow
                                className={pageType ? classes.link : undefined}
                                hover={!!pageType}
                                key={pageType ? pageType.id : "skeleton"}
                                onClick={pageType ? onRowClick(pageType.id) : undefined}
                                selected={isSelected}
                                data-test="id"
                                data-test-id={pageType?.id}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(pageType?.id)}
                                    />
                                </TableCell>
                                <TableCell className={classes.colName}>
                                    {pageType ? (
                                        <span data-test="name">{pageType?.name}</span>
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
                                <FormattedMessage defaultMessage="No page types found" id="6fORLY" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

PageTypeList.displayName = "PageTypeList";

export default PageTypeList;

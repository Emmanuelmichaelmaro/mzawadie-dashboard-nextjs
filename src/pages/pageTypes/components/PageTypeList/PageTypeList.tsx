// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, SortPage } from "@mzawadie/core";
import { PageTypeFragment } from "@mzawadie/graphql";
import { PageTypeListUrlSortField, pageTypeUrl } from "@mzawadie/pages/pageTypes/urls";
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

const PageTypeList: React.FC<PageTypeListProps> = (props) => {
    const { disabled, pageTypes, onSort, isChecked, selected, sort, toggle, toggleAll, toolbar } =
        props;
    const classes = useStyles(props);
    const numberOfColumns = pageTypes?.length === 0 ? 1 : 2;

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
                        id="BQ2NVl"
                        defaultMessage="Content Type Name"
                        description="page type name"
                    />
                </TableCellHeader>
            </TableHead>

            <TableFooter>
                <TableRow>
                    <TablePaginationWithContext colSpan={numberOfColumns} disabled={disabled} />
                </TableRow>
            </TableFooter>

            <TableBody>
                {renderCollection(
                    pageTypes,
                    (pageType) => {
                        const isSelected = pageType ? isChecked(pageType.id) : false;
                        return (
                            <TableRowLink
                                className={!!pageType ? classes.link : undefined}
                                hover={!!pageType}
                                key={pageType ? pageType.id : "skeleton"}
                                href={pageType && pageTypeUrl(pageType.id)}
                                selected={isSelected}
                                data-test-id={"id-" + pageType?.id}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(pageType.id)}
                                    />
                                </TableCell>

                                <TableCell className={classes.colName}>
                                    {pageType ? (
                                        <span data-test-id="name">{pageType.name}</span>
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
                                <FormattedMessage id="6fORLY" defaultMessage="No page types found" />
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

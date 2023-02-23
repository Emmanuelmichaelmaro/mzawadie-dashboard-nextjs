// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { Date } from "@mzawadie/components/Date";
import { Money } from "@mzawadie/components/Money";
import { Percent } from "@mzawadie/components/Percent";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { TooltipTableCellHeader } from "@mzawadie/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@mzawadie/components/TooltipTableCellHeader/messages";
import {
    maybe,
    renderCollection,
    ChannelProps,
    ListActions,
    ListProps,
    SortPage,
} from "@mzawadie/core";
import { SaleListUrlSortField } from "@mzawadie/pages/discounts/urls";
import { canBeSorted } from "@mzawadie/pages/discounts/views/SaleList/sort";
import { SaleType } from "@mzawadie/types/globalTypes";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleList_sales_edges_node } from "../../types/SaleList";

export interface SaleListProps
    extends ListProps,
        ListActions,
        SortPage<SaleListUrlSortField>,
        ChannelProps {
    sales: SaleList_sales_edges_node[];
}

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colEnd: {
                width: 250,
            },
            colName: {},
            colStart: {
                width: 250,
            },
            colValue: {
                width: 200,
            },
        },
        colEnd: {
            textAlign: "right",
        },
        colName: {
            paddingLeft: 0,
        },
        colStart: {
            textAlign: "right",
        },
        colValue: {
            textAlign: "right",
        },
        tableRow: {
            cursor: "pointer",
        },
        textOverflow: {
            textOverflow: "ellipsis",
            overflow: "hidden",
        },
    }),
    { name: "SaleList" }
);

const SaleList: React.FC<SaleListProps> = (props) => {
    const {
        settings,
        disabled,
        onNextPage,
        onPreviousPage,
        onUpdateListSettings,
        onRowClick,
        onSort,
        pageInfo,
        sales,
        selectedChannelId,
        isChecked,
        selected,
        sort,
        toggle,
        toggleAll,
        toolbar,
        filterDependency,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const numberOfColumns = sales?.length === 0 ? 4 : 5;

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={sales}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        sort.sort === SaleListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(SaleListUrlSortField.name)}
                    className={classes.colName}
                >
                    <FormattedMessage defaultMessage="Name" id="F56hOz" description="sale name" />
                </TableCellHeader>
                <TableCellHeader
                    direction={
                        sort.sort === SaleListUrlSortField.startDate
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="right"
                    onClick={() => onSort(SaleListUrlSortField.startDate)}
                    className={classes.colStart}
                >
                    <FormattedMessage
                        defaultMessage="Starts"
                        id="iBSq6l"
                        description="sale start date"
                    />
                </TableCellHeader>
                <TableCellHeader
                    direction={
                        sort.sort === SaleListUrlSortField.endDate
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="right"
                    onClick={() => onSort(SaleListUrlSortField.endDate)}
                    className={classes.colEnd}
                >
                    <FormattedMessage defaultMessage="Ends" id="giF5UV" description="sale end date" />
                </TableCellHeader>
                <TooltipTableCellHeader
                    direction={
                        sort.sort === SaleListUrlSortField.value
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    textAlign="right"
                    onClick={() => onSort(SaleListUrlSortField.value)}
                    disabled={!canBeSorted(SaleListUrlSortField.value, !!selectedChannelId)}
                    tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
                        filterName: filterDependency?.label,
                    })}
                    className={classes.colValue}
                >
                    <FormattedMessage defaultMessage="Value" id="XZR590" description="sale value" />
                </TooltipTableCellHeader>
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
                    sales,
                    (sale) => {
                        const isSelected = sale ? isChecked(sale.id) : false;
                        const channel = sale?.channelListings?.find(
                            (lisiting) => lisiting.channel.id === selectedChannelId
                        );
                        return (
                            <TableRow
                                className={!!sale ? classes.tableRow : undefined}
                                hover={!!sale}
                                key={sale ? sale.id : "skeleton"}
                                onClick={sale ? onRowClick(sale.id) : undefined}
                                selected={isSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(sale.id)}
                                    />
                                </TableCell>
                                <TableCell
                                    className={classNames(classes.colName, classes.textOverflow)}
                                >
                                    {maybe<React.ReactNode>(() => sale.name, <Skeleton />)}
                                </TableCell>
                                <TableCell className={classes.colStart}>
                                    {sale && sale.startDate ? (
                                        <Date date={sale.startDate} />
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell className={classes.colEnd}>
                                    {sale && sale.endDate ? (
                                        <Date date={sale.endDate} />
                                    ) : sale && sale.endDate === null ? (
                                        "-"
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell
                                    className={classes.colValue}
                                    onClick={sale ? onRowClick(sale.id) : undefined}
                                >
                                    {sale?.type && channel?.discountValue ? (
                                        sale.type === SaleType.FIXED ? (
                                            <Money
                                                money={{
                                                    amount: channel.discountValue,
                                                    currency: channel.currency,
                                                }}
                                            />
                                        ) : channel?.discountValue ? (
                                            <Percent amount={channel.discountValue} />
                                        ) : (
                                            "-"
                                        )
                                    ) : sale && !channel ? (
                                        "_"
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
                                <FormattedMessage defaultMessage="No sales found" id="51HE+Q" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

SaleList.displayName = "SaleList";

export default SaleList;

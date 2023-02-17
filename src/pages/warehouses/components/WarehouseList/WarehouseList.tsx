// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IconButton, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { ListProps, SortPage, maybe, renderCollection, stopPropagation } from "@mzawadie/core";
import { WarehouseWithShippingFragment } from "@mzawadie/fragments/types/WarehouseWithShippingFragment";
import { WarehouseListUrlSortField } from "@mzawadie/pages/warehouses/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { DeleteIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colActions: {
                width: 160,
            },
            colName: {
                width: 400,
            },
            colZones: {
                width: "auto",
            },
        },
        actions: {
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            right: theme.spacing(-2),
        },
        colActions: {
            textAlign: "right",
        },
        colName: {
            paddingLeft: 0,
        },
        colZones: {
            paddingLeft: 0,
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "WarehouseList" }
);

interface WarehouseListProps extends ListProps, SortPage<WarehouseListUrlSortField> {
    warehouses: WarehouseWithShippingFragment[];
    onAdd: () => void;
    onRemove: (id: string) => void;
}

const numberOfColumns = 3;

const WarehouseList: React.FC<WarehouseListProps> = (props) => {
    const {
        warehouses,
        disabled,
        settings,
        sort,
        pageInfo,
        onNextPage,
        onPreviousPage,
        onUpdateListSettings,
        onRemove,
        onRowClick,
        onSort,
    } = props;

    const classes = useStyles(props);

    return (
        <ResponsiveTable data-test="warehouseList">
            <TableHead>
                <TableRow>
                    <TableCellHeader
                        direction={
                            sort.sort === WarehouseListUrlSortField.name
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        className={classes.colName}
                        onClick={() => onSort(WarehouseListUrlSortField.name)}
                    >
                        <FormattedMessage defaultMessage="Name" id="aCJwVq" description="warehouse" />
                    </TableCellHeader>
                    <TableCell className={classes.colZones}>
                        <FormattedMessage defaultMessage="Shipping Zones" id="PFXGaR" />
                    </TableCell>
                    <TableCell className={classes.colActions}>
                        <FormattedMessage defaultMessage="Actions" id="wL7VAE" />
                    </TableCell>
                </TableRow>
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
                    warehouses,
                    (warehouse) => (
                        <TableRow
                            className={classes.tableRow}
                            hover={!!warehouse}
                            onClick={warehouse ? onRowClick(warehouse.id) : undefined}
                            key={warehouse ? warehouse.id : "skeleton"}
                            data-test="warehouseEntry"
                            data-testid={warehouse?.name.toLowerCase().replace(" ", "")}
                        >
                            <TableCell className={classes.colName} data-test="name">
                                {maybe<React.ReactNode>(() => warehouse.name, <Skeleton />)}
                            </TableCell>
                            <TableCell className={classes.colZones} data-test="zones">
                                {warehouse?.shippingZones === undefined ? (
                                    <Skeleton />
                                ) : (
                                    mapEdgesToItems(warehouse?.shippingZones)
                                        ?.map(({ name }) => name)
                                        .join(", ") || "-"
                                )}
                            </TableCell>
                            <TableCell className={classes.colActions}>
                                <div className={classes.actions}>
                                    <IconButton color="primary" data-test="editButton">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={stopPropagation(() => onRemove(warehouse.id))}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ),
                    () => (
                        <TableRow data-test="emptyListMessage">
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage defaultMessage="No warehouses found" id="2gsiR1" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

WarehouseList.displayName = "WarehouseList";
export default WarehouseList;

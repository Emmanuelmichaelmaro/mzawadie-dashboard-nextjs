// @ts-nocheck
import {
    Button,
    Card,
    IconButton,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@mzawadie/components/CardTitle";
import Checkbox from "@mzawadie/components/Checkbox";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TableHead from "@mzawadie/components/TableHead";
import TablePagination from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, ListProps } from "@mzawadie/core";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetails_sale } from "../../types/SaleDetails";
import { VoucherDetails_voucher } from "../../types/VoucherDetails";

export interface DiscountCollectionsProps extends ListProps, ListActions {
    discount: SaleDetails_sale | VoucherDetails_voucher;
    onCollectionAssign: () => void;
    onCollectionUnassign: (id: string) => void;
}

const useStyles = makeStyles(
    {
        colActions: {
            "&:last-child": {
                paddingRight: 0,
            },
            width: 80,
        },
        colName: {
            width: "auto",
        },
        colProducts: {
            textAlign: "right",
            width: 140,
        },
        tableRow: {
            cursor: "pointer",
        },
        textRight: {},
    },
    { name: "DiscountCollections" }
);

const numberOfColumns = 4;

const DiscountCollections: React.FC<DiscountCollectionsProps> = (props) => {
    const {
        discount: sale,

        disabled,
        pageInfo,
        onCollectionAssign,
        onCollectionUnassign,
        onRowClick,
        onPreviousPage,
        onNextPage,
        isChecked,
        selected,
        toggle,
        toggleAll,
        toolbar,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Eligible Collections",
                    id: "XNeJay",
                    description: "section header",
                })}
                toolbar={
                    <Button color="primary" onClick={onCollectionAssign}>
                        <FormattedMessage
                            defaultMessage="Assign collections"
                            id="/6uK4C"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <colgroup>
                    <col />
                    <col className={classes.colName} />
                    <col className={classes.colProducts} />
                    <col className={classes.colActions} />
                </colgroup>
                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={mapEdgesToItems(sale?.collections)}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCell className={classes.colName}>
                        <FormattedMessage defaultMessage="Collection name" id="A6ozr9" />
                    </TableCell>
                    <TableCell className={classes.textRight}>
                        <FormattedMessage
                            defaultMessage="Products"
                            id="QGjJcT"
                            description="number of products"
                        />
                    </TableCell>
                    <TableCell />
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
                        mapEdgesToItems(sale?.collections),
                        (collection) => {
                            const isSelected = collection ? isChecked(collection.id) : false;
                            return (
                                <TableRow
                                    selected={isSelected}
                                    hover={!!collection}
                                    key={collection ? collection.id : "skeleton"}
                                    onClick={collection && onRowClick(collection.id)}
                                    className={classes.tableRow}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(collection?.id)}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.colName}>
                                        {maybe<React.ReactNode>(() => collection?.name, <Skeleton />)}
                                    </TableCell>
                                    <TableCell className={classes.colProducts}>
                                        {maybe<React.ReactNode>(
                                            () => collection?.products?.totalCount,
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colActions}>
                                        <IconButton
                                            disabled={!collection || disabled}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onCollectionUnassign(collection?.id);
                                            }}
                                        >
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage
                                        defaultMessage="No collections found"
                                        id="Yw+9F7"
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

DiscountCollections.displayName = "DiscountCollections";

export default DiscountCollections;

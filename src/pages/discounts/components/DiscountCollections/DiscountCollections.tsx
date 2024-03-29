// @ts-nocheck
import { Card, TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, ListActions, ListProps } from "@mzawadie/core";
import { SaleDetailsFragment, VoucherDetailsFragment } from "@mzawadie/graphql";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { Button, DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export interface DiscountCollectionsProps extends ListProps, ListActions {
    discount: SaleDetailsFragment | VoucherDetailsFragment;
    onCollectionAssign: () => void;
    onCollectionUnassign: (id: string) => void;
}

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
                title={intl.formatMessage(messages.discountCollectionsHeader)}
                toolbar={
                    <Button onClick={onCollectionAssign}>
                        <FormattedMessage {...messages.discountCollectionsButton} />
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
                        <FormattedMessage {...messages.discountCollectionsTableProductHeader} />
                    </TableCell>
                    <TableCell className={classes.colProducts}>
                        <FormattedMessage {...messages.discountCollectionsTableProductNumber} />
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
                                            onChange={() => toggle(collection.id)}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.colName}>
                                        {maybe<React.ReactNode>(() => collection.name, <Skeleton />)}
                                    </TableCell>
                                    <TableCell className={classes.colProducts}>
                                        {maybe<React.ReactNode>(
                                            () => collection.products.totalCount,
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colActions}>
                                        <IconButton
                                            variant="secondary"
                                            disabled={!collection || disabled}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onCollectionUnassign(collection.id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage {...messages.discountCollectionsNotFound} />
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

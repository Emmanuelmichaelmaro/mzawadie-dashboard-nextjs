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

export interface DiscountCategoriesProps extends ListProps, ListActions {
    discount: SaleDetails_sale | VoucherDetails_voucher;
    onCategoryAssign: () => void;
    onCategoryUnassign: (id: string) => void;
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
    },
    { name: "DiscountCategories" }
);

const numberOfColumns = 4;

const DiscountCategories: React.FC<DiscountCategoriesProps> = (props) => {
    const {
        discount,
        disabled,
        pageInfo,
        onCategoryAssign,
        onCategoryUnassign,
        onRowClick,
        onPreviousPage,
        onNextPage,
        toolbar,
        toggle,
        toggleAll,
        selected,
        isChecked,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Eligible Categories",
                    id: "AbyDC7",
                    description: "section header",
                })}
                toolbar={
                    <Button color="primary" onClick={onCategoryAssign}>
                        <FormattedMessage
                            defaultMessage="Assign categories"
                            id="g3qjSf"
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
                    items={mapEdgesToItems(discount?.categories)}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <>
                        <TableCell className={classes.colName}>
                            <FormattedMessage defaultMessage="Category name" id="kgVqk1" />
                        </TableCell>
                        <TableCell className={classes.colProducts}>
                            <FormattedMessage
                                defaultMessage="Products"
                                id="QGjJcT"
                                description="number of products"
                            />
                        </TableCell>
                        <TableCell />
                    </>
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
                        mapEdgesToItems(discount?.categories),
                        (category) => {
                            const isSelected = category ? isChecked(category.id) : false;

                            return (
                                <TableRow
                                    hover={!!category}
                                    key={category ? category.id : "skeleton"}
                                    onClick={category && onRowClick(category.id)}
                                    className={classes.tableRow}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(category?.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {maybe<React.ReactNode>(() => category?.name, <Skeleton />)}
                                    </TableCell>
                                    <TableCell className={classes.colProducts}>
                                        {maybe<React.ReactNode>(
                                            () => category?.products?.totalCount,
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.colActions}>
                                        <IconButton
                                            disabled={!category || disabled}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onCategoryUnassign(category?.id);
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
                                        defaultMessage="No categories found"
                                        id="dM86a2"
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

DiscountCategories.displayName = "DiscountCategories";

export default DiscountCategories;

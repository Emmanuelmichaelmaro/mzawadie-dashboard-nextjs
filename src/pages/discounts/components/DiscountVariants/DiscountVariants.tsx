// @ts-nocheck
import { Card, TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableButtonWrapper } from "@mzawadie/components/TableButtonWrapper/TableButtonWrapper";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { maybe, renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, RelayToFlat } from "@mzawadie/core";
import { SaleDetailsFragment } from "@mzawadie/graphql";
import { productVariantEditPath } from "@mzawadie/pages/products/urls";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

export interface SaleVariantsProps extends ListProps, ListActions {
    variants: RelayToFlat<SaleDetailsFragment["variants"]> | null;
    onVariantAssign: () => void;
    onVariantUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const DiscountVariants: React.FC<SaleVariantsProps> = (props) => {
    const {
        variants,
        disabled,
        onVariantAssign,
        onVariantUnassign,
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
                title={intl.formatMessage(messages.discountVariantsHeader)}
                toolbar={
                    <Button onClick={onVariantAssign} data-test-id="assign-variant">
                        <FormattedMessage {...messages.discountVariantsButton} />
                    </Button>
                }
            />

            <ResponsiveTable>
                <colgroup>
                    <col />
                    <col className={classes.colProductName} />
                    <col className={classes.colVariantName} />
                    <col className={classes.colType} />
                    <col className={classes.colActions} />
                </colgroup>

                <TableHead
                    colSpan={numberOfColumns}
                    selected={selected}
                    disabled={disabled}
                    items={variants}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                >
                    <TableCell className={classes.colProductName}>
                        <span className={variants?.length > 0 && classes.colNameLabel}>
                            <FormattedMessage {...messages.discountVariantsTableProductHeader} />
                        </span>
                    </TableCell>

                    <TableCell className={classes.colVariantName}>
                        <FormattedMessage {...messages.discountVariantsTableVariantHeader} />
                    </TableCell>

                    <TableCell className={classes.colType}>
                        <FormattedMessage {...messages.discountVariantsTableProductHeader} />
                    </TableCell>

                    <TableCell className={classes.colActions} />
                </TableHead>

                <TableFooter>
                    <TableRow>
                        <TablePaginationWithContext colSpan={numberOfColumns} />
                    </TableRow>
                </TableFooter>

                <TableBody>
                    {renderCollection(
                        variants,
                        (variant) => {
                            const isSelected = variant ? isChecked(variant.id) : false;

                            return (
                                <TableRowLink
                                    hover={!!variant}
                                    key={variant ? variant?.id : "skeleton"}
                                    href={
                                        variant &&
                                        productVariantEditPath(variant?.product?.id, variant?.id)
                                    }
                                    className={classes.tableRow}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(variant?.id)}
                                        />
                                    </TableCell>

                                    <TableCellAvatar
                                        className={classes.colProductName}
                                        thumbnail={maybe(() => variant?.product.thumbnail.url)}
                                    >
                                        {maybe<React.ReactNode>(
                                            () => variant?.product.name,
                                            <Skeleton />
                                        )}
                                    </TableCellAvatar>

                                    <TableCell className={classes.colType}>
                                        {maybe<React.ReactNode>(() => variant?.name, <Skeleton />)}
                                    </TableCell>

                                    <TableCell className={classes.colType}>
                                        {maybe<React.ReactNode>(
                                            () => variant?.product?.productType.name,
                                            <Skeleton />
                                        )}
                                    </TableCell>

                                    <TableCell className={classes.colActions}>
                                        <TableButtonWrapper>
                                            <IconButton
                                                variant="secondary"
                                                disabled={!variant || disabled}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onVariantUnassign(variant?.id);
                                                }}
                                            >
                                                <DeleteIcon color="primary" />
                                            </IconButton>
                                        </TableButtonWrapper>
                                    </TableCell>
                                </TableRowLink>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage {...messages.discountVariantsNotFound} />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

DiscountVariants.displayName = "DiscountVariants";

export default DiscountVariants;

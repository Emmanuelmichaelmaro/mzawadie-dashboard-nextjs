import { Card, CardContent, Hidden, TableCell, Typography } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { LinkChoice } from "@mzawadie/components/LinkChoice";
import { Money } from "@mzawadie/components/Money";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import Skeleton from "@mzawadie/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@mzawadie/components/SortableTable";
import { TableHead } from "@mzawadie/components/TableHead";
import { maybe, renderCollection, ChannelProps, ListActions, ReorderAction } from "@mzawadie/core";
import { isLimitReached } from "@mzawadie/utils/limits";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import {
    ProductDetails_product,
    ProductDetails_product_variants,
    ProductDetails_product_variants_stocks_warehouse,
} from "../../types/ProductDetails";
import { ProductVariantSetDefault } from "../ProductVariantSetDefault";

function getWarehouseChoices(
    variants: ProductDetails_product_variants[],
    intl: IntlShape
): SingleAutocompleteChoiceType[] {
    return [
        {
            label: intl.formatMessage({
                defaultMessage: "All Warehouses",
                id: "JtZ71e",
                description: "filtering option",
            }),
            value: null,
        },
        ...variants
            .reduce<ProductDetails_product_variants_stocks_warehouse[]>(
                (warehouses, variant) => [
                    ...warehouses,
                    ...variant.stocks.reduce<ProductDetails_product_variants_stocks_warehouse[]>(
                        (variantStocks, stock) => {
                            if (!!warehouses.find((w) => w.id === stock.warehouse.id)) {
                                return variantStocks;
                            }

                            return [...variantStocks, stock.warehouse];
                        },
                        []
                    ),
                ],
                []
            )
            .map((w) => ({
                label: w.name,
                value: w.id,
            })),
    ];
}

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colActions: {
                width: 80,
            },
            colInventory: {
                width: 200,
            },
            colName: {},
            colPrice: {
                width: 135,
            },
            colSku: {
                width: 200,
            },
        },
        alert: {
            margin: theme.spacing(3, 3, 0),
        },
        colGrab: {
            width: 60,
        },
        colInventory: {
            textAlign: "right",
        },
        colName: {
            paddingLeft: 0,
        },
        colPrice: {
            textAlign: "right",
        },
        colSku: {},
        colStatus: {},
        defaultVariant: {
            color: fade(theme.palette.text.secondary, 0.6),
            display: "block",
        },
        link: {
            cursor: "pointer",
        },
        select: {
            display: "inline-block",
        },
        textLeft: {
            textAlign: "left" as const,
        },
        textRight: {
            textAlign: "right" as const,
        },
        warehouseLabel: {
            display: "inline-block",
            marginRight: theme.spacing(),
        },
        warehouseSelectContainer: {
            paddingTop: theme.spacing(2),
        },
    }),
    { name: "ProductVariants" }
);

function getAvailabilityLabel(
    intl: IntlShape,
    warehouse: string,
    variant: ProductDetails_product_variants,
    numAvailable: number
): string {
    if (variant.preorder) {
        if (variant.preorder.globalThreshold) {
            return intl.formatMessage(
                {
                    defaultMessage: "{globalThreshold} Global threshold",
                    id: "80FeaT",
                    description: "product variant preorder threshold",
                },
                {
                    globalThreshold: variant.preorder.globalThreshold,
                }
            );
        }

        return intl.formatMessage({
            defaultMessage: "In preorder",
            id: "qbqMpk",
            description: "product variant preorder threshold",
        });
    }

    const variantStock = variant.stocks.find((s) => s.warehouse.id === warehouse);

    if (!!warehouse) {
        if (!!variantStock) {
            if (variantStock.quantity > 0) {
                return intl.formatMessage(
                    {
                        defaultMessage:
                            "{stockQuantity,plural,one{{stockQuantity} available} other{{stockQuantity} available}}",
                        id: "uVssds",
                        description: "product variant inventory",
                    },
                    {
                        stockQuantity: variantStock.quantity,
                    }
                );
            }
            return intl.formatMessage({
                defaultMessage: "Unavailable",
                id: "7mK2vs",
                description: "product variant inventory",
            });
        }
        return intl.formatMessage({
            defaultMessage: "Not stocked",
            id: "9PmyrU",
            description: "product variant inventory",
        });
    }
    if (numAvailable > 0) {
        return intl.formatMessage(
            {
                defaultMessage:
                    "{numLocations,plural,one{{numAvailable} available at {numLocations} location} other{{numAvailable} available at {numLocations} locations}}",
                id: "wWYYBR",
                description: "product variant inventory",
            },
            {
                numAvailable,
                numLocations: variant.stocks.length,
            }
        );
    }
    return intl.formatMessage({
        defaultMessage: "Unavailable in all locations",
        id: "6+sMz4",
        description: "product variant inventory",
    });
}

interface ProductVariantsProps extends ListActions, ChannelProps {
    disabled: boolean;
    limits: RefreshLimits_shop_limits;
    product: ProductDetails_product;
    variants: ProductDetails_product_variants[];
    onVariantReorder: ReorderAction;
    onRowClick: (id: string) => () => void;
    onSetDefaultVariant(variant: ProductDetails_product_variants);
    onVariantAdd?();
    onVariantsAdd?();
}

const numberOfColumns = 7;

export const ProductVariants: React.FC<ProductVariantsProps> = (props) => {
    const {
        disabled,
        limits,
        variants,
        product,
        onRowClick,
        onVariantAdd,
        onVariantsAdd,
        onVariantReorder,
        onSetDefaultVariant,
        isChecked,
        selected,
        selectedChannelId,
        toggle,
        toggleAll,
        toolbar,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const [warehouse, setWarehouse] = React.useState<string>(null);
    const hasVariants = maybe(() => variants.length > 0, true);
    const limitReached = isLimitReached(limits, "productVariants");

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Variants",
                    id: "1kdQdO",
                    description: "section header",
                })}
                toolbar={
                    hasVariants ? (
                        <Button
                            disabled={limitReached}
                            onClick={onVariantAdd}
                            variant="tertiary"
                            data-test-id="button-add-variant"
                        >
                            <FormattedMessage
                                defaultMessage="Create variant"
                                id="3VyHbJ"
                                description="button"
                            />
                        </Button>
                    ) : (
                        <Button
                            disabled={limitReached}
                            onClick={onVariantsAdd}
                            variant="tertiary"
                            data-test-id="button-add-variants"
                        >
                            <FormattedMessage
                                defaultMessage="Create variants"
                                id="HcjV6k"
                                description="button"
                            />
                        </Button>
                    )
                }
            />

            {limitReached && (
                <LimitReachedAlert
                    className={classes.alert}
                    title={intl.formatMessage({
                        defaultMessage: "SKU limit reached",
                        id: "FwHWUm",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="5Vwnu+"
                    />
                </LimitReachedAlert>
            )}

            {variants.length > 0 ? (
                <CardContent className={classes.warehouseSelectContainer}>
                    <Typography className={classes.warehouseLabel}>
                        <FormattedMessage
                            defaultMessage="Available inventory at:"
                            id="FSinkL"
                            description="variant stock status"
                        />
                    </Typography>
                    <LinkChoice
                        className={classes.select}
                        choices={getWarehouseChoices(variants, intl)}
                        name="warehouse"
                        value={warehouse}
                        onChange={(event) => setWarehouse(event.target.value)}
                    />
                </CardContent>
            ) : (
                <CardContent>
                    <Typography color={hasVariants ? "textPrimary" : "textSecondary"}>
                        <FormattedMessage
                            defaultMessage="Use variants for products that come in a variety of versions for example different sizes or colors"
                            id="rIJbNC"
                        />
                    </Typography>
                </CardContent>
            )}

            {hasVariants && (
                <ResponsiveTable>
                    <colgroup>
                        <col className={classes.colGrab} />
                        <col />
                        <col className={classes.colName} />
                        <col className={classes.colSku} />
                        <col className={classes.colPrice} />
                        <col className={classes.colInventory} />
                        <col className={classes.colActions} />
                    </colgroup>

                    <TableHead
                        colSpan={numberOfColumns}
                        selected={selected}
                        disabled={disabled}
                        items={variants}
                        toggleAll={toggleAll}
                        toolbar={toolbar}
                        dragRows
                    >
                        <TableCell className={classes.colName}>
                            <FormattedMessage
                                defaultMessage="Variant"
                                id="OTek3r"
                                description="product variant name"
                            />
                        </TableCell>

                        <TableCell className={classes.colSku}>
                            <FormattedMessage defaultMessage="SKU" id="k4brJy" />
                        </TableCell>

                        <Hidden smDown>
                            <TableCell className={classes.colPrice}>
                                <FormattedMessage
                                    defaultMessage="Price"
                                    id="n02c9W"
                                    description="product variant price"
                                />
                            </TableCell>
                        </Hidden>

                        <TableCell className={classes.colInventory}>
                            <FormattedMessage
                                defaultMessage="Inventory"
                                id="kL3C+K"
                                description="product variant inventory status"
                            />
                        </TableCell>

                        <TableCell className={classes.colActions} />
                    </TableHead>

                    <SortableTableBody onSortEnd={onVariantReorder}>
                        {renderCollection(variants, (variant, variantIndex) => {
                            const isSelected = variant ? isChecked(variant.id) : false;

                            const isDefault = variant && product?.defaultVariant?.id === variant?.id;

                            const numAvailable =
                                variant && variant.stocks
                                    ? variant.stocks.reduce(
                                          (acc, s) => acc + s.quantity - s.quantityAllocated,
                                          0
                                      )
                                    : null;

                            const channel = variant.channelListings.find(
                                (listing) => listing.channel.id === selectedChannelId
                            );

                            return (
                                <SortableTableRow
                                    data-test-id="product-variant-row"
                                    selected={isSelected}
                                    hover={!!variant}
                                    onClick={onRowClick(variant.id)}
                                    key={variant ? variant.id : "skeleton"}
                                    index={variantIndex || 0}
                                    className={classes.link}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(variant.id)}
                                        />
                                    </TableCell>

                                    <TableCell className={classes.colName} data-test-id="name">
                                        {variant ? variant.name || variant.sku : <Skeleton />}
                                        {isDefault && (
                                            <span className={classes.defaultVariant}>
                                                {intl.formatMessage({
                                                    defaultMessage: "Default",
                                                    id: "vZMs8f",
                                                    description: "default product variant indicator",
                                                })}
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className={classes.colSku} data-test-id="sku">
                                        {variant ? variant.sku : <Skeleton />}
                                    </TableCell>

                                    <Hidden smDown>
                                        <TableCell className={classes.colPrice} data-test-id="price">
                                            {variant ? <Money money={channel?.price} /> : <Skeleton />}
                                        </TableCell>
                                    </Hidden>

                                    <TableCell
                                        className={classes.colInventory}
                                        data-test-id="inventory"
                                    >
                                        {numAvailable === null ? (
                                            <Skeleton />
                                        ) : (
                                            getAvailabilityLabel(intl, warehouse, variant, numAvailable)
                                        )}
                                    </TableCell>

                                    <TableCell
                                        className={classes.colActions}
                                        data-test-id="actions"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {variant?.id !== product?.defaultVariant?.id && (
                                            <ProductVariantSetDefault
                                                onSetDefaultVariant={() => onSetDefaultVariant(variant)}
                                            />
                                        )}
                                    </TableCell>
                                </SortableTableRow>
                            );
                        })}
                    </SortableTableBody>
                </ResponsiveTable>
            )}
        </Card>
    );
};

ProductVariants.displayName = "ProductVariants";

export default ProductVariants;
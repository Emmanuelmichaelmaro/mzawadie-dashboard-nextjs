// @ts-nocheck
import {
    Card,
    CardContent,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { PriceField } from "@mzawadie/components/PriceField";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { renderCollection } from "@mzawadie/core";
import { ProductChannelListingErrorFragment } from "@mzawadie/fragments/types/ProductChannelListingErrorFragment";
import { ChannelData, ChannelPriceArgs } from "@mzawadie/pages/channels/utils";
import { getFormChannelError, getFormChannelErrors } from "@mzawadie/utils/errors";
import getProductErrorMessage from "@mzawadie/utils/errors/product";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        caption: {
            fontSize: 14,
            padding: theme.spacing(0, 3, 2, 3),
        },
        colName: {
            fontSize: 14,
            paddingLeft: 0,
            width: "auto",
        },
        colPrice: {
            textAlign: "right",
            verticalAlign: "top",
            width: 200,
        },
        colType: {
            fontSize: 14,
            textAlign: "right",
            width: 200,
        },
        input: {
            textAlign: "left",
        },
        pricingContent: {
            "&:last-child": {
                paddingBottom: 0,
            },
            paddingLeft: 0,
            paddingRight: 0,
        },
        table: {
            tableLayout: "fixed",
        },
    }),
    { name: "ProductVariantPrice" }
);

interface ProductVariantPriceProps {
    ProductVariantChannelListings?: ChannelData[];
    errors?: ProductChannelListingErrorFragment[];
    loading?: boolean;
    disabled?: boolean;
    onChange?: (id: string, data: ChannelPriceArgs) => void;
    disabledMessage?: MessageDescriptor;
}

const numberOfColumns = 2;

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = (props) => {
    const {
        disabled = false,
        errors = [],
        ProductVariantChannelListings = [],
        loading,
        onChange,
        disabledMessage,
    } = props;
    const classes = useStyles(props);
    const intl = useIntl();
    const formErrors = getFormChannelErrors(["price", "costPrice"], errors);

    if (disabled || !ProductVariantChannelListings.length) {
        return (
            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Pricing",
                        id: "Xm9qOu",
                        description: "product pricing, section header",
                    })}
                />

                <CardContent>
                    <Typography variant="caption">
                        {intl.formatMessage(
                            disabledMessage || {
                                defaultMessage: "There is no channel to define prices for",
                                description: "variant pricing section subtitle",
                                id: "product variant pricing card disabled subtitle",
                            }
                        )}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Pricing",
                    id: "Xm9qOu",
                    description: "product pricing, section header",
                })}
            />

            <CardContent className={classes.pricingContent}>
                <Typography variant="caption" className={classes.caption}>
                    {intl.formatMessage({
                        defaultMessage:
                            "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
                        id: "VvA7ai",
                        description: "info text",
                    })}
                </Typography>

                <ResponsiveTable className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <FormattedMessage
                                    defaultMessage="Channel Name"
                                    id="c8UT0c"
                                    description="tabel column header"
                                />
                            </TableCell>

                            <TableCell className={classes.colType}>
                                <FormattedMessage
                                    defaultMessage="Selling Price"
                                    id="JFtFgc"
                                    description="tabel column header"
                                />
                            </TableCell>

                            <TableCell className={classes.colType}>
                                <FormattedMessage
                                    defaultMessage="Cost Price"
                                    id="HEOBp6"
                                    description="tabel column header"
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {renderCollection(
                            ProductVariantChannelListings,
                            (listing, index) => {
                                const priceError = getFormChannelError(formErrors.price, listing.id);
                                const costPriceError = getFormChannelError(
                                    formErrors.costPrice,
                                    listing.id
                                );

                                return (
                                    <TableRow key={listing?.id || `skeleton-${index}`}>
                                        <TableCell>{listing?.name || <Skeleton />}</TableCell>

                                        <TableCell className={classes.colPrice}>
                                            {listing ? (
                                                <PriceField
                                                    className={classes.input}
                                                    error={!!priceError}
                                                    label={intl.formatMessage({
                                                        defaultMessage: "Price",
                                                        id: "b1zuN9",
                                                    })}
                                                    name={`${listing.id}-channel-price`}
                                                    value={listing.price || ""}
                                                    currencySymbol={listing.currency}
                                                    onChange={(e) =>
                                                        onChange(listing.id, {
                                                            costPrice: listing.costPrice,
                                                            price: e.target.value,
                                                        })
                                                    }
                                                    disabled={loading}
                                                    required
                                                    hint={
                                                        priceError &&
                                                        getProductErrorMessage(priceError, intl)
                                                    }
                                                />
                                            ) : (
                                                <Skeleton />
                                            )}
                                        </TableCell>

                                        <TableCell className={classes.colPrice}>
                                            {listing ? (
                                                <PriceField
                                                    className={classes.input}
                                                    error={!!costPriceError}
                                                    label={intl.formatMessage({
                                                        defaultMessage: "Cost Price",
                                                        id: "HEOBp6",
                                                        description: "tabel column header",
                                                    })}
                                                    name={`${listing.id}-channel-costPrice`}
                                                    value={listing.costPrice || ""}
                                                    currencySymbol={listing.currency}
                                                    onChange={(e) =>
                                                        onChange(listing.id, {
                                                            costPrice: e.target.value,
                                                            price: listing.price,
                                                        })
                                                    }
                                                    disabled={loading}
                                                    hint={
                                                        costPriceError
                                                            ? getProductErrorMessage(
                                                                  costPriceError,
                                                                  intl
                                                              )
                                                            : ""
                                                    }
                                                />
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
                                        <FormattedMessage
                                            defaultMessage="No channels found"
                                            id="/glQgs"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </ResponsiveTable>
            </CardContent>
        </Card>
    );
};

ProductVariantPrice.displayName = "ProductVariantPrice";

export default ProductVariantPrice;

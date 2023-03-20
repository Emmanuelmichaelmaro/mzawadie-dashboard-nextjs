import {
    Card,
    CardContent,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import { PriceField } from "@mzawadie/components/PriceField";
import { RadioGroupField } from "@mzawadie/components/RadioGroupField";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableHead } from "@mzawadie/components/TableHead";
import { renderCollection } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/graphql";
import { ChannelInput } from "@mzawadie/pages/discounts/handlers";
import { RequirementsPicker } from "@mzawadie/pages/discounts/types";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { useStyles } from "./styles";

interface VoucherRequirementsProps {
    data: VoucherDetailsPageFormData;
    disabled: boolean;
    errors: DiscountErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
    onChannelChange: (channelId: string, input: ChannelInput) => void;
}

const numberOfColumns = 2;

const VoucherRequirements = ({
    data,
    disabled,
    errors,
    onChange,
    onChannelChange,
}: VoucherRequirementsProps) => {
    const classes = useStyles({});
    const intl = useIntl();

    const formErrors = getFormErrors(["minSpent", "minCheckoutItemsQuantity"], errors);
    const minimalOrderValueText = intl.formatMessage({
        defaultMessage: "Minimal order value",
        id: "bh9+8A",
        description: "voucher requirement",
    });
    const minimalQuantityText = intl.formatMessage({
        defaultMessage: "Minimum quantity of items",
        id: "XT/ZvF",
        description: "voucher requirement",
    });

    const requirementsPickerChoices = [
        {
            label: intl.formatMessage({
                defaultMessage: "None",
                id: "u/hkKO",
                description: "voucher has no requirements",
            }),
            value: RequirementsPicker.NONE,
        },
        {
            label: minimalOrderValueText,
            value: RequirementsPicker.ORDER,
        },
        {
            label: minimalQuantityText,
            value: RequirementsPicker.ITEM,
        },
    ];

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Minimum Requirements",
                    id: "yhv3HX",
                    description: "voucher requirements, header",
                })}
            />
            <CardContent>
                <RadioGroupField
                    choices={requirementsPickerChoices}
                    disabled={disabled}
                    name={"requirementsPicker" as keyof VoucherDetailsPageFormData}
                    value={data.requirementsPicker}
                    onChange={onChange}
                />
                {[RequirementsPicker.ORDER, RequirementsPicker.ITEM].includes(
                    data.requirementsPicker
                ) && <FormSpacer />}
                {data.requirementsPicker === RequirementsPicker.ORDER ? (
                    <>
                        <Typography variant="caption">
                            <FormattedMessage
                                defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
                                id="K+ROF8"
                            />
                        </Typography>
                        <div className={classes.tableContainer}>
                            <ResponsiveTable className={classes.table}>
                                <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
                                    <TableCell className={classes.colName}>
                                        <span>
                                            <FormattedMessage
                                                defaultMessage="Channel name"
                                                id="Hj3T7P"
                                                description="column title"
                                            />
                                        </span>
                                    </TableCell>
                                    <TableCell className={classes.colType}>
                                        <span>
                                            <FormattedMessage
                                                defaultMessage="Value"
                                                id="GVinbz"
                                                description="column title"
                                            />
                                        </span>
                                    </TableCell>
                                </TableHead>
                                <TableBody>
                                    {renderCollection(
                                        data.channelListings,
                                        (listing, index) => {
                                            const error = formErrors.minSpent?.channels?.find(
                                                (id) => id === listing?.id
                                            );
                                            return (
                                                <TableRow key={listing?.id || `skeleton-${index}`}>
                                                    <TableCell>
                                                        <Typography>
                                                            {listing?.name || <Skeleton />}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.colPrice}>
                                                        {listing ? (
                                                            <PriceField
                                                                disabled={disabled}
                                                                error={!!error?.length}
                                                                hint={
                                                                    error
                                                                        ? getDiscountErrorMessage(
                                                                              formErrors.minSpent,
                                                                              intl
                                                                          )
                                                                        : ""
                                                                }
                                                                label={minimalOrderValueText}
                                                                name="minSpent"
                                                                value={listing.minSpent || ""}
                                                                onChange={(e) =>
                                                                    onChannelChange(listing.id, {
                                                                        minSpent: e.target.value,
                                                                    })
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
                        </div>
                    </>
                ) : data.requirementsPicker === RequirementsPicker.ITEM ? (
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.minCheckoutItemsQuantity}
                        helperText={getDiscountErrorMessage(formErrors.minCheckoutItemsQuantity, intl)}
                        label={minimalQuantityText}
                        name={"minCheckoutItemsQuantity" as keyof VoucherDetailsPageFormData}
                        value={data.minCheckoutItemsQuantity}
                        onChange={onChange}
                        fullWidth
                    />
                ) : null}
            </CardContent>
        </Card>
    );
};

export default VoucherRequirements;

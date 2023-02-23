// @ts-nocheck
import { Card, CardContent, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { RadioGroupField } from "@mzawadie/components/RadioGroupField";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableHead } from "@mzawadie/components/TableHead";
import { TextFieldWithChoice } from "@mzawadie/components/TextFieldWithChoice";
import { renderCollection } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/fragments/types/DiscountErrorFragment";
import { ChannelInput } from "@mzawadie/pages/discounts/handlers";
import { DiscountTypeEnum } from "@mzawadie/pages/discounts/types";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translateVoucherTypes } from "../../translations";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { useStyles } from "./styles";

interface VoucherValueProps {
    data: VoucherDetailsPageFormData;
    errors: DiscountErrorFragment[];
    disabled: boolean;
    variant: string;
    onChange: (event: React.ChangeEvent<any>) => void;
    onChannelChange: (channelId: string, input: ChannelInput) => void;
}

export enum VoucherType {
    ENTIRE_ORDER = "ENTIRE_ORDER",
    SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT",
}

const numberOfColumns = 2;

const VoucherValue: React.FC<VoucherValueProps> = (props) => {
    const { data, disabled, errors, variant, onChange, onChannelChange } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formErrors = getFormErrors(["discountValue", "type"], errors);

    const translatedVoucherTypes = translateVoucherTypes(intl);
    const voucherTypeChoices = Object.values(VoucherType).map((type) => ({
        label: translatedVoucherTypes[type],
        value: type,
    }));

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Value",
                    id: "/oaqFS",
                    description: "section header",
                })}
            />
            <CardContent>
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
                                        defaultMessage="Price"
                                        id="1shOIS"
                                        description="column title"
                                    />
                                </span>
                            </TableCell>
                        </TableHead>
                        <TableBody>
                            {renderCollection(
                                data.channelListings,
                                (listing, index) => {
                                    const error = formErrors.discountValue?.channels?.find(
                                        (id) => id === listing?.id
                                    );
                                    return (
                                        <TableRow key={listing?.id || `skeleton-${index}`}>
                                            <TableCell>
                                                <Typography>{listing?.name || <Skeleton />}</Typography>
                                            </TableCell>
                                            <TableCell className={classes.colPrice}>
                                                {listing ? (
                                                    <TextFieldWithChoice
                                                        disabled={disabled}
                                                        error={!!error?.length}
                                                        ChoiceProps={{
                                                            label:
                                                                data.discountType ===
                                                                DiscountTypeEnum.VALUE_FIXED
                                                                    ? listing.currency
                                                                    : "%",
                                                            name: "discountType" as keyof FormData,
                                                            values: null,
                                                        }}
                                                        helperText={
                                                            error
                                                                ? getDiscountErrorMessage(
                                                                      formErrors.discountValue,
                                                                      intl
                                                                  )
                                                                : ""
                                                        }
                                                        name="value"
                                                        onChange={(e) =>
                                                            onChannelChange(listing.id, {
                                                                discountValue: e.target.value,
                                                            })
                                                        }
                                                        label={intl.formatMessage({
                                                            defaultMessage: "Discount Value",
                                                            id: "mmcHeH",
                                                        })}
                                                        value={listing.discountValue || ""}
                                                        type="number"
                                                        fullWidth
                                                        inputProps={{
                                                            min: 0,
                                                        }}
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

                <FormSpacer />
                {variant === "update" && (
                    <>
                        <Hr className={classes.hr} />
                        <RadioGroupField
                            choices={voucherTypeChoices}
                            disabled={disabled}
                            error={!!formErrors.type}
                            hint={getDiscountErrorMessage(formErrors.type, intl)}
                            label={intl.formatMessage({
                                defaultMessage: "Voucher Specific Information",
                                id: "9UHfux",
                            })}
                            name={"type" as keyof VoucherDetailsPageFormData}
                            value={data.type}
                            onChange={onChange}
                        />
                    </>
                )}
                <FormSpacer />
                <ControlledCheckbox
                    name={"applyOncePerOrder" as keyof VoucherDetailsPageFormData}
                    label={
                        <>
                            <FormattedMessage
                                defaultMessage="Only once per order"
                                id="5c2JVF"
                                description="voucher application, switch button"
                            />
                            <Typography variant="caption">
                                <FormattedMessage
                                    defaultMessage="If this option is disabled, discount will be counted for every eligible product"
                                    id="ObRk1O"
                                />
                            </Typography>
                        </>
                    }
                    checked={data.applyOncePerOrder}
                    onChange={onChange}
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
};

export default VoucherValue;

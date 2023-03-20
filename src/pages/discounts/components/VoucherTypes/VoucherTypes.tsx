// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Grid } from "@mzawadie/components/Grid";
import { RadioGroupField } from "@mzawadie/components/RadioGroupField";
import { DiscountErrorFragment } from "@mzawadie/graphql";
import { DiscountTypeEnum } from "@mzawadie/pages/discounts/types";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherTypesProps {
    data: VoucherDetailsPageFormData;
    errors: DiscountErrorFragment[];
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherTypes = ({ data, disabled, errors, onChange }: VoucherTypesProps) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["discountType"], errors);

    const voucherTypeChoices = [
        {
            label: intl.formatMessage({
                defaultMessage: "Fixed Amount",
                id: "vXFPD6",
                description: "voucher discount type",
            }),
            value: DiscountTypeEnum.VALUE_FIXED,
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Percentage",
                id: "fEfCtO",
                description: "voucher discount type",
            }),
            value: DiscountTypeEnum.VALUE_PERCENTAGE,
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Free Shipping",
                id: "sS5aVm",
                description: "voucher discount type",
            }),
            value: DiscountTypeEnum.SHIPPING,
        },
    ];

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Discount Type",
                    id: "6cq+c+",
                    description: "header",
                })}
            />
            <CardContent>
                <Grid variant="uniform">
                    <RadioGroupField
                        choices={voucherTypeChoices}
                        disabled={disabled}
                        error={!!formErrors.discountType}
                        hint={getDiscountErrorMessage(formErrors.discountType, intl)}
                        name={"discountType" as keyof VoucherDetailsPageFormData}
                        value={data.discountType}
                        onChange={onChange}
                    />
                </Grid>
            </CardContent>
        </Card>
    );
};

export default VoucherTypes;

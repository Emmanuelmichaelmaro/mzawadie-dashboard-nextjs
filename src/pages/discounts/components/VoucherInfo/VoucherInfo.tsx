import { Button, Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages, generateCode } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherInfoProps {
    data: VoucherDetailsPageFormData;
    errors: DiscountErrorFragment[];
    disabled: boolean;
    variant: "create" | "update";
    onChange: (event: any) => void;
}

const VoucherInfo = ({ data, disabled, errors, variant, onChange }: VoucherInfoProps) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["code"], errors);

    const onGenerateCode = () =>
        onChange({
            target: {
                name: "code",
                value: generateCode(10),
            },
        });

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage(commonMessages.generalInformations)}
                toolbar={
                    variant === "create" && (
                        <Button color="primary" onClick={onGenerateCode} data-test-id="generate-code">
                            <FormattedMessage
                                defaultMessage="Generate Code"
                                id="mSLr9d"
                                description="voucher code, button"
                            />
                        </Button>
                    )
                }
            />
            <CardContent>
                <TextField
                    disabled={variant === "update" || disabled}
                    error={!!formErrors.code}
                    fullWidth
                    helperText={getDiscountErrorMessage(formErrors.code, intl)}
                    name={"code" as keyof VoucherDetailsPageFormData}
                    label={intl.formatMessage({
                        defaultMessage: "Discount Code",
                        id: "jvKNMP",
                    })}
                    value={data.code}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

export default VoucherInfo;

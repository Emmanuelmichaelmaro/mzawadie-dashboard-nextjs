// @ts-nocheck
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";

export interface SaleInfoProps {
    data: SaleDetailsPageFormData;
    disabled: boolean;
    errors: DiscountErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const SaleInfo: React.FC<SaleInfoProps> = ({ data, disabled, errors, onChange }) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    helperText={getDiscountErrorMessage(formErrors.name, intl)}
                    name={"name" as keyof SaleDetailsPageFormData}
                    onChange={onChange}
                    label={intl.formatMessage({
                        defaultMessage: "Name",
                        id: "F56hOz",
                        description: "sale name",
                    })}
                    value={data.name}
                    fullWidth
                />
            </CardContent>
        </Card>
    );
};

SaleInfo.displayName = "SaleInfo";

export default SaleInfo;

// @ts-nocheck
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { AppErrorFragment } from "@mzawadie/fragments/types/AppErrorFragment";
import { FormChange } from "@mzawadie/hooks/useForm";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import React from "react";
import { useIntl } from "react-intl";

export interface CustomAppInfoProps {
    data: {
        name: string;
    };
    disabled: boolean;
    errors: AppErrorFragment[];
    onChange: FormChange;
}

const CustomAppInformation: React.FC<CustomAppInfoProps> = ({ data, disabled, errors, onChange }) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "App Information",
                    id: "imYxM9",
                    description: "header",
                })}
            />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    label={intl.formatMessage({
                        defaultMessage: "App Name",
                        id: "foNlhn",
                        description: "custom app name",
                    })}
                    helperText={getAppErrorMessage(formErrors.name, intl)}
                    fullWidth
                    name="name"
                    value={data.name}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

CustomAppInformation.displayName = "CustomAppInformation";

export default CustomAppInformation;

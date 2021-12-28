import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { commonMessages } from "@mzawadie/core";
import { ShopErrorFragment } from "@mzawadie/fragments/types/ShopErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getShopErrorMessage from "@mzawadie/utils/errors/shop";
import React from "react";
import { useIntl } from "react-intl";

import { SiteSettingsPageFormData } from "../SiteSettingsPage";

interface SiteSettingsDetailsProps {
    data: SiteSettingsPageFormData;
    errors: ShopErrorFragment[];
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const SiteSettingsDetails: React.FC<SiteSettingsDetailsProps> = ({
    data,
    disabled,
    errors,
    onChange,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name", "domain", "description"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    fullWidth
                    name="name"
                    label={intl.formatMessage({
                        defaultMessage: "Name of your store",
                        id: "jA7MDD",
                    })}
                    helperText={
                        getShopErrorMessage(formErrors.name, intl) ||
                        intl.formatMessage({
                            defaultMessage: "Name of your store is shown on tab in web browser",
                            id: "Nz24W4",
                        })
                    }
                    value={data.name}
                    onChange={onChange}
                    InputProps={{
                        inputProps: {
                            autoComplete: "none",
                        },
                    }}
                />
                <FormSpacer />
                <TextField
                    disabled={disabled}
                    error={!!formErrors.domain}
                    fullWidth
                    name="domain"
                    label={intl.formatMessage({
                        defaultMessage: "URL of your online store",
                        id: "vHCm0+",
                    })}
                    helperText={getShopErrorMessage(formErrors.domain, intl)}
                    value={data.domain}
                    onChange={onChange}
                    InputProps={{
                        inputProps: {
                            autoComplete: "none",
                        },
                    }}
                />
                <FormSpacer />
                <TextField
                    disabled={disabled}
                    error={!!formErrors.description}
                    fullWidth
                    name="description"
                    label={intl.formatMessage({
                        defaultMessage: "Store Description",
                        id: "R2kU8R",
                    })}
                    helperText={
                        getShopErrorMessage(formErrors.description, intl) ||
                        intl.formatMessage({
                            defaultMessage:
                                "Store description is shown on taskbar after your store name",
                            id: "HXsmnA",
                        })
                    }
                    value={data.description}
                    onChange={onChange}
                    InputProps={{
                        inputProps: {
                            autoComplete: "none",
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
};

SiteSettingsDetails.displayName = "SiteSettingsDetails";

export default SiteSettingsDetails;

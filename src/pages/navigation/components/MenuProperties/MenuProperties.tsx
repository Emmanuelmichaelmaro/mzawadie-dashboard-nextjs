import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages } from "@mzawadie/core";
import { MenuErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getMenuErrorMessage from "@mzawadie/utils/errors/menu";
import React from "react";
import { useIntl } from "react-intl";

import { MenuDetailsFormData } from "../MenuDetailsPage";

export interface MenuPropertiesProps {
    data: MenuDetailsFormData;
    disabled: boolean;
    errors: MenuErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const MenuProperties: React.FC<MenuPropertiesProps> = ({ data, disabled, errors, onChange }) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    name={"name" as keyof MenuDetailsFormData}
                    fullWidth
                    label={intl.formatMessage({
                        defaultMessage: "Menu Title",
                        id: "jhh/D6",
                    })}
                    helperText={getMenuErrorMessage(formErrors.name, intl)}
                    value={data.name}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

MenuProperties.displayName = "MenuProperties";

export default MenuProperties;

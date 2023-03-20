// @ts-nocheck
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages } from "@mzawadie/core";
import { PermissionGroupErrorFragment } from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";
import { getFieldError, getFormErrors } from "@mzawadie/utils/errors";
import getPermissionGroupErrorMessage from "@mzawadie/utils/errors/permissionGroups";
import React from "react";
import { useIntl } from "react-intl";

export interface PermissionGroupInfoProps {
    disabled: boolean;
    errors: PermissionGroupErrorFragment[];
    onChange: FormChange;
    data: {
        name: string;
    };
}

const PermissionGroupInfo: React.FC<PermissionGroupInfoProps> = ({
    disabled,
    onChange,
    data,
    errors,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    name="name"
                    label={intl.formatMessage({
                        defaultMessage: "Group name",
                        id: "rs815i",
                        description: "text field label",
                    })}
                    value={data.name}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!getFieldError(errors, "name")}
                    helperText={getPermissionGroupErrorMessage(formErrors.name, intl)}
                    fullWidth
                />
            </CardContent>
        </Card>
    );
};

PermissionGroupInfo.displayName = "PermissionGroupInfo";

export default PermissionGroupInfo;

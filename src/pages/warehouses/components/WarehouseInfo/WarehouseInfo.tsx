import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { commonMessages } from "@mzawadie/core";
import { WarehouseErrorFragment } from "@mzawadie/fragments/types/WarehouseErrorFragment";
import { FormChange } from "@mzawadie/hooks/useForm";
import { getFormErrors } from "@mzawadie/utils/errors";
import getWarehouseErrorMessage from "@mzawadie/utils/errors/warehouse";
import React from "react";
import { useIntl } from "react-intl";

export interface WarehouseInfoProps {
    data: Record<"name", string>;
    disabled: boolean;
    errors: WarehouseErrorFragment[];
    onChange: FormChange;
}

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({ data, disabled, errors, onChange }) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card data-test="generalInformationSection">
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    fullWidth
                    helperText={getWarehouseErrorMessage(formErrors.name, intl)}
                    label={intl.formatMessage({
                        defaultMessage: "Warehouse Name",
                        id: "llBnr+",
                    })}
                    name={"name" as keyof typeof data}
                    value={data.name}
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

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
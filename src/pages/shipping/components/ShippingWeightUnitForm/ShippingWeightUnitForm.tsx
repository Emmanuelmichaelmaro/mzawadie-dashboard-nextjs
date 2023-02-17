// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Form } from "@mzawadie/components/Form";
import Hr from "@mzawadie/components/Hr";
import { SingleSelectField } from "@mzawadie/components/SingleSelectField";
import { buttonMessages, sectionNames } from "@mzawadie/core";
import { WeightUnitsEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
    unit: WeightUnitsEnum;
}

export interface ShippingWeightUnitFormProps {
    defaultWeightUnit: WeightUnitsEnum;
    disabled: boolean;
    onSubmit: (unit: WeightUnitsEnum) => void;
}

const ShippingWeightUnitForm: React.FC<ShippingWeightUnitFormProps> = ({
    defaultWeightUnit,
    disabled,
    onSubmit,
}) => {
    const intl = useIntl();
    const initialForm: FormData = {
        unit: defaultWeightUnit,
    };
    return (
        <Form initial={initialForm} onSubmit={(formData) => onSubmit(formData.unit)}>
            {({ change, data, submit }) => (
                <Card>
                    <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
                    <CardContent>
                        <SingleSelectField
                            disabled={disabled}
                            choices={Object.keys(WeightUnitsEnum).map((unit) => ({
                                label: WeightUnitsEnum[unit],
                                value: WeightUnitsEnum[unit],
                            }))}
                            label={intl.formatMessage({
                                defaultMessage: "Shipping Weight Unit",
                                id: "Rp/Okl",
                            })}
                            hint={intl.formatMessage({
                                defaultMessage: "This unit will be used as default shipping weight",
                                id: "4Kq3O6",
                            })}
                            name={"unit" as keyof FormData}
                            value={data.unit}
                            onChange={change}
                        />
                    </CardContent>
                    <Hr />
                    <CardActions>
                        <Button color="primary" onClick={submit} data-test-id="saveUnit">
                            <FormattedMessage {...buttonMessages.save} />
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Form>
    );
};
ShippingWeightUnitForm.displayName = "ShippingWeightUnitForm";
export default ShippingWeightUnitForm;

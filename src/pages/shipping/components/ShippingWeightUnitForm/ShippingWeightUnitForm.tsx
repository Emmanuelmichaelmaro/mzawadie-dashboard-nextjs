// @ts-nocheck
import { Card, CardActions, CardContent } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Form } from "@mzawadie/components/Form";
import { SingleSelectField } from "@mzawadie/components/SingleSelectField";
import { buttonMessages, sectionNames } from "@mzawadie/core";
import { WeightUnitsEnum } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
    unit: WeightUnitsEnum;
}

export interface ShippingWeightUnitFormProps {
    defaultWeightUnit: WeightUnitsEnum;
    disabled: boolean;
    onSubmit: (unit: WeightUnitsEnum) => SubmitPromise;
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
        <Form confirmLeave initial={initialForm} onSubmit={(formData) => onSubmit(formData.unit)}>
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
                                id: "Rp/Okl",
                                defaultMessage: "Shipping Weight Unit",
                            })}
                            hint={intl.formatMessage({
                                id: "4Kq3O6",
                                defaultMessage: "This unit will be used as default shipping weight",
                            })}
                            name={"unit" as keyof FormData}
                            value={data.unit}
                            onChange={change}
                        />
                    </CardContent>

                    <CardActions>
                        <Button onClick={submit} data-test-id="save-unit">
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

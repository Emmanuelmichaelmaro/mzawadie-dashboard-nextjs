import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { getShippingWeightRateErrorMessage } from "@mzawadie/pages/shipping/errors";
import { getFormErrors } from "@mzawadie/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface OrderWeightProps {
    disabled: boolean;
    errors: ShippingErrorFragment[];
    noLimits: boolean;
    maxValue: string;
    minValue: string;
    onChange: (event: ChangeEvent) => void;
}

export const OrderWeight: React.FC<OrderWeightProps> = ({
    noLimits,
    disabled,
    errors,
    maxValue = "",
    minValue = "",
    onChange,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    const formFields = ["minimumOrderWeight", "maximumOrderWeight"];
    const formErrors = getFormErrors(formFields, errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Order Weight",
                    id: "vWapBZ",
                    description: "card title",
                })}
            />
            <CardContent>
                <ControlledCheckbox
                    name="noLimits"
                    label={
                        <>
                            <FormattedMessage
                                defaultMessage="There are no value limits"
                                id="WTAwlQ"
                                description="checkbox label"
                            />
                            <Typography variant="caption" className={classes.caption}>
                                <FormattedMessage
                                    defaultMessage="This rate will apply to all orders"
                                    id="7v8suW"
                                    description="info text"
                                />
                            </Typography>
                        </>
                    }
                    checked={noLimits}
                    onChange={onChange}
                    disabled={disabled}
                />

                {!noLimits && (
                    <div className={classes.grid}>
                        <TextField
                            disabled={disabled}
                            helperText={getShippingWeightRateErrorMessage(
                                formErrors.minimumOrderWeight,
                                intl
                            )}
                            error={!!formErrors.minimumOrderWeight}
                            fullWidth
                            label={intl.formatMessage({
                                defaultMessage: "Min. Order Weight",
                                id: "w+5Djm",
                            })}
                            name="minValue"
                            type="number"
                            inputProps={{
                                min: 0,
                                type: "number",
                            }}
                            InputProps={{ inputProps: { min: 0 } }}
                            value={minValue}
                            onChange={onChange}
                        />
                        <TextField
                            disabled={disabled}
                            helperText={getShippingWeightRateErrorMessage(
                                formErrors.maximumOrderWeight,
                                intl
                            )}
                            error={!!formErrors.maximumOrderWeight}
                            fullWidth
                            label={intl.formatMessage({
                                defaultMessage: "Max. Order Weight",
                                id: "u0V06N",
                            })}
                            name="maxValue"
                            type="number"
                            InputProps={{ inputProps: { min: minValue } }}
                            value={maxValue}
                            onChange={onChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderWeight;

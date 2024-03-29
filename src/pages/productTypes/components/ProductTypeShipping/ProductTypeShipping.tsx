import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ControlledCheckbox } from "@mzawadie/components/ControlledCheckbox";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTypeShippingProps {
    data: {
        isShippingRequired: boolean;
        weight: number | null;
    };
    weightUnit: string;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeShipping: React.FC<ProductTypeShippingProps> = ({
    data,
    weightUnit,
    disabled,
    onChange,
}) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Shipping",
                    id: "/2OOMe",
                    description: "product type shipping settings, section header",
                })}
            />
            <CardContent>
                <ControlledCheckbox
                    checked={data.isShippingRequired}
                    disabled={disabled}
                    label={intl.formatMessage({
                        defaultMessage: "Is this product shippable?",
                        id: "IBw72y",
                        description: "switch button",
                    })}
                    name="isShippingRequired"
                    onChange={onChange}
                />
                {data.isShippingRequired && (
                    <TextField
                        disabled={disabled}
                        InputProps={{ endAdornment: weightUnit }}
                        label={intl.formatMessage({
                            defaultMessage: "Weight",
                            id: "zCb8fX",
                        })}
                        name="weight"
                        helperText={intl.formatMessage({
                            defaultMessage:
                                "Used to calculate rates for shipping for products of this product type, when specific weight is not given",
                            id: "VOiUXQ",
                        })}
                        type="number"
                        value={data.weight}
                        onChange={onChange}
                    />
                )}
            </CardContent>
        </Card>
    );
};

ProductTypeShipping.displayName = "ProductTypeShipping";

export default ProductTypeShipping;

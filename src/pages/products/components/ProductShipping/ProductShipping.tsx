// @ts-nocheck
import { Card, CardContent, InputAdornment, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Grid } from "@mzawadie/components/Grid";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import createNonNegativeValueChangeHandler from "@mzawadie/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

interface ProductShippingProps {
    data: {
        weight: string;
    };
    disabled: boolean;
    errors: ProductErrorFragment[];
    weightUnit: string;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductShipping: React.FC<ProductShippingProps> = (props) => {
    const { data, disabled, errors, weightUnit, onChange } = props;

    const intl = useIntl();

    const formErrors = getFormErrors(["weight"], errors);

    const handleChange = createNonNegativeValueChangeHandler(onChange);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Shipping",
                    id: "3rIMq/",
                    description: "product shipping",
                })}
            />

            <CardContent>
                <Grid variant="uniform">
                    <TextField
                        disabled={disabled}
                        label={intl.formatMessage({
                            defaultMessage: "Weight",
                            id: "SUbxSK",
                            description: "product weight",
                        })}
                        error={!!formErrors.weight}
                        helperText={getProductErrorMessage(formErrors.weight, intl)}
                        name="weight"
                        value={data.weight}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">{weightUnit || ""}</InputAdornment>
                            ),
                            inputProps: {
                                min: 0,
                            },
                        }}
                    />
                </Grid>
            </CardContent>
        </Card>
    );
};

ProductShipping.displayName = "ProductShipping";

export default ProductShipping;

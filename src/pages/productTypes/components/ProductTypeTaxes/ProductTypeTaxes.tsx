// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { SingleAutocompleteSelectField } from "@mzawadie/components/SingleAutocompleteSelectField";
import { maybe } from "@mzawadie/core";
import { ProductTypeDetailsQuery } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
    data: {
        taxType: string;
    };
    taxTypeDisplayName: string;
    taxTypes: ProductTypeDetailsQuery["taxTypes"];
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
    {
        root: {
            overflow: "visible",
        },
    },
    { name: "ProductTypeTaxes" }
);

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = (props) => {
    const { data, disabled, taxTypes, taxTypeDisplayName, onChange } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card className={classes.root}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Taxes",
                    description: "section header",
                    id: "mUb8Gt",
                })}
            />
            <CardContent>
                <SingleAutocompleteSelectField
                    disabled={disabled}
                    displayValue={taxTypeDisplayName}
                    label={intl.formatMessage({
                        defaultMessage: "Taxes",
                        id: "r+dgiv",
                    })}
                    name={"taxType" as keyof ProductTypeForm}
                    onChange={onChange}
                    value={data.taxType}
                    choices={maybe(
                        () => taxTypes.map((c) => ({ label: c.description, value: c.taxCode })),
                        []
                    )}
                    InputProps={{
                        autoComplete: "off",
                    }}
                />
            </CardContent>
        </Card>
    );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";

export default ProductTypeTaxes;

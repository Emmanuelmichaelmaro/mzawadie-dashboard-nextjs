// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import Hr from "@mzawadie/components/Hr";
import { SingleAutocompleteSelectField } from "@mzawadie/components/SingleAutocompleteSelectField";
import { sectionNames } from "@mzawadie/core";
import { TaxTypeFragment } from "@mzawadie/fragments/types/TaxTypeFragment";
import { FormChange } from "@mzawadie/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export interface ProductTaxesProps {
    data: {
        changeTaxCode: boolean;
        chargeTaxes: boolean;
        taxCode: string;
    };
    disabled: boolean;
    selectedTaxTypeDisplayName: string;
    taxTypes: TaxTypeFragment[];
    onChange: FormChange;
    onTaxTypeChange: FormChange;
}

const useStyles = makeStyles(
    (theme) => ({
        content: {
            paddingTop: theme.spacing(2),
        },
        hr: {
            margin: theme.spacing(2, 0),
        },
        select: {
            margin: theme.spacing(2, 0),
        },
    }),
    {
        name: "ProductTaxes",
    }
);

const ProductTaxes: React.FC<ProductTaxesProps> = ({
    data,
    disabled,
    selectedTaxTypeDisplayName,
    taxTypes,
    onChange,
    onTaxTypeChange,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <Card>
            <CardTitle title={intl.formatMessage(sectionNames.taxes)} />

            <CardContent className={classes.content}>
                <ControlledCheckbox
                    checked={data.changeTaxCode}
                    disabled={disabled}
                    data-test="override-tax-type"
                    label={intl.formatMessage({
                        defaultMessage: "Override the product type's tax rate",
                        id: "iYH3Y7",
                        description: "checkbox",
                    })}
                    name="changeTaxCode"
                    onChange={onChange}
                />

                <Hr className={classes.hr} />

                <ControlledCheckbox
                    checked={data.chargeTaxes}
                    disabled={disabled}
                    data-test="charge-taxes"
                    label={intl.formatMessage({
                        defaultMessage: "Charge taxes on this product",
                        id: "TfY/Pi",
                        description: "checkbox",
                    })}
                    name="chargeTaxes"
                    onChange={onChange}
                />

                {data.changeTaxCode && (
                    <SingleAutocompleteSelectField
                        className={classes.select}
                        disabled={disabled}
                        displayValue={selectedTaxTypeDisplayName}
                        data-test="select-tax-type"
                        label={intl.formatMessage({
                            defaultMessage: "Tax Rate",
                            id: "CdIHMu",
                            description: "select tax ratte",
                        })}
                        name="taxCode"
                        onChange={onTaxTypeChange}
                        value={data.taxCode}
                        choices={
                            taxTypes?.map((taxType) => ({
                                label: taxType.description,
                                value: taxType.taxCode,
                            })) || []
                        }
                        InputProps={{
                            autoComplete: "off",
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
};

ProductTaxes.displayName = "ProductTaxes";

export default ProductTaxes;

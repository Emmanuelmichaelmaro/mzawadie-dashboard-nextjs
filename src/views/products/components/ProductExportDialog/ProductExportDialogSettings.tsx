import Hr from "@mzawadie/components/Hr";
import RadioGroupField, { RadioGroupFieldChoice } from "@mzawadie/components/RadioGroupField";
import { ExportErrorFragment } from "@mzawadie/fragments/types/ExportErrorFragment";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { ExportProductsInput, ExportScope, FileTypesEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getExportErrorMessage from "@mzawadie/utils/errors/export";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        hr: {
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(3),
        },
    }),
    {
        name: "ProductExportDialogSettings",
    }
);

export type ProductQuantity = Record<"all" | "filter", number>;
export interface ProductExportDialogSettingsProps {
    data: ExportProductsInput;
    errors: ExportErrorFragment[];
    productQuantity: ProductQuantity;
    selectedProducts: number;
    onChange: (event: ChangeEvent) => void;
}

const formFields: Array<keyof ExportProductsInput> = ["fileType", "scope"];

const ProductExportDialogSettings: React.FC<ProductExportDialogSettingsProps> = ({
    data,
    errors,
    onChange,
    productQuantity,
    selectedProducts,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    const formErrors = getFormErrors(formFields, errors);

    const productsToExportChoices: Array<RadioGroupFieldChoice<ExportScope>> = [
        {
            label: intl.formatMessage(
                {
                    defaultMessage: "All products ({number})",
                    id: "A3vscs",
                    description: "export all products to csv file",
                },
                {
                    number: productQuantity.all || "...",
                }
            ),
            value: ExportScope.ALL,
        },
        {
            disabled: selectedProducts === 0,
            label: intl.formatMessage(
                {
                    defaultMessage: "Selected products ({number})",
                    id: "rpWd01",
                    description: "export selected products to csv file",
                },
                {
                    number: selectedProducts,
                }
            ),
            value: ExportScope.IDS,
        },
        {
            label: intl.formatMessage(
                {
                    defaultMessage: "Current search ({number})",
                    id: "NSLOzz",
                    description: "export filtered products to csv file",
                },
                {
                    number: productQuantity.filter || "...",
                }
            ),
            value: ExportScope.FILTER,
        },
    ];

    const productExportTypeChoices: Array<RadioGroupFieldChoice<FileTypesEnum>> = [
        {
            label: intl.formatMessage({
                defaultMessage: "Spreadsheet for Excel, Numbers etc.",
                id: "WvBKlP",
                description: "export products as spreadsheet",
            }),
            value: FileTypesEnum.XLSX,
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Plain CSV file",
                id: "GEaa/6",
                description: "export products as csv file",
            }),
            value: FileTypesEnum.CSV,
        },
    ];

    return (
        <>
            <RadioGroupField
                choices={productsToExportChoices}
                error={!!formErrors.scope}
                hint={getExportErrorMessage(formErrors.scope, intl)}
                label={intl.formatMessage({
                    defaultMessage: "Export information for:",
                    id: "Q91GFo",
                    description: "export products to csv file, choice field label",
                })}
                name={"scope" as keyof ExportProductsInput}
                onChange={onChange}
                value={data.scope}
            />
            <Hr className={classes.hr} />
            <RadioGroupField
                choices={productExportTypeChoices}
                error={!!formErrors.fileType}
                hint={getExportErrorMessage(formErrors.fileType, intl)}
                label={intl.formatMessage({
                    defaultMessage: "Export as:",
                    id: "OWdFaj",
                    description: "export products as csv or spreadsheet file",
                })}
                name={"fileType" as keyof ExportProductsInput}
                onChange={onChange}
                value={data.fileType}
            />
        </>
    );
};

ProductExportDialogSettings.displayName = "ProductExportDialogSettings";

export default ProductExportDialogSettings;

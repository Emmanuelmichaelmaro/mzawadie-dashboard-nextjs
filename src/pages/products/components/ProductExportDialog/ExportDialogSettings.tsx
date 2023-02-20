import Hr from "@mzawadie/components/Hr";
import { RadioGroupField, RadioGroupFieldChoice } from "@mzawadie/components/RadioGroupField";
import { ExportErrorFragment } from "@mzawadie/fragments/types/ExportErrorFragment";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { ExportProductsInput, ExportScope, FileTypesEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getExportErrorMessage from "@mzawadie/utils/errors/export";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ExportSettingsInput } from "./types";

const useStyles = makeStyles(
    (theme) => ({
        hr: {
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(3),
        },
    }),
    {
        name: "ExportDialogSettings",
    }
);

export type ExportItemsQuantity = Record<"all" | "filter", number>;

export interface ExportScopeLabels {
    allItems: string;
    selectedItems: string;
}

export interface ExportDialogSettingsProps {
    data: ExportSettingsInput;
    errors: ExportErrorFragment[];
    itemsQuantity: ExportItemsQuantity;
    selectedItems: number;
    exportScopeLabels: ExportScopeLabels;
    onChange: (event: ChangeEvent) => void;
    allowScopeSelection?: boolean;
}

const formFields: Array<keyof ExportSettingsInput> = ["fileType", "scope"];

const ExportDialogSettings: React.FC<ExportDialogSettingsProps> = ({
    data,
    errors,
    onChange,
    selectedItems,
    itemsQuantity,
    exportScopeLabels,
    allowScopeSelection = true,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    const formErrors = getFormErrors(formFields, errors);

    const productExportTypeChoices: Array<RadioGroupFieldChoice<FileTypesEnum>> = [
        {
            label: intl.formatMessage({
                defaultMessage: "Spreadsheet for Excel, Numbers etc.",
                id: "9Tl/bT",
                description: "export items as spreadsheet",
            }),
            value: FileTypesEnum.XLSX,
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Plain CSV file",
                id: "li1BBk",
                description: "export items as csv file",
            }),
            value: FileTypesEnum.CSV,
        },
    ];

    const exportScopeChoices = [
        {
            label: exportScopeLabels.allItems,
            value: ExportScope.ALL,
        },
        {
            disabled: selectedItems === 0,
            label: exportScopeLabels.selectedItems,
            value: ExportScope.IDS,
        },
        {
            label: intl.formatMessage(
                {
                    defaultMessage: "Current search ({number})",
                    id: "SZt9kC",
                    description: "export filtered items to csv file",
                },
                {
                    number: itemsQuantity.filter || "...",
                }
            ),
            value: ExportScope.FILTER,
        },
    ];

    return (
        <>
            {allowScopeSelection && (
                <>
                    <RadioGroupField
                        choices={exportScopeChoices}
                        error={!!formErrors.scope}
                        hint={getExportErrorMessage(formErrors.scope, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "Export information for:",
                            id: "g6yuk2",
                            description: "export items to csv file, choice field label",
                        })}
                        name={"scope" as keyof ExportProductsInput}
                        onChange={onChange}
                        value={data.scope}
                    />
                    <Hr className={classes.hr} />
                </>
            )}

            <RadioGroupField
                choices={productExportTypeChoices}
                error={!!formErrors.fileType}
                hint={getExportErrorMessage(formErrors.fileType, intl)}
                label={intl.formatMessage({
                    defaultMessage: "Export as:",
                    id: "z1puMb",
                    description: "export items as csv or spreadsheet file",
                })}
                name={"fileType" as keyof ExportProductsInput}
                onChange={onChange}
                value={data.fileType}
            />
        </>
    );
};

export default ExportDialogSettings;

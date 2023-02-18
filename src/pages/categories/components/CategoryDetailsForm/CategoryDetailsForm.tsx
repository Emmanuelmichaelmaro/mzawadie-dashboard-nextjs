// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { RichTextEditor, RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { commonMessages } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

interface CategoryDetailsFormProps {
    data: {
        name: string;
        description: OutputData;
    };
    disabled: boolean;
    errors: ProductErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
    onDescriptionChange: RichTextEditorChange;
}

export const CategoryDetailsForm: React.FC<CategoryDetailsFormProps> = ({
    disabled,
    data,
    onChange,
    onDescriptionChange,
    errors,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name", "description"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />

            <CardContent>
                <div>
                    <TextField
                        label={intl.formatMessage({
                            defaultMessage: "Category Name",
                            id: "vEYtiq",
                        })}
                        name="name"
                        disabled={disabled}
                        value={data && data.name}
                        onChange={onChange}
                        error={!!formErrors.name}
                        helperText={getProductErrorMessage(formErrors.name, intl)}
                        fullWidth
                    />
                </div>

                <FormSpacer />

                <RichTextEditor
                    data={data.description}
                    disabled={disabled}
                    error={!!formErrors.description}
                    helperText={getProductErrorMessage(formErrors.description, intl)}
                    label={intl.formatMessage({
                        defaultMessage: "Category Description",
                        id: "8HRy+U",
                    })}
                    name="description"
                    onChange={onDescriptionChange}
                />
            </CardContent>
        </Card>
    );
};

export default CategoryDetailsForm;

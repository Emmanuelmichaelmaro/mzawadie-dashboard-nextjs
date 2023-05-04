// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { RichTextEditor } from "@mzawadie/components/RichTextEditor";
import { RichTextEditorLoading } from "@mzawadie/components/RichTextEditor/RichTextEditorLoading";
import { commonMessages } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/graphql";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import { useRichTextContext } from "@mzawadie/utils/richText/context";
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
}

export const CategoryDetailsForm: React.FC<CategoryDetailsFormProps> = ({
    disabled,
    data,
    onChange,
    errors,
}) => {
    const intl = useIntl();

    const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();

    const formErrors = getFormErrors(["name", "description"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />

            <CardContent>
                <div>
                    <TextField
                        label={intl.formatMessage({
                            id: "vEYtiq",
                            defaultMessage: "Category Name",
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

                {isReadyForMount ? (
                    <RichTextEditor
                        defaultValue={defaultValue}
                        editorRef={editorRef}
                        onChange={handleChange}
                        disabled={disabled}
                        error={!!formErrors.description}
                        helperText={getProductErrorMessage(formErrors.description, intl)}
                        label={intl.formatMessage({
                            id: "8HRy+U",
                            defaultMessage: "Category Description",
                        })}
                        name="description"
                    />
                ) : (
                    <RichTextEditorLoading
                        label={intl.formatMessage({
                            id: "8HRy+U",
                            defaultMessage: "Category Description",
                        })}
                        name="description"
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default CategoryDetailsForm;

// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { Grid } from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import { RichTextEditor } from "@mzawadie/components/RichTextEditor";
import { RichTextEditorLoading } from "@mzawadie/components/RichTextEditor/RichTextEditorLoading";
import { commonMessages } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/graphql";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import { useRichTextContext } from "@mzawadie/utils/richText/context";
import React from "react";
import { useIntl } from "react-intl";

interface ProductDetailsFormProps {
    data: {
        description: OutputData;
        name: string;
        rating: number;
    };
    disabled?: boolean;
    errors: ProductErrorFragment[];

    onChange(event: any);
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
    data,
    disabled,
    errors,
    onChange,
}) => {
    const intl = useIntl();

    const { editorRef, defaultValue, isReadyForMount, handleChange } = useRichTextContext();

    const formErrors = getFormErrors(["name", "description", "rating"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />

            <CardContent>
                <TextField
                    error={!!formErrors.name}
                    helperText={getProductErrorMessage(formErrors.name, intl)}
                    disabled={disabled}
                    fullWidth
                    label={intl.formatMessage({
                        id: "6AMFki",
                        defaultMessage: "Name",
                        description: "product name",
                    })}
                    name="name"
                    value={data.name}
                    onChange={onChange}
                />

                <FormSpacer />

                {isReadyForMount ? (
                    <RichTextEditor
                        editorRef={editorRef}
                        defaultValue={defaultValue}
                        onChange={handleChange}
                        disabled={disabled}
                        error={!!formErrors.description}
                        helperText={getProductErrorMessage(formErrors.description, intl)}
                        label={intl.formatMessage(commonMessages.description)}
                        name="description"
                    />
                ) : (
                    <RichTextEditorLoading
                        label={intl.formatMessage(commonMessages.description)}
                        name="description"
                    />
                )}

                <FormSpacer />

                <Hr />

                <FormSpacer />

                <Grid variant="uniform">
                    <TextField
                        type="number"
                        error={!!formErrors.rating}
                        helperText={getProductErrorMessage(formErrors.rating, intl)}
                        disabled={disabled}
                        label={intl.formatMessage({
                            id: "L7N+0y",
                            defaultMessage: "Product Rating",
                            description: "product rating",
                        })}
                        name="rating"
                        value={data.rating || ""}
                        onChange={onChange}
                    />
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ProductDetailsForm;

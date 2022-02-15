/* eslint-disable react/require-default-props */
// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Grid from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import RichTextEditor, { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { commonMessages } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
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

    onDescriptionChange: RichTextEditorChange;
    onChange: (event: any) => any;
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
    data,
    disabled,
    errors,
    onDescriptionChange,
    onChange,
}) => {
    const intl = useIntl();

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
                        defaultMessage: "Name",
                        id: "6AMFki",
                        description: "product name",
                    })}
                    name="name"
                    value={data.name}
                    onChange={onChange}
                />
                <FormSpacer />
                <RichTextEditor
                    data={data.description}
                    disabled={disabled}
                    error={!!formErrors.description}
                    helperText={getProductErrorMessage(formErrors.description, intl)}
                    label={intl.formatMessage(commonMessages.description)}
                    name="description"
                    onChange={onDescriptionChange}
                />
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
                            defaultMessage: "Product Rating",
                            id: "L7N+0y",
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

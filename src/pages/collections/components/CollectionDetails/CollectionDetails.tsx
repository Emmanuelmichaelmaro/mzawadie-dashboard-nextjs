// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { RichTextEditor, RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { commonMessages } from "@mzawadie/core";
import { CollectionErrorFragment } from "@mzawadie/fragments/types/CollectionErrorFragment";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

export interface CollectionDetailsProps {
    data: {
        description: OutputData;
        name: string;
    };
    disabled: boolean;
    errors: CollectionErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
    onDescriptionChange: RichTextEditorChange;
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
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
                <TextField
                    label={intl.formatMessage({
                        defaultMessage: "Name",
                        id: "/WXs6H",
                        description: "collection name",
                    })}
                    name="name"
                    disabled={disabled}
                    value={data.name}
                    onChange={onChange}
                    error={!!formErrors.name}
                    helperText={getProductErrorMessage(formErrors.name, intl)}
                    fullWidth
                />
                <FormSpacer />
                <RichTextEditor
                    data={data.description}
                    error={!!formErrors.description}
                    helperText={getProductErrorMessage(formErrors.description, intl)}
                    label={intl.formatMessage(commonMessages.description)}
                    name="description"
                    disabled={disabled}
                    onChange={onDescriptionChange}
                />
            </CardContent>
        </Card>
    );
};

export default CollectionDetails;

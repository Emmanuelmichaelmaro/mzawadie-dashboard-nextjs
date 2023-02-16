import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface CustomerCreateNoteProps {
    data: {
        note: string;
    };
    disabled: boolean;
    errors: AccountErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateNote: React.FC<CustomerCreateNoteProps> = ({
    data,
    disabled,
    errors,
    onChange,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["note"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Notes",
                    id: "qNcoRY",
                    description: "notes about customer header",
                })}
            />

            <CardContent>
                <Typography>
                    <FormattedMessage
                        defaultMessage="Enter any extra information regarding this customer."
                        id="wpONQ2"
                    />
                </Typography>

                <FormSpacer />

                <TextField
                    disabled={disabled}
                    error={!!formErrors.note}
                    fullWidth
                    multiline
                    name="note"
                    helperText={getAccountErrorMessage(formErrors.note, intl)}
                    label={intl.formatMessage({
                        defaultMessage: "Note",
                        id: "uUQ+Al",
                        description: "note about customer",
                    })}
                    value={data.note}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

CustomerCreateNote.displayName = "CustomerCreateNote";

export default CustomerCreateNote;

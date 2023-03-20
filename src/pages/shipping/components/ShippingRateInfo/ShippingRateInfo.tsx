// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { RichTextEditor, RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { commonMessages } from "@mzawadie/core";
import { ShippingErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getShippingErrorMessage from "@mzawadie/utils/errors/shipping";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
    maxDays: {
        defaultMessage: "Max Delivery Time",
        id: "v17Lly",
        description: "label",
    },
    minDays: {
        defaultMessage: "Min Delivery Time",
        id: "GD/bom",
        description: "label",
    },
    name: {
        defaultMessage: "Shipping rate name",
        id: "FkDObY",
        description: "label",
    },
    description: {
        defaultMessage: "Shipping Rate Description",
        id: "TLYeo5",
        description: "label",
    },
});

const useStyles = makeStyles(
    (theme) => ({
        deliveryTimeFields: {
            display: "grid",
            gridColumnGap: theme.spacing(2),
            gridRowGap: theme.spacing(1),
            gridTemplateColumns: "1fr 1fr 1fr",
            [theme.breakpoints.down("md")]: {
                gridTemplateColumns: "1fr 1fr",
            },
            [theme.breakpoints.down("xs")]: {
                gridTemplateColumns: "1fr",
            },
        },
    }),
    { name: "ShippingRateInfo" }
);

export interface ShippingRateInfoProps {
    data: {
        description: OutputData;
        name: string;
        maxDays: string;
        minDays: string;
    };
    disabled: boolean;
    errors: ShippingErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
    onDescriptionChange: RichTextEditorChange;
}

const ShippingRateInfo: React.FC<ShippingRateInfoProps> = (props) => {
    const { data, disabled, errors, onChange, onDescriptionChange } = props;

    const intl = useIntl();
    const classes = useStyles(props);

    const formErrors = getFormErrors(["name", "description", "minDays", "maxDays"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    fullWidth
                    helperText={getShippingErrorMessage(formErrors.name, intl)}
                    label={intl.formatMessage(messages.name)}
                    name="name"
                    value={data.name}
                    onChange={onChange}
                />
                <CardSpacer />
                <RichTextEditor
                    data={data.description}
                    disabled={disabled}
                    error={!!formErrors.description}
                    helperText={getShippingErrorMessage(formErrors.description, intl)}
                    label={intl.formatMessage(messages.description)}
                    name="description"
                    onChange={onDescriptionChange}
                />
                <CardSpacer />
                <div className={classes.deliveryTimeFields}>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.minDays}
                        fullWidth
                        helperText={getShippingErrorMessage(formErrors.minDays, intl)}
                        label={intl.formatMessage(messages.minDays)}
                        type="number"
                        inputProps={{
                            min: 0,
                            type: "number",
                        }}
                        InputProps={{ inputProps: { min: 0 } }}
                        name="minDays"
                        value={data.minDays}
                        onChange={onChange}
                    />
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.maxDays}
                        fullWidth
                        helperText={getShippingErrorMessage(formErrors.maxDays, intl)}
                        label={intl.formatMessage(messages.maxDays)}
                        type="number"
                        inputProps={{
                            min: 0,
                            type: "number",
                        }}
                        InputProps={{ inputProps: { min: 0 } }}
                        name="maxDays"
                        value={data.maxDays}
                        onChange={onChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
ShippingRateInfo.displayName = "ShippingRateInfo";
export default ShippingRateInfo;

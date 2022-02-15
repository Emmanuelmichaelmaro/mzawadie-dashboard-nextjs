import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { commonMessages } from "@mzawadie/core";
import { WebhookErrorFragment } from "@mzawadie/fragments/types/WebhookErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getWebhookErrorMessage from "@mzawadie/utils/errors/webhooks";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { FormData } from "../WebhooksDetailsPage";

interface WebhookInfoProps {
    data: FormData;
    disabled: boolean;
    errors: WebhookErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
    () => ({
        status: {
            paddingTop: 20,
        },
        title: {
            fontSize: 16,
            lineHeight: 1.9,
            paddingBottom: 10,
        },
    }),
    { name: "WebhookInfo" }
);

const WebhookInfo: React.FC<WebhookInfoProps> = ({ data, disabled, errors, onChange }) => {
    const classes = useStyles({});
    const intl = useIntl();

    const formErrors = getFormErrors(["name", "targetUrl", "secretKey"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Webhook Information",
                    id: "WDy0tF",
                    description: "section header",
                })}
            />
            <CardContent>
                <Typography className={classes.title}>
                    {intl.formatMessage(commonMessages.generalInformations)}
                </Typography>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.name}
                    helperText={getWebhookErrorMessage(formErrors.name, intl)}
                    label={intl.formatMessage({
                        defaultMessage: "Webhook Name",
                        id: "aP3drn",
                        description: "webhook",
                    })}
                    fullWidth
                    name="name"
                    value={data.name}
                    onChange={onChange}
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                <Typography className={classes.title}>
                    {intl.formatMessage({
                        defaultMessage: "Webhook specific information",
                        id: "oEriGO",
                        description: "webhook specific information",
                    })}
                </Typography>
                <FormSpacer />
                <TextField
                    disabled={disabled}
                    error={!!formErrors.targetUrl}
                    helperText={
                        getWebhookErrorMessage(formErrors.targetUrl, intl) ||
                        intl.formatMessage({
                            defaultMessage: "This URL will receive webhook POST requests",
                            id: "QgOYGu",
                            description: "webhook target url help text",
                        })
                    }
                    label={intl.formatMessage({
                        defaultMessage: "Target URL",
                        id: "5Xrsdh",
                        description: "webhook",
                    })}
                    fullWidth
                    name="targetUrl"
                    value={data.targetUrl}
                    onChange={onChange}
                />
                <FormSpacer />
                <TextField
                    disabled={disabled}
                    error={!!formErrors.secretKey}
                    helperText={
                        getWebhookErrorMessage(formErrors.secretKey, intl) ||
                        intl.formatMessage({
                            defaultMessage:
                                "secret key is used to create a hash signature with each payload. *optional field",
                            id: "JC/4wg",
                            description: "webhook secret key help text",
                        })
                    }
                    label={intl.formatMessage({
                        defaultMessage: "Secret Key",
                        id: "QCtulm",
                        description: "webhook",
                    })}
                    fullWidth
                    name="secretKey"
                    value={data.secretKey}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

WebhookInfo.displayName = "WebhookInfo";

export default WebhookInfo;

import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import React from "react";
import { useIntl } from "react-intl";

import { FormData } from "../WebhooksDetailsPage";

interface WebhookStatusProps {
    data: boolean;
    disabled: boolean;
    onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookStatus: React.FC<WebhookStatusProps> = ({ data, disabled, onChange }) => {
    const intl = useIntl();
    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Webhook Status",
                    id: "1+M/52",
                    description: "section header",
                })}
            />
            <CardContent>
                <Typography>
                    {intl.formatMessage({
                        defaultMessage:
                            "If you want to disable this webhook please uncheck the box below.",
                        id: "bpR/Z1",
                        description: "webhook active",
                    })}
                </Typography>
                <ControlledCheckbox
                    name={"isActive" as keyof FormData}
                    label={intl.formatMessage({
                        defaultMessage: "Webhook is active",
                        id: "D+v6qv",
                        description: "webhooks active",
                    })}
                    checked={data}
                    onChange={onChange}
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
};

WebhookStatus.displayName = "WebhookStatus";

export default WebhookStatus;

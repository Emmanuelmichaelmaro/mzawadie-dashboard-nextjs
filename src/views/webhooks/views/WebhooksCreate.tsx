// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { WebhookEventTypeEnum } from "@mzawadie/types/globalTypes";
import { useAppDetails } from "@mzawadie/views/apps/queries";
import { customAppUrl } from "@mzawadie/views/apps/urls";
import React from "react";
import { useIntl } from "react-intl";

import WebhookCreatePage, { FormData } from "../components/WebhookCreatePage";
import { useWebhookCreateMutation } from "../mutations";
import { WebhookCreate as WebhookCreateData } from "../types/WebhookCreate";
import { webhookUrl } from "../urls";

export interface WebhooksCreateProps {
    id: string;
}

export const WebhooksCreate: React.FC<WebhooksCreateProps> = ({ id }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data } = useAppDetails({ variables: { id } });

    const onSubmit = (data: WebhookCreateData) => {
        if (data.webhookCreate.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate(webhookUrl(data.webhookCreate.webhook.id));
        }
    };
    const [webhookCreate, webhookCreateOpts] = useWebhookCreateMutation({
        onCompleted: onSubmit,
    });

    const handleBack = () => navigate(customAppUrl(id));

    const handleSubmit = (data: FormData) =>
        webhookCreate({
            variables: {
                input: {
                    app: id,
                    events: data.allEvents ? [WebhookEventTypeEnum.ANY_EVENTS] : data.events,
                    isActive: data.isActive,
                    name: data.name,
                    secretKey: data.secretKey,
                    targetUrl: data.targetUrl,
                },
            },
        });

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create Webhook",
                    id: "JVaz1C",
                    description: "window title",
                })}
            />
            <WebhookCreatePage
                appName={data?.app?.name}
                disabled={false}
                errors={webhookCreateOpts.data?.webhookCreate.errors || []}
                onBack={handleBack}
                onSubmit={handleSubmit}
                saveButtonBarState={webhookCreateOpts.status}
            />
        </>
    );
};

WebhooksCreate.displayName = "WebhooksCreate";

export default WebhooksCreate;

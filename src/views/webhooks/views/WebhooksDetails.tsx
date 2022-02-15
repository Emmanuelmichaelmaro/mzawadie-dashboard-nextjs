/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import NotFoundPage from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, getStringOrPlaceholder } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { WebhookEventTypeEnum } from "@mzawadie/types/globalTypes";
import { customAppUrl } from "@mzawadie/views/apps/urls";
import { WebhookUpdate } from "@mzawadie/views/webhooks/types/WebhookUpdate";
import React from "react";
import { useIntl } from "react-intl";

import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { useWebhookUpdateMutation } from "../mutations";
import { useWebhooksDetailsQuery } from "../queries";

export interface WebhooksDetailsProps {
    id: string;
}

export const WebhooksDetails: React.FC<WebhooksDetailsProps> = ({ id }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const onWebhookUpdate = (data: WebhookUpdate) => {
        const errors = data.webhookUpdate?.errors;
        const webhook = data.webhookUpdate?.webhook;

        if (errors.length === 0 && webhook) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
        }
    };

    const [webhookUpdate, webhookUpdateOpts] = useWebhookUpdateMutation({
        onCompleted: onWebhookUpdate,
    });
    const { data: webhookDetails, loading } = useWebhooksDetailsQuery({
        variables: { id },
    });

    const handleOnBack = () => navigate(customAppUrl(webhookDetails.webhook.app.id));

    const webhook = webhookDetails?.webhook;
    const formErrors = webhookUpdateOpts.data?.webhookUpdate.errors || [];

    if (webhook === null) {
        return <NotFoundPage onBack={handleOnBack} />;
    }

    return (
        <>
            <WindowTitle title={getStringOrPlaceholder(webhookDetails?.webhook?.name)} />
            <WebhooksDetailsPage
                appName={webhook?.app?.name}
                disabled={loading}
                errors={formErrors}
                saveButtonBarState={webhookUpdateOpts.status}
                webhook={webhook}
                onBack={handleOnBack}
                onSubmit={(data) => {
                    webhookUpdate({
                        variables: {
                            id,
                            input: {
                                events: data.allEvents
                                    ? [WebhookEventTypeEnum.ANY_EVENTS]
                                    : data.events,
                                isActive: data.isActive,
                                name: data.name,
                                secretKey: data.secretKey,
                                targetUrl: data.targetUrl,
                            },
                        },
                    });
                }}
            />
        </>
    );
};

WebhooksDetails.displayName = "WebhooksDetails";

export default WebhooksDetails;

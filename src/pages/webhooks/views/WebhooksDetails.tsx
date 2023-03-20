// @ts-nocheck
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, extractMutationErrors, getStringOrPlaceholder } from "@mzawadie/core";
import {
    WebhookEventTypeAsyncEnum,
    useWebhookUpdateMutation,
    useWebhookDetailsQuery,
    WebhookUpdateMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { customAppUrl } from "@mzawadie/pages/apps/urls";
import React from "react";
import { useIntl } from "react-intl";

import { WebhookDetailsPage } from "../components/WebhookDetailsPage";
import { WebhookFormData } from "../components/WebhooksDetailsPage";

export interface WebhooksDetailsProps {
    id: string;
}

export const WebhooksDetails: React.FC<WebhooksDetailsProps> = ({ id }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const onWebhookUpdate = (data: WebhookUpdateMutation) => {
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

    const { data: webhookDetails, loading } = useWebhookDetailsQuery({
        variables: { id },
    });

    const handleOnBack = () => navigate(customAppUrl(webhookDetails?.webhook?.app.id));

    const webhook = webhookDetails?.webhook;

    const formErrors = webhookUpdateOpts.data?.webhookUpdate?.errors || [];

    if (webhook === null) {
        return <NotFoundPage onBack={handleOnBack} />;
    }

    const handleSubmit = (data: WebhookFormData) =>
        extractMutationErrors(
            webhookUpdate({
                variables: {
                    id,
                    input: {
                        syncEvents: data.syncEvents,
                        asyncEvents: data.asyncEvents.includes(WebhookEventTypeAsyncEnum.ANY_EVENTS)
                            ? [WebhookEventTypeAsyncEnum.ANY_EVENTS]
                            : data.asyncEvents,
                        isActive: data.isActive,
                        name: data.name,
                        secretKey: data.secretKey,
                        targetUrl: data.targetUrl,
                    },
                },
            })
        );

    return (
        <>
            <WindowTitle title={getStringOrPlaceholder(webhookDetails?.webhook?.name)} />
            <WebhookDetailsPage
                appName={webhook?.app?.name}
                disabled={loading}
                errors={formErrors}
                saveButtonBarState={webhookUpdateOpts.status}
                webhook={webhook}
                onBack={handleOnBack}
                onSubmit={handleSubmit}
            />
        </>
    );
};

WebhooksDetails.displayName = "WebhooksDetails";

export default WebhooksDetails;

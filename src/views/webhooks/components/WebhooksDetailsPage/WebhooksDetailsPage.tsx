import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { WebhookErrorFragment } from "@mzawadie/fragments/types/WebhookErrorFragment";
import { WebhookEventTypeEnum } from "@mzawadie/types/globalTypes";
import WebhookEvents from "@mzawadie/views/webhooks/components/WebhookEvents";
import WebhookInfo from "@mzawadie/views/webhooks/components/WebhookInfo";
import WebhookStatus from "@mzawadie/views/webhooks/components/WebhookStatus";
import { WebhookDetails_webhook } from "@mzawadie/views/webhooks/types/WebhookDetails";
import { isUnnamed } from "@mzawadie/views/webhooks/utils";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export interface FormData {
    events: WebhookEventTypeEnum[];
    isActive: boolean;
    name: string;
    secretKey: string | null;
    targetUrl: string;
    allEvents: boolean;
}

export interface WebhooksDetailsPageProps {
    appName: string;
    disabled: boolean;
    errors: WebhookErrorFragment[];
    webhook: WebhookDetails_webhook;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: FormData) => void;
}

const WebhooksDetailsPage: React.FC<WebhooksDetailsPageProps> = ({
    appName,
    disabled,
    errors,
    webhook,
    saveButtonBarState,
    onBack,
    onSubmit,
}) => {
    const intl = useIntl();
    const initialForm: FormData = {
        allEvents: !!webhook?.events?.find(
            (event) => event.eventType === WebhookEventTypeEnum.ANY_EVENTS
        ),
        events:
            webhook?.events
                ?.map((event) => event.eventType)
                .filter((event) => event !== WebhookEventTypeEnum.ANY_EVENTS) || [],
        isActive: !!webhook?.isActive,
        name: webhook?.name || "",
        secretKey: webhook?.secretKey || "",
        targetUrl: webhook?.targetUrl || "",
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ data, hasChanged, submit, change }) => (
                <Container>
                    <Backlink onClick={onBack}>{appName}</Backlink>
                    <PageHeader
                        title={
                            isUnnamed(webhook)
                                ? intl.formatMessage({
                                      defaultMessage: "Unnamed Webhook Details",
                                      id: "snUby7",
                                      description: "header",
                                  })
                                : intl.formatMessage(
                                      {
                                          defaultMessage: "{webhookName} Details",
                                          id: "OPtrMg",
                                          description: "header",
                                      },
                                      {
                                          webhookName: getStringOrPlaceholder(webhook?.name),
                                      }
                                  )
                        }
                    />
                    <Grid>
                        <div>
                            <WebhookInfo
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                            />
                        </div>
                        <div>
                            <WebhookEvents data={data} onChange={change} disabled={disabled} />
                            <FormSpacer />
                            <WebhookStatus data={data.isActive} disabled={disabled} onChange={change} />
                        </div>
                    </Grid>
                    <Savebar
                        disabled={disabled || !hasChanged}
                        state={saveButtonBarState}
                        onCancel={onBack}
                        onSubmit={submit}
                    />
                </Container>
            )}
        </Form>
    );
};

WebhooksDetailsPage.displayName = "WebhooksDetailsPage";

export default WebhooksDetailsPage;

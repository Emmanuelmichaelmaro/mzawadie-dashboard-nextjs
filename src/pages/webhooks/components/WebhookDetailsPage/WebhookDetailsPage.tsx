// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import {
    WebhookDetailsQuery,
    WebhookErrorFragment,
    WebhookEventTypeAsyncEnum,
    WebhookEventTypeSyncEnum,
} from "@mzawadie/graphql";
import { WebhookEvents } from "@mzawadie/pages/webhooks/components/WebhookEvents";
import { WebhookInfo } from "@mzawadie/pages/webhooks/components/WebhookInfo";
import { WebhookStatus } from "@mzawadie/pages/webhooks/components/WebhookStatus";
import {
    createAsyncEventsSelectHandler,
    createSyncEventsSelectHandler,
} from "@mzawadie/pages/webhooks/handlers";
import { mapAsyncEventsToChoices, mapSyncEventsToChoices } from "@mzawadie/pages/webhooks/utils";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { getHeaderTitle } from "./messages";

export interface FormData {
    syncEvents: WebhookEventTypeSyncEnum[];
    asyncEvents: WebhookEventTypeAsyncEnum[];
    isActive: boolean;
    name: string;
    secretKey: string | null;
    targetUrl: string;
}

export interface WebhookDetailsPageProps {
    appName: string;
    disabled: boolean;
    errors: WebhookErrorFragment[];
    webhook?: WebhookDetailsQuery["webhook"];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: FormData) => void;
}

const WebhookDetailsPage: React.FC<WebhookDetailsPageProps> = ({
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
        syncEvents: webhook?.syncEvents?.map((event) => event.eventType) || [],
        asyncEvents: webhook?.asyncEvents?.map((event) => event.eventType) || [],
        isActive: !!webhook?.isActive,
        name: webhook?.name || "",
        secretKey: webhook?.secretKey || "",
        targetUrl: webhook?.targetUrl || "",
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ data, hasChanged, submit, change }) => {
                const syncEventsChoices = disabled
                    ? []
                    : mapSyncEventsToChoices(Object.values(WebhookEventTypeSyncEnum));

                const asyncEventsChoices = disabled
                    ? []
                    : mapAsyncEventsToChoices(
                          Object.values(WebhookEventTypeAsyncEnum),
                          data.asyncEvents
                      );

                const handleSyncEventsSelect = createSyncEventsSelectHandler(change, data.syncEvents);

                const handleAsyncEventsSelect = createAsyncEventsSelectHandler(
                    change,
                    data.asyncEvents
                );

                return (
                    <Container>
                        <Backlink onClick={onBack}>{appName}</Backlink>
                        <PageHeader title={getHeaderTitle(intl, webhook)} />
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
                                <WebhookStatus
                                    data={data.isActive}
                                    disabled={disabled}
                                    onChange={change}
                                />

                                <FormSpacer />

                                <WebhookEvents
                                    data={data}
                                    syncEventsChoices={syncEventsChoices}
                                    asyncEventsChoices={asyncEventsChoices}
                                    onSyncEventChange={handleSyncEventsSelect}
                                    onAsyncEventChange={handleAsyncEventsSelect}
                                />
                            </div>
                        </Grid>

                        <Savebar
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                            onCancel={onBack}
                            onSubmit={submit}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

WebhookDetailsPage.displayName = "WebhookDetailsPage";

export default WebhookDetailsPage;

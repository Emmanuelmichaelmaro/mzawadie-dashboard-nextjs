import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { WebhookErrorFragment } from "@mzawadie/fragments/types/WebhookErrorFragment";
import { WebhookEventTypeEnum } from "@mzawadie/types/globalTypes";
import WebhookEvents from "@mzawadie/views/webhooks/components/WebhookEvents";
import WebhookInfo from "@mzawadie/views/webhooks/components/WebhookInfo";
import WebhookStatus from "@mzawadie/views/webhooks/components/WebhookStatus";
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

export interface WebhookCreatePageProps {
    appName: string;
    disabled: boolean;
    errors: WebhookErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: FormData) => void;
}

const WebhookCreatePage: React.FC<WebhookCreatePageProps> = ({
    appName = "",
    disabled,
    errors,
    saveButtonBarState,
    onBack,
    onSubmit,
}) => {
    const intl = useIntl();
    const initialForm: FormData = {
        allEvents: false,
        events: [],
        isActive: false,
        name: "",
        secretKey: "",
        targetUrl: "",
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ data, hasChanged, submit, change }) => (
                <Container>
                    <Backlink onClick={onBack}>{appName}</Backlink>
                    <PageHeader
                        title={intl.formatMessage({
                            defaultMessage: "Create Webhook",
                            id: "Ryh3iR",
                            description: "header",
                        })}
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
                            <WebhookEvents data={data} disabled={disabled} onChange={change} />
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

WebhookCreatePage.displayName = "WebhookCreatePage";

export default WebhookCreatePage;

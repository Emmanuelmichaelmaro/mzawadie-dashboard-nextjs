// @ts-nocheck
import { WebhookErrorCode } from "@mzawadie/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import { webhook } from "../../fixtures";
import WebhooksDetailsPage, { WebhooksDetailsPageProps } from "./WebhooksDetailsPage";

const props: WebhooksDetailsPageProps = {
    appName: "app",
    disabled: false,
    errors: [],
    onBack: () => undefined,
    onSubmit: () => undefined,
    saveButtonBarState: "default",
    webhook,
};
storiesOf("Views / Apps / Webhooks / Webhook details", module)
    .addDecorator(Decorator)
    .add("default", () => <WebhooksDetailsPage {...props} />)
    .add("unnamed", () => <WebhooksDetailsPage {...props} webhook={{ ...webhook, name: null }} />)
    .add("loading", () => <WebhooksDetailsPage {...props} webhook={undefined} disabled />)
    .add("form errors", () => (
        <WebhooksDetailsPage
            {...props}
            errors={["name", "targetUrl", "secretKey", null].map((field) => ({
                __typename: "WebhookError",
                code: WebhookErrorCode.INVALID,
                field,
            }))}
        />
    ));

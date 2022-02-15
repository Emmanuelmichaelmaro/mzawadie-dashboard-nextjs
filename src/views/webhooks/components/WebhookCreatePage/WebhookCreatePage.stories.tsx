// @ts-nocheck
import { WebhookErrorCode } from "@mzawadie/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import WebhookCreatePage, { WebhookCreatePageProps } from "./WebhookCreatePage";

const props: WebhookCreatePageProps = {
    appName: "App",
    disabled: false,
    errors: [],
    onBack: () => undefined,
    onSubmit: () => undefined,
    saveButtonBarState: "default",
};
storiesOf("Views / Apps / Webhooks / Create webhook", module)
    .addDecorator(Decorator)
    .add("default", () => <WebhookCreatePage {...props} />)
    .add("loading", () => <WebhookCreatePage {...props} disabled />)
    .add("form errors", () => (
        <WebhookCreatePage
            {...props}
            errors={["name", "targetUrl", "secretKey", null].map((field) => ({
                __typename: "WebhookError",
                code: WebhookErrorCode.INVALID,
                field,
            }))}
        />
    ));

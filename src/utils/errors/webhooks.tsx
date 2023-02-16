import { commonMessages } from "@mzawadie/core";
import { WebhookErrorFragment } from "@mzawadie/fragments/types/WebhookErrorFragment";
import { WebhookErrorCode } from "@mzawadie/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getWebhookErrorMessage(
    err: Omit<WebhookErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case WebhookErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case WebhookErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case WebhookErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getWebhookErrorMessage;

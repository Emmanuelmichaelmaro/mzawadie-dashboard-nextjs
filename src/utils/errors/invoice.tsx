import { commonMessages } from "@mzawadie/core";
import { InvoiceErrorFragment } from "@mzawadie/fragments/types/InvoiceErrorFragment";
import { InvoiceErrorCode } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    emailNotSet: {
        defaultMessage: "Email address is not set",
        id: "abTH5q",
        description: "error message",
    },
    invalidStatus: {
        defaultMessage: "Cannot request an invoice for draft order",
        id: "dxCVWI",
        description: "error message",
    },
    notFound: {
        defaultMessage: "Invoice not found",
        id: "uRTj1Q",
        description: "error message",
    },
    notReady: {
        defaultMessage: "Billing address is not set or invoice is not ready to be send",
        id: "Fz3kic",
        description: "error message",
    },
    numberNotSet: {
        defaultMessage: "Number not set for an invoice",
        id: "N43t3/",
        description: "error message",
    },
    urlNotSet: {
        defaultMessage: "URL not set for an invoice",
        id: "vP7g2+",
        description: "error message",
    },
});

function getInvoiceErrorMessage(err: InvoiceErrorFragment, intl: IntlShape): string | undefined {
    if (err) {
        switch (err.code) {
            case InvoiceErrorCode.EMAIL_NOT_SET:
                return intl.formatMessage(messages.emailNotSet);
            case InvoiceErrorCode.INVALID_STATUS:
                return intl.formatMessage(messages.invalidStatus);
            case InvoiceErrorCode.NOT_FOUND:
                return intl.formatMessage(messages.notFound);
            case InvoiceErrorCode.NOT_READY:
                return intl.formatMessage(messages.notReady);
            case InvoiceErrorCode.NUMBER_NOT_SET:
                return intl.formatMessage(messages.numberNotSet);
            case InvoiceErrorCode.URL_NOT_SET:
                return intl.formatMessage(messages.urlNotSet);
            case InvoiceErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getInvoiceErrorMessage;

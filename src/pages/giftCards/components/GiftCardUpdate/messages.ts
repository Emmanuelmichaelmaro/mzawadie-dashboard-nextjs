import { GiftCardErrorCode, GiftCardErrorFragment } from "@mzawadie/graphql";
import commonErrorMessages, { getCommonFormFieldErrorMessage } from "@mzawadie/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardUpdateDetailsCardMessages = defineMessages({
    title: {
        defaultMessage: "Details",
        id: "xPnZ0R",
        description: "title",
    },
});

const giftCardErrorMessages = defineMessages({
    notFound: {
        defaultMessage: "Couldn't find gift card",
        id: "29L5Yq",
        description: "gift card not found message",
    },
});

export function getGiftCardErrorMessage(
    error: Omit<GiftCardErrorFragment, "__typename" | "message"> | undefined,
    intl: IntlShape
): string {
    if (error) {
        switch (error.code) {
            case GiftCardErrorCode.NOT_FOUND:
                return intl.formatMessage(giftCardErrorMessages.notFound);
            case GiftCardErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
        }
    }

    return getCommonFormFieldErrorMessage(error, intl);
}

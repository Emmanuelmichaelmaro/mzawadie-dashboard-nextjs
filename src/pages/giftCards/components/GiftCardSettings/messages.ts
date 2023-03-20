// @ts-nocheck
import { GiftCardSettingsErrorFragment } from "@mzawadie/graphql";
import { getCommonFormFieldErrorMessage } from "@mzawadie/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsPageMessages = defineMessages({
    title: {
        defaultMessage: "Gift Cards Settings",
        id: "xHj9Qe",
        description: "gift card settings header",
    },
});

export function getGiftCardSettingsErrorMessage(
    error: Omit<GiftCardSettingsErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string {
    return getCommonFormFieldErrorMessage(error, intl);
}

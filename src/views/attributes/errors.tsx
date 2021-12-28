import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import { AttributeErrorCode } from "@mzawadie/types/globalTypes";
import getAttributeErrorMessage from "@mzawadie/utils/errors/attribute";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
    attributeSlugUnique: {
        defaultMessage: "Attribute with this slug already exists",
        id: "eWV760",
    },
    attributeValueAlreadyExists: {
        defaultMessage: "This value already exists within this attribute",
        id: "J/QqOI",
    },
});

export function getAttributeSlugErrorMessage(err: AttributeErrorFragment, intl: IntlShape): string {
    if (err?.code === AttributeErrorCode.UNIQUE) {
        return intl.formatMessage(messages.attributeSlugUnique);
    }
    return getAttributeErrorMessage(err, intl) as string;
}

export function getAttributeValueErrorMessage(err: AttributeErrorFragment, intl: IntlShape): string {
    if (err?.code === AttributeErrorCode.ALREADY_EXISTS) {
        return intl.formatMessage(messages.attributeValueAlreadyExists);
    }
    return getAttributeErrorMessage(err, intl) as string;
}

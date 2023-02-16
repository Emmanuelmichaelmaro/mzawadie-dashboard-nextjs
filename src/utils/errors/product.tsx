import { commonMessages } from "@mzawadie/core";
import { BulkProductErrorFragment } from "@mzawadie/fragments/types/BulkProductErrorFragment";
import { CollectionErrorFragment } from "@mzawadie/fragments/types/CollectionErrorFragment";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { ProductErrorCode } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    alreadyExists: {
        defaultMessage: "A product with this SKU already exists",
        id: "2NgTCJ",
    },
    attributeAlreadyAssigned: {
        defaultMessage: "This attribute has already been assigned to this product type",
        id: "aggaJg",
    },
    attributeCannotBeAssigned: {
        defaultMessage: "This attribute cannot be assigned to this product type",
        id: "u24Ppd",
    },
    attributeRequired: {
        defaultMessage: "All attributes should have value",
        id: "cd13nN",
        description: "product attribute error",
    },
    attributeVariantsDisabled: {
        defaultMessage: "Variants are disabled in this product type",
        id: "lLwtgs",
    },
    duplicated: {
        defaultMessage: "The same object cannot be in both lists",
        id: "AY7Tuz",
    },
    duplicatedInputItem: {
        defaultMessage: "Variant with these attributes already exists",
        id: "pFVX6g",
    },
    nameAlreadyTaken: {
        defaultMessage: "This name is already taken. Please provide another.",
        id: "FuAV5G",
    },
    priceInvalid: {
        defaultMessage: "Product price cannot be lower than 0.",
        id: "mYs3tb",
    },
    skuUnique: {
        defaultMessage: "SKUs must be unique",
        id: "rZf1qL",
        description: "bulk variant create error",
    },
    unsupportedMediaProvider: {
        defaultMessage: "Unsupported media provider or incorrect URL",
        id: "DILs4b",
    },
    variantNoDigitalContent: {
        defaultMessage: "This variant does not have any digital content",
        id: "Z6QAbw",
    },
    variantUnique: {
        defaultMessage: "This variant already exists",
        id: "i3Mvj8",
        description: "product attribute error",
    },
    noCategorySet: {
        defaultMessage: "Product category not set",
        id: "3AqOxp",
        description: "no category set error",
    },
});

function getProductErrorMessage(
    err: Omit<ProductErrorFragment | CollectionErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case ProductErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
                return intl.formatMessage(messages.attributeAlreadyAssigned);
            case ProductErrorCode.ALREADY_EXISTS:
                return intl.formatMessage(messages.alreadyExists);
            case ProductErrorCode.ATTRIBUTE_CANNOT_BE_ASSIGNED:
                return intl.formatMessage(messages.attributeCannotBeAssigned);
            case ProductErrorCode.ATTRIBUTE_VARIANTS_DISABLED:
                return intl.formatMessage(messages.attributeVariantsDisabled);
            case ProductErrorCode.DUPLICATED_INPUT_ITEM:
                return intl.formatMessage(messages.duplicatedInputItem);
            case ProductErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case ProductErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case ProductErrorCode.VARIANT_NO_DIGITAL_CONTENT:
                return intl.formatMessage(messages.variantNoDigitalContent);
            case ProductErrorCode.UNSUPPORTED_MEDIA_PROVIDER:
                return intl.formatMessage(messages.unsupportedMediaProvider);
            case ProductErrorCode.PRODUCT_WITHOUT_CATEGORY:
                return intl.formatMessage(messages.noCategorySet);
            case ProductErrorCode.INVALID:
                if (err.field === "price") {
                    return intl.formatMessage(messages.priceInvalid);
                }
                return intl.formatMessage(commonErrorMessages.invalid);
            case ProductErrorCode.UNIQUE:
                if (err.field === "sku") {
                    return intl.formatMessage(messages.skuUnique);
                }
            // eslint-disable-next-line no-fallthrough
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }
    return undefined;
}

export function getProductVariantAttributeErrorMessage(
    err: Omit<ProductErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case ProductErrorCode.UNIQUE:
                return intl.formatMessage(messages.variantUnique);
            default:
                return getProductErrorMessage(err, intl);
        }
    }

    return undefined;
}

export function getBulkProductErrorMessage(
    err: BulkProductErrorFragment | undefined,
    intl: IntlShape
): string {
    if (err?.code === ProductErrorCode.UNIQUE && err.field === "sku") {
        return intl.formatMessage(messages.skuUnique);
    }
    return getProductErrorMessage(err, intl) as string;
}

export default getProductErrorMessage;

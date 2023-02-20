import { ProductFieldEnum } from "@mzawadie/types/globalTypes";
import { defineMessages, useIntl } from "react-intl";

export const productExportDialogMessages = defineMessages({
    title: {
        defaultMessage: "Export Information",
        id: "xkjRu5",
        description: "export products to csv file, dialog header",
    },
    confirmButtonLabel: {
        defaultMessage: "export products",
        id: "oOFrUd",
        description: "export products to csv file, button",
    },
    productsLabel: {
        defaultMessage: "products",
        id: "dc5KWn",
        description: "products export type label",
    },
});

function useProductExportFieldMessages() {
    const intl = useIntl();

    const messages = {
        [ProductFieldEnum.CATEGORY]: intl.formatMessage({
            defaultMessage: "Category",
            description: "product field",
            id: "KupNHw",
        }),
        [ProductFieldEnum.CHARGE_TAXES]: intl.formatMessage({
            defaultMessage: "Charge Taxes",
            description: "product field",
            id: "QVNg8A",
        }),
        [ProductFieldEnum.COLLECTIONS]: intl.formatMessage({
            defaultMessage: "Collections",
            description: "product field",
            id: "jxoMLL",
        }),
        [ProductFieldEnum.DESCRIPTION]: intl.formatMessage({
            defaultMessage: "Description",
            description: "product field",
            id: "YVIajc",
        }),
        [ProductFieldEnum.NAME]: intl.formatMessage({
            defaultMessage: "Name",
            description: "product field",
            id: "W8i2Ez",
        }),
        [ProductFieldEnum.PRODUCT_MEDIA]: intl.formatMessage({
            defaultMessage: "Product Images",
            description: "product field",
            id: "6y+k8V",
        }),
        [ProductFieldEnum.PRODUCT_TYPE]: intl.formatMessage({
            defaultMessage: "Type",
            description: "product field",
            id: "Q/Nbku",
        }),
        [ProductFieldEnum.PRODUCT_WEIGHT]: intl.formatMessage({
            defaultMessage: "Export Product Weight",
            description: "product field",
            id: "7JAAul",
        }),
        [ProductFieldEnum.VARIANT_MEDIA]: intl.formatMessage({
            defaultMessage: "Variant Images",
            description: "product field",
            id: "Uo5MoU",
        }),
        [ProductFieldEnum.VARIANT_ID]: intl.formatMessage({
            defaultMessage: "Export Variant ID",
            description: "product field",
            id: "HYHLsB",
        }),
        [ProductFieldEnum.VARIANT_SKU]: intl.formatMessage({
            defaultMessage: "Export Variant SKU",
            description: "product field",
            id: "5kvaFR",
        }),
        [ProductFieldEnum.VARIANT_WEIGHT]: intl.formatMessage({
            defaultMessage: "Export Variant Weight",
            description: "product field",
            id: "XBwpUv",
        }),
    };

    return (field: ProductFieldEnum) => messages[field];
}

export default useProductExportFieldMessages;

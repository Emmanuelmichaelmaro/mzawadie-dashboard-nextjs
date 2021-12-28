import { ProductFieldEnum } from "@mzawadie/types/globalTypes";
import { useIntl } from "react-intl";

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

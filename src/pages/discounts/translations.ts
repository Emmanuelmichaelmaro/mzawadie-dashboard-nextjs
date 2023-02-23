import { VoucherTypeEnum } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
    order: {
        defaultMessage: "Entire order",
        id: "bP7ZLP",
        description: "voucher discount",
    },
    products: {
        defaultMessage: "Specific products",
        id: "45zP+r",
        description: "voucher discount",
    },
    shipment: {
        defaultMessage: "Shipment",
        id: "WasHjQ",
        description: "voucher discount",
    },
});

// eslint-disable-next-line import/prefer-default-export
export const translateVoucherTypes = (intl: IntlShape) => ({
    [VoucherTypeEnum.SHIPPING]: intl.formatMessage(messages.shipment),
    [VoucherTypeEnum.ENTIRE_ORDER]: intl.formatMessage(messages.order),
    [VoucherTypeEnum.SPECIFIC_PRODUCT]: intl.formatMessage(messages.products),
});

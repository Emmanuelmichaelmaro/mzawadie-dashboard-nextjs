/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import { DiscountValueTypeEnum, VoucherTypeEnum } from "@mzawadie/types/globalTypes";
import { VoucherDetailsPageFormData } from "@mzawadie/views/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@mzawadie/views/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@mzawadie/views/discounts/types";
import {
    VoucherChannelListingUpdate,
    VoucherChannelListingUpdateVariables,
} from "@mzawadie/views/discounts/types/VoucherChannelListingUpdate";
import { VoucherCreate, VoucherCreateVariables } from "@mzawadie/views/discounts/types/VoucherCreate";

export function createHandler(
    voucherCreate: (variables: VoucherCreateVariables) => Promise<FetchResult<VoucherCreate>>,
    updateChannels: (options: {
        variables: VoucherChannelListingUpdateVariables;
    }) => Promise<FetchResult<VoucherChannelListingUpdate>>
) {
    return async (formData: VoucherDetailsPageFormData) => {
        const response = await voucherCreate({
            input: {
                applyOncePerCustomer: formData.applyOncePerCustomer,
                applyOncePerOrder: formData.applyOncePerOrder,
                onlyForStaff: formData.onlyForStaff,
                code: formData.code,
                discountValueType:
                    formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE
                        ? DiscountValueTypeEnum.PERCENTAGE
                        : formData.discountType === DiscountTypeEnum.VALUE_FIXED
                        ? DiscountValueTypeEnum.FIXED
                        : DiscountValueTypeEnum.PERCENTAGE,
                endDate: formData.hasEndDate ? joinDateTime(formData.endDate, formData.endTime) : null,
                minCheckoutItemsQuantity:
                    formData.requirementsPicker !== RequirementsPicker.ITEM
                        ? 0
                        : parseFloat(formData.minCheckoutItemsQuantity),
                startDate: joinDateTime(formData.startDate, formData.startTime),
                type:
                    formData.discountType === DiscountTypeEnum.SHIPPING
                        ? VoucherTypeEnum.SHIPPING
                        : formData.type,
                usageLimit: formData.hasUsageLimit ? parseInt(formData.usageLimit, 10) : null,
            },
        });

        if (!response.data.voucherCreate.errors.length) {
            updateChannels({
                variables: getChannelsVariables(
                    response.data.voucherCreate.voucher.id,
                    formData,
                    formData.channelListings
                ),
            });
            return response.data.voucherCreate.voucher.id;
        }
    };
}

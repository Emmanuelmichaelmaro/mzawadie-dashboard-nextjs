// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { extractMutationErrors, getMutationErrors, joinDateTime } from "@mzawadie/core";
import {
    DiscountValueTypeEnum,
    VoucherChannelListingUpdateMutation,
    VoucherChannelListingUpdateMutationVariables,
    VoucherCreateMutation,
    VoucherCreateMutationVariables,
    VoucherTypeEnum,
} from "@mzawadie/graphql";
import { VoucherDetailsPageFormData } from "@mzawadie/pages/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@mzawadie/pages/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@mzawadie/pages/discounts/types";

export function createHandler(
    voucherCreate: (
        variables: VoucherCreateMutationVariables
    ) => Promise<FetchResult<VoucherCreateMutation>>,
    updateChannels: (options: {
        variables: VoucherChannelListingUpdateMutationVariables;
    }) => Promise<FetchResult<VoucherChannelListingUpdateMutation>>
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
                usageLimit: formData.hasUsageLimit ? formData.usageLimit : null,
            },
        });

        const errors = getMutationErrors(response);

        if (errors.length > 0) {
            return { errors };
        }

        const channelsUpdateErrors = await extractMutationErrors(
            updateChannels({
                variables: getChannelsVariables(
                    response.data.voucherCreate.voucher.id,
                    formData,
                    formData.channelListings
                ),
            })
        );

        if (channelsUpdateErrors.length > 0) {
            return { errors: channelsUpdateErrors };
        }

        return { id: response.data.voucherCreate.voucher.id };
    };
}

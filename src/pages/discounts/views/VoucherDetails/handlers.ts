// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import {
    DiscountValueTypeEnum,
    VoucherChannelListingUpdateMutation,
    VoucherChannelListingUpdateMutationVariables,
    VoucherDetailsFragment,
    VoucherTypeEnum,
    VoucherUpdateMutation,
    VoucherUpdateMutationVariables,
} from "@mzawadie/graphql";
import { ChannelVoucherData } from "@mzawadie/pages/channels/utils";
import { VoucherDetailsPageFormData } from "@mzawadie/pages/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@mzawadie/pages/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@mzawadie/pages/discounts/types";

export function createUpdateHandler(
    voucher: VoucherDetailsFragment,
    voucherChannelsChoices: ChannelVoucherData[],
    updateVoucher: (
        variables: VoucherUpdateMutationVariables
    ) => Promise<FetchResult<VoucherUpdateMutation>>,
    updateChannels: (options: {
        variables: VoucherChannelListingUpdateMutationVariables;
    }) => Promise<FetchResult<VoucherChannelListingUpdateMutation>>
) {
    return async (formData: VoucherDetailsPageFormData) => {
        const { id } = voucher;

        const errors = await Promise.all([
            updateVoucher({
                id,
                input: {
                    applyOncePerCustomer: formData.applyOncePerCustomer,
                    applyOncePerOrder: formData.applyOncePerOrder,
                    onlyForStaff: formData.onlyForStaff,
                    discountValueType:
                        formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE
                            ? DiscountValueTypeEnum.PERCENTAGE
                            : formData.discountType === DiscountTypeEnum.VALUE_FIXED
                            ? DiscountValueTypeEnum.FIXED
                            : DiscountValueTypeEnum.PERCENTAGE,
                    endDate: formData.hasEndDate
                        ? joinDateTime(formData.endDate, formData.endTime)
                        : null,
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
            }).then(({ data }) => data?.voucherUpdate?.errors ?? []),

            updateChannels({
                variables: getChannelsVariables(id, formData, voucherChannelsChoices),
            }).then(({ data }) => data?.voucherChannelListingUpdate?.errors ?? []),
        ]);

        return errors.flat();
    };
}

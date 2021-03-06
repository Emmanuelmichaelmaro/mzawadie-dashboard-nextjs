import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import { DiscountValueTypeEnum, VoucherTypeEnum } from "@mzawadie/types/globalTypes";
import { ChannelVoucherData } from "@mzawadie/views/channels/utils";
import { VoucherDetailsPageFormData } from "@mzawadie/views/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@mzawadie/views/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@mzawadie/views/discounts/types";
import {
    VoucherChannelListingUpdate,
    VoucherChannelListingUpdateVariables,
} from "@mzawadie/views/discounts/types/VoucherChannelListingUpdate";
import { VoucherDetails_voucher } from "@mzawadie/views/discounts/types/VoucherDetails";
import { VoucherUpdate, VoucherUpdateVariables } from "@mzawadie/views/discounts/types/VoucherUpdate";

export function createUpdateHandler(
    voucher: VoucherDetails_voucher,
    voucherChannelsChoices: ChannelVoucherData[],
    updateVoucher: (variables: VoucherUpdateVariables) => Promise<FetchResult<VoucherUpdate>>,
    updateChannels: (options: {
        variables: VoucherChannelListingUpdateVariables;
    }) => Promise<FetchResult<VoucherChannelListingUpdate>>
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

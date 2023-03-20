// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import {
    DiscountValueTypeEnum,
    SaleDetailsFragment,
    SaleType,
    SaleUpdateMutation,
    SaleUpdateMutationVariables,
} from "@mzawadie/graphql";
import { ChannelSaleData } from "@mzawadie/pages/channels/utils";
import { SaleDetailsPageFormData } from "@mzawadie/pages/discounts/components/SaleDetailsPage";
import { getSaleChannelsVariables } from "@mzawadie/pages/discounts/handlers";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
    return type.toString() === DiscountValueTypeEnum.FIXED
        ? DiscountValueTypeEnum.FIXED
        : DiscountValueTypeEnum.PERCENTAGE;
}

export function createUpdateHandler(
    sale: SaleDetailsFragment,
    saleChannelsChoices: ChannelSaleData[],
    updateSale: (variables: SaleUpdateMutationVariables) => Promise<FetchResult<SaleUpdateMutation>>
) {
    return async (formData: SaleDetailsPageFormData) => {
        const { id } = sale;
        const errors = await Promise.all([
            updateSale({
                id,
                input: {
                    endDate: formData.hasEndDate
                        ? joinDateTime(formData.endDate, formData.endTime)
                        : null,
                    name: formData.name,
                    startDate: joinDateTime(formData.startDate, formData.startTime),
                    type: discountValueTypeEnum(formData.type),
                },
                channelInput: getSaleChannelsVariables(
                    id,
                    formData,
                    saleChannelsChoices.map((channel) => channel.id)
                ).input,
            }).then(({ data }) => data?.saleUpdate.errors ?? []),
        ]);

        return errors.flat();
    };
}

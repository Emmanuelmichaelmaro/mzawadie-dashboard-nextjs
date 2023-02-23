// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import { ChannelSaleData } from "@mzawadie/pages/channels/utils";
import { SaleDetailsPageFormData } from "@mzawadie/pages/discounts/components/SaleDetailsPage";
import { getSaleChannelsVariables } from "@mzawadie/pages/discounts/handlers";
import {
    SaleChannelListingUpdate,
    SaleChannelListingUpdateVariables,
} from "@mzawadie/pages/discounts/types/SaleChannelListingUpdate";
import { SaleDetails_sale } from "@mzawadie/pages/discounts/types/SaleDetails";
import { SaleUpdate, SaleUpdateVariables } from "@mzawadie/pages/discounts/types/SaleUpdate";
import { DiscountValueTypeEnum, SaleType } from "@mzawadie/types/globalTypes";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
    return type.toString() === DiscountValueTypeEnum.FIXED
        ? DiscountValueTypeEnum.FIXED
        : DiscountValueTypeEnum.PERCENTAGE;
}

export function createUpdateHandler(
    sale: SaleDetails_sale,
    saleChannelsChoices: ChannelSaleData[],
    updateSale: (variables: SaleUpdateVariables) => Promise<FetchResult<SaleUpdate>>,
    updateChannels: (options: {
        variables: SaleChannelListingUpdateVariables;
    }) => Promise<FetchResult<SaleChannelListingUpdate>>
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
            }).then(({ data }) => data?.saleUpdate?.errors ?? []),

            updateChannels({
                variables: getSaleChannelsVariables(id, formData, saleChannelsChoices),
            }).then(({ data }) => data?.saleChannelListingUpdate?.errors ?? []),
        ]);

        return errors.flat();
    };
}

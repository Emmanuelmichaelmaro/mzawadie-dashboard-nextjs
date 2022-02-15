import { FetchResult } from "@apollo/client";
import { joinDateTime } from "@mzawadie/core";
import { DiscountValueTypeEnum, SaleType } from "@mzawadie/types/globalTypes";
import { ChannelSaleData } from "@mzawadie/views/channels/utils";
import { SaleDetailsPageFormData } from "@mzawadie/views/discounts/components/SaleDetailsPage";
import { getSaleChannelsVariables } from "@mzawadie/views/discounts/handlers";
import {
    SaleChannelListingUpdate,
    SaleChannelListingUpdateVariables,
} from "@mzawadie/views/discounts/types/SaleChannelListingUpdate";
import { SaleDetails_sale } from "@mzawadie/views/discounts/types/SaleDetails";
import { SaleUpdate, SaleUpdateVariables } from "@mzawadie/views/discounts/types/SaleUpdate";

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

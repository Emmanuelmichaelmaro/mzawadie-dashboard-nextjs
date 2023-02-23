/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { joinDateTime, decimal } from "@mzawadie/core";
import { FormData } from "@mzawadie/pages/discounts/components/SaleCreatePage";
import { getSaleChannelsVariables } from "@mzawadie/pages/discounts/handlers";
import {
    SaleChannelListingUpdate,
    SaleChannelListingUpdateVariables,
} from "@mzawadie/pages/discounts/types/SaleChannelListingUpdate";
import { SaleCreate, SaleCreateVariables } from "@mzawadie/pages/discounts/types/SaleCreate";
import { DiscountValueTypeEnum, SaleType } from "@mzawadie/types/globalTypes";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
    return type.toString() === DiscountValueTypeEnum.FIXED
        ? DiscountValueTypeEnum.FIXED
        : DiscountValueTypeEnum.PERCENTAGE;
}

export function createHandler(
    createSale: (variables: SaleCreateVariables) => Promise<FetchResult<SaleCreate>>,
    updateChannels: (options: {
        variables: SaleChannelListingUpdateVariables;
    }) => Promise<FetchResult<SaleChannelListingUpdate>>
) {
    return async (formData: FormData) => {
        const response = await createSale({
            input: {
                endDate: formData.hasEndDate ? joinDateTime(formData.endDate, formData.endTime) : null,
                name: formData.name,
                startDate: joinDateTime(formData.startDate, formData.startTime),
                type: discountValueTypeEnum(formData.type),
                value: decimal(formData.value),
            },
        });

        if (!response.data.saleCreate.errors.length) {
            updateChannels({
                variables: getSaleChannelsVariables(response.data.saleCreate.sale.id, formData),
            });
            return response.data.saleCreate.sale.id;
        }
    };
}

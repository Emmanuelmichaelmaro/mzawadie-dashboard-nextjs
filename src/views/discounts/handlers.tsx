import { RequireOnlyOne } from "@mzawadie/core";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import { VoucherTypeEnum } from "@mzawadie/types/globalTypes";
import { arrayDiff } from "@mzawadie/utils/arrays";
import { ChannelSaleData, ChannelVoucherData } from "@mzawadie/views/channels/utils";
import { SaleDetailsPageFormData } from "@mzawadie/views/discounts/components/SaleDetailsPage";
import { VoucherDetailsPageFormData } from "@mzawadie/views/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum, RequirementsPicker } from "@mzawadie/views/discounts/types";

export interface ChannelArgs {
    discountValue: string;
    minSpent: string;
}

export type ChannelInput = RequireOnlyOne<ChannelArgs, "discountValue" | "minSpent">;

export function createDiscountTypeChangeHandler(change: FormChange) {
    return (formData: VoucherDetailsPageFormData, event: ChangeEvent) => {
        if (formData.type === VoucherTypeEnum.SHIPPING) {
            // if previously type was shipping
            change({
                target: {
                    name: "type",
                    value: VoucherTypeEnum.ENTIRE_ORDER,
                },
            });
        } else if (event.target.value === DiscountTypeEnum.SHIPPING) {
            // if currently type should be shipping
            change({
                target: {
                    name: "type",
                    value: VoucherTypeEnum.ENTIRE_ORDER,
                },
            });
        }
        change(event);
    };
}

export function createChannelsChangeHandler(
    channelListings: ChannelVoucherData[],
    updateChannels: (data: ChannelVoucherData[]) => void,
    triggerChange: () => void
) {
    return (id: string, input: ChannelInput) => {
        const channelIndex = channelListings.findIndex((channel) => channel.id === id);
        const channel = channelListings[channelIndex];
        const { discountValue, minSpent } = input;
        const updatedChannels = [
            ...channelListings.slice(0, channelIndex),
            {
                ...channel,
                ...(minSpent !== undefined
                    ? { minSpent }
                    : {
                          discountValue,
                      }),
            },
            ...channelListings.slice(channelIndex + 1),
        ];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateChannels(updatedChannels);
        triggerChange();
    };
}

export function createSaleChannelsChangeHandler(
    channelListings: ChannelSaleData[],
    updateChannels: (data: ChannelSaleData[]) => void,
    triggerChange: () => void
) {
    return (id: string, discountValue: string) => {
        const channelIndex = channelListings.findIndex((channel) => channel.id === id);
        const channel = channelListings[channelIndex];

        const updatedChannels = [
            ...channelListings.slice(0, channelIndex),
            {
                ...channel,
                discountValue,
            },
            ...channelListings.slice(channelIndex + 1),
        ];
        updateChannels(updatedChannels);
        triggerChange();
    };
}

export const getChannelsVariables = (
    id: string,
    formData: VoucherDetailsPageFormData,
    prevChannels?: ChannelVoucherData[]
) => {
    const initialIds = prevChannels?.map((channel) => channel.id);
    const modifiedIds = formData.channelListings.map((channel) => channel.id);

    const idsDiff = arrayDiff(initialIds, modifiedIds);

    return {
        id,
        input: {
            addChannels:
                formData.channelListings?.map((channel) => ({
                    channelId: channel.id,
                    discountValue:
                        formData.discountType.toString() === "SHIPPING" ? 100 : channel.discountValue,
                    minAmountSpent:
                        formData.requirementsPicker === RequirementsPicker.NONE
                            ? null
                            : formData.requirementsPicker === RequirementsPicker.ITEM
                            ? 0
                            : channel.minSpent,
                })) || [],
            removeChannels: idsDiff.removed,
        },
    };
};

export const getSaleChannelsVariables = (
    id: string,
    formData: SaleDetailsPageFormData,
    prevChannels?: ChannelSaleData[]
) => {
    const initialIds = prevChannels?.map((channel) => channel.id);
    const modifiedIds = formData.channelListings.map((channel) => channel.id);

    const idsDiff = arrayDiff(initialIds, modifiedIds);

    return {
        id,
        input: {
            addChannels:
                formData.channelListings?.map((channel) => ({
                    channelId: channel.id,
                    discountValue: channel.discountValue,
                })) || [],
            removeChannels: idsDiff.removed,
        },
    };
};

import { OutputData } from "@editorjs/editorjs";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { ChannelShippingData } from "@mzawadie/pages/channels/utils";
import { ShippingMethodTypeEnum } from "@mzawadie/types/globalTypes";

export interface ShippingZoneRateCommonFormData {
    channelListings: ChannelShippingData[];
    name: string;
    description: OutputData;
    orderValueRestricted: boolean;
    minValue: string;
    maxValue: string;
    minDays: string;
    maxDays: string;
    type: ShippingMethodTypeEnum;
}

export type ShippingZoneRateUpdateFormData = ShippingZoneRateCommonFormData & MetadataFormData;

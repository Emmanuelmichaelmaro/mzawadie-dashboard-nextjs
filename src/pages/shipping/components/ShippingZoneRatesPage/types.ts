import { OutputData } from "@editorjs/editorjs";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { ShippingMethodTypeEnum } from "@mzawadie/graphql";
import { ChannelShippingData } from "@mzawadie/pages/channels/utils";

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

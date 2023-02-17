import { MetadataFormData } from "@mzawadie/components/Metadata";
import { ChannelSaleData } from "@mzawadie/pages/channels/utils";
import { SaleType as SaleTypeEnum } from "@mzawadie/types/globalTypes";

export interface ChannelSaleFormData extends ChannelSaleData {
    percentageValue: string;
    fixedValue: string;
}

export interface SaleDetailsPageFormData extends MetadataFormData {
    channelListings: ChannelSaleFormData[];
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    name: string;
    startDate: string;
    startTime: string;
    type: SaleTypeEnum;
}

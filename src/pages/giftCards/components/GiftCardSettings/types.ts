import { TimePeriodTypeEnum } from "@mzawadie/graphql";

export interface GiftCardSettingsFormData {
    expiryPeriodActive: boolean;
    expiryPeriodType: TimePeriodTypeEnum;
    expiryPeriodAmount: number;
}

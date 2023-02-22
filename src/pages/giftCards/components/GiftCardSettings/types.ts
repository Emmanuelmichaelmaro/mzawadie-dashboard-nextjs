import { TimePeriodTypeEnum } from "@mzawadie/types/globalTypes";

export interface GiftCardSettingsFormData {
    expiryPeriodActive: boolean;
    expiryPeriodType: TimePeriodTypeEnum;
    expiryPeriodAmount: number;
}

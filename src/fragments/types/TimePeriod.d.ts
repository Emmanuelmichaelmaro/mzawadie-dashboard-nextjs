import { TimePeriodTypeEnum } from "./../../types/globalTypes";
export interface TimePeriod {
    __typename: "TimePeriod";
    amount: number;
    type: TimePeriodTypeEnum;
}

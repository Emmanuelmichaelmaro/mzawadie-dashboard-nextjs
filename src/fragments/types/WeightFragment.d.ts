import { WeightUnitsEnum } from "./../../types/globalTypes";
export interface WeightFragment {
    __typename: "Weight";
    unit: WeightUnitsEnum;
    value: number;
}

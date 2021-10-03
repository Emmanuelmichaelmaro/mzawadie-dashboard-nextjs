import { AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum } from "./../../types/globalTypes";
export interface AttributeFragment {
    __typename: "Attribute";
    id: string;
    name: string | null;
    slug: string | null;
    type: AttributeTypeEnum | null;
    visibleInStorefront: boolean;
    filterableInDashboard: boolean;
    filterableInStorefront: boolean;
    unit: MeasurementUnitsEnum | null;
    inputType: AttributeInputTypeEnum | null;
}

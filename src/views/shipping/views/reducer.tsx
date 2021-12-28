import { PostalCodeRuleInclusionTypeEnum } from "@mzawadie/types/globalTypes";
import { ShippingZone_shippingZone_shippingMethods_postalCodeRules } from "@mzawadie/views/shipping/types/ShippingZone";

export interface PostalCodesState {
    codesToDelete?: string[];
    havePostalCodesChanged?: boolean;
    inclusionType?: PostalCodeRuleInclusionTypeEnum;
    originalCodes?: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
    postalCodeRules?: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
}

function postalCodesReducer(prevState: PostalCodesState, newState: PostalCodesState) {
    return { ...prevState, ...newState };
}

export default postalCodesReducer;

import { ShippingErrorCode } from "./../../types/globalTypes";
export interface ShippingErrorFragment {
    __typename: "ShippingError";
    code: ShippingErrorCode;
    field: string | null;
}

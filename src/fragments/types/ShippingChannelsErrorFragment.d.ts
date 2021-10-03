import { ShippingErrorCode } from "./../../types/globalTypes";
export interface ShippingChannelsErrorFragment {
    __typename: "ShippingError";
    code: ShippingErrorCode;
    field: string | null;
    channels: string[] | null;
}

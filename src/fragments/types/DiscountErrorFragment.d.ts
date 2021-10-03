import { DiscountErrorCode } from "./../../types/globalTypes";
export interface DiscountErrorFragment {
    __typename: "DiscountError";
    code: DiscountErrorCode;
    field: string | null;
    channels: string[] | null;
}

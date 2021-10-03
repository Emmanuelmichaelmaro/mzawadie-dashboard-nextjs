import { ShopErrorCode } from "./../../types/globalTypes";
export interface ShopErrorFragment {
    __typename: "ShopError";
    code: ShopErrorCode;
    field: string | null;
}

import { ProductErrorCode } from "./../../types/globalTypes";
export interface ProductErrorFragment {
    __typename: "ProductError";
    code: ProductErrorCode;
    field: string | null;
}

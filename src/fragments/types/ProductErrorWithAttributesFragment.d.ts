import { ProductErrorCode } from "./../../types/globalTypes";
export interface ProductErrorWithAttributesFragment {
    __typename: "ProductError";
    code: ProductErrorCode;
    field: string | null;
    attributes: string[] | null;
}

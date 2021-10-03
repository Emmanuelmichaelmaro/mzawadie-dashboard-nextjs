import { ProductErrorCode } from "./../../types/globalTypes";
export interface BulkProductErrorFragment {
    __typename: "BulkProductError";
    field: string | null;
    code: ProductErrorCode;
    index: number | null;
    channels: string[] | null;
}

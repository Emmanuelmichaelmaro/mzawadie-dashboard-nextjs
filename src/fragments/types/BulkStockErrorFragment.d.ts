import { ProductErrorCode } from "./../../types/globalTypes";
export interface BulkStockErrorFragment {
    __typename: "BulkStockError";
    code: ProductErrorCode;
    field: string | null;
    index: number | null;
}

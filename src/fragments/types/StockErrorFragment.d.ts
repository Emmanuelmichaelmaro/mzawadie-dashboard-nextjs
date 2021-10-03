import { StockErrorCode } from "./../../types/globalTypes";
export interface StockErrorFragment {
    __typename: "StockError";
    code: StockErrorCode;
    field: string | null;
}

import { WarehouseErrorCode } from "./../../types/globalTypes";
export interface WarehouseErrorFragment {
    __typename: "WarehouseError";
    code: WarehouseErrorCode;
    field: string | null;
}

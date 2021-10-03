import { OrderSettingsErrorCode } from "./../../types/globalTypes";
export interface OrderSettingsErrorFragment {
    __typename: "OrderSettingsError";
    code: OrderSettingsErrorCode;
    field: string | null;
}

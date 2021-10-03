import { OrderErrorCode, AddressTypeEnum } from "./../../types/globalTypes";
export interface OrderErrorFragment {
    __typename: "OrderError";
    code: OrderErrorCode;
    field: string | null;
    addressType: AddressTypeEnum | null;
}

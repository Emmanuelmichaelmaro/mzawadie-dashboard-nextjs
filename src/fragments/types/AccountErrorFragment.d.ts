import { AccountErrorCode, AddressTypeEnum } from "./../../types/globalTypes";
export interface AccountErrorFragment {
    __typename: "AccountError";
    code: AccountErrorCode;
    field: string | null;
    addressType: AddressTypeEnum | null;
}

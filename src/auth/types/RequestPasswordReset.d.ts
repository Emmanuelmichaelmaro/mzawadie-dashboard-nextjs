import { AccountErrorCode, AddressTypeEnum } from "./../../types/globalTypes";
export interface RequestPasswordReset_requestPasswordReset_errors {
    __typename: "AccountError";
    code: AccountErrorCode;
    field: string | null;
    addressType: AddressTypeEnum | null;
}
export interface RequestPasswordReset_requestPasswordReset {
    __typename: "RequestPasswordReset";
    errors: RequestPasswordReset_requestPasswordReset_errors[];
}
export interface RequestPasswordReset {
    requestPasswordReset: RequestPasswordReset_requestPasswordReset | null;
}
export interface RequestPasswordResetVariables {
    email: string;
    redirectUrl: string;
}

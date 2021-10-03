import { AccountErrorCode, AddressTypeEnum } from "./../../types/globalTypes";
export interface ExternalAuthenticationUrl_externalAuthenticationUrl_errors {
    __typename: "AccountError";
    code: AccountErrorCode;
    field: string | null;
    addressType: AddressTypeEnum | null;
}
export interface ExternalAuthenticationUrl_externalAuthenticationUrl {
    __typename: "ExternalAuthenticationUrl";
    authenticationData: any | null;
    errors: ExternalAuthenticationUrl_externalAuthenticationUrl_errors[];
}
export interface ExternalAuthenticationUrl {
    externalAuthenticationUrl: ExternalAuthenticationUrl_externalAuthenticationUrl | null;
}
export interface ExternalAuthenticationUrlVariables {
    pluginId: string;
    input: any;
}

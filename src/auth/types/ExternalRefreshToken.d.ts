export interface ExternalRefreshToken_externalRefresh {
    __typename: "ExternalRefresh";
    token: string | null;
}
export interface ExternalRefreshToken {
    externalRefresh: ExternalRefreshToken_externalRefresh | null;
}
export interface ExternalRefreshTokenVariables {
    pluginId: string;
    input: any;
}

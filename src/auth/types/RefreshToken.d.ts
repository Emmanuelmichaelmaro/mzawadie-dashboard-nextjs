export interface RefreshToken_tokenRefresh {
    __typename: "RefreshToken";
    token: string | null;
}
export interface RefreshToken {
    tokenRefresh: RefreshToken_tokenRefresh | null;
}
export interface RefreshTokenVariables {
    token: string;
}

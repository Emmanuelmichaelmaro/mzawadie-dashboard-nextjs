import { GraphQLError } from "graphql";
export declare enum JWTError {
    invalid = "InvalidTokenError",
    invalidSignature = "InvalidSignatureError",
    expired = "ExpiredSignatureError"
}
export declare function isJwtError(error: GraphQLError): boolean;
export declare function isTokenExpired(error: GraphQLError): boolean;

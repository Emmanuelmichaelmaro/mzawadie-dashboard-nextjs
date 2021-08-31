import { GraphQLError } from "graphql"

import { findValueInEnum } from "../misc"

export enum JWTError {
    invalid = "InvalidTokenError",
    invalidSignature = "InvalidSignatureError",
    expired = "ExpiredSignatureError",
}

export function isJwtError(error: GraphQLError): boolean {
    let jwtError: boolean

    try {
        jwtError = !!findValueInEnum(error.extensions?.exception.code, JWTError)
    } catch {
        jwtError = false
    }

    return jwtError
}

export function isTokenExpired(error: GraphQLError): boolean {
    return error.extensions?.exception.code === JWTError.expired
}

import { ApolloError } from "@apollo/client"

export enum GqlErrors {
    LimitReachedException = "LimitReachedException",
    ReadOnlyException = "ReadOnlyException",
}

export function hasError(error: ApolloError, ...errorCodes: string[]): boolean {
    return error.graphQLErrors.some((gqlError) =>
        errorCodes.includes(gqlError.extensions?.exception.code)
    )
}

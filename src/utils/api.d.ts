import { ApolloError } from "@apollo/client";
export declare enum GqlErrors {
    LimitReachedException = "LimitReachedException",
    ReadOnlyException = "ReadOnlyException"
}
export declare function hasError(err: ApolloError, ...errorCodes: string[]): boolean;

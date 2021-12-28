import { setContext } from "@apollo/client/link/context";
import { ErrorResponse, onError } from "@apollo/client/link/error";

import { isJwtError, JWTError } from "./errors";
import { getTokens, removeTokens } from "./utils";

interface ResponseError extends ErrorResponse {
    networkError?: Error & {
        statusCode?: number;
        bodyText?: string;
    };
}

export const invalidateTokenLink = onError((error: ResponseError) => {
    if (
        (error.networkError && error.networkError.statusCode === 401) ||
        error.graphQLErrors?.some(isJwtError)
    ) {
        // @ts-ignore
        if (error?.graphQLErrors[0]?.extensions?.code !== JWTError.expired) {
            removeTokens();
        }
    }
});

export const tokenLink = setContext((_, context) => {
    const authToken = getTokens().auth;

    return {
        ...context,
        headers: {
            ...context.headers,
            "Authorization-Bearer": authToken || null,
        },
    };
});

const link = invalidateTokenLink.concat(tokenLink);

export default link;

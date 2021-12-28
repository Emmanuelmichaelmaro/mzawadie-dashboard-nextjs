// @ts-nocheck
import {
    ApolloClient,
    ApolloLink,
    defaultDataIdFromObject,
    InMemoryCache,
    makeVar,
    NormalizedCacheObject,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import authLink from "@mzawadie/views/auth/link";
import { createUploadLink } from "apollo-upload-client";
import merge from "deepmerge";
import { IncomingHttpHeaders } from "http";
import fetch from "isomorphic-unfetch";
import isEqual from "lodash/isEqual";
import type { AppProps } from "next/app";
import { useMemo } from "react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

export const isLoggedInVar = makeVar(false);

const isServer = typeof window === "undefined";

const windowApolloState = !isServer && (window as any).__NEXT_DATA__.apolloState;

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null;
    initialState?: InitialState | null;
}

export const createApolloClient = (headers: IncomingHttpHeaders | null = null) => {
    // isomorphic fetch for passing the cookies along with each GraphQL request
    const enhancedFetch = async (url: RequestInfo, init: RequestInit) => {
        return fetch(url, {
            ...init,
            headers: {
                ...init.headers,
                // "Access-Control-Allow-Origin": "*",
                // here we pass the cookie along for each request
                Cookie: headers?.cookie ?? "",
            },
        });
    };

    // DON'T TOUCH THIS
    // These are separate clients and do not share configs between themselves
    // so we need to explicitly set them
    const linkOptions = {
        credentials: "include",
        uri: "https://demo.saleor.io/graphql/",
        // Make sure that CORS and cookies work
        // fetchOptions: {
        //     mode: "cors",
        // },
        fetch: enhancedFetch,
    };

    // this uses apollo-link-http under the hood,
    // so all the options here come from that package
    const uploadLink = createUploadLink(linkOptions);

    // terminating link that batches an array of individual GraphQL operations
    // into a single HTTP request that's sent to a single GraphQL endpoint.
    const batchLink = new BatchHttpLink({
        batchInterval: 2500, // Wait no more than 100ms after first batched operation
        ...linkOptions,
    });

    const link = ApolloLink.split(
        (operation) => operation.getContext().useBatching,
        batchLink,
        uploadLink
    );

    // const authLink = setContext((_, { headers }) => {
    //     // get the authentication token from local storage if it exists
    //     const token = localStorage.getItem("token");
    //     // return the headers to the context so httpLink can read them
    //     return {
    //         headers: {
    //             ...headers,
    //             authorization: token ? `Bearer ${token}` : "",
    //         },
    //     };
    // });

    return new ApolloClient({
        // SSR only for Node.js
        ssrMode: typeof window === "undefined",
        // link: ApolloLink.from([
        //     // onError(({ graphQLErrors, networkError, operation }) => {
        //     //     if (graphQLErrors)
        //     //         graphQLErrors.forEach(({ extensions, message, locations, path }) =>
        //     //             console.log(
        //     //                 `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(
        //     //                     locations
        //     //                 )}, Path: ${path}, Operation: ${
        //     //                     operation.operationName
        //     //                 }, Code: ${JSON.stringify(extensions)}`
        //     //             )
        //     //         );

        //     //     if (networkError)
        //     //         console.log(
        //     //             JSON.stringify(
        //     //                 `[Network Error]: ${networkError}, Operation: ${operation.operationName}. Backend is unreachable. Is it running?`,
        //     //                 null,
        //     //                 4
        //     //             )
        //     //         );
        //     // }),
        //     authLink,
        //     link,
        // ]),
        link: authLink.concat(link),
        cache: new InMemoryCache({
            dataIdFromObject: (obj: any) => {
                // We need to set manually shop's ID, since it is singleton and
                // API does not return its ID
                if (obj.__typename === "Shop") {
                    return "shop";
                }
                return defaultDataIdFromObject(obj);
            },
            typePolicies: {
                Query: {
                    fields: {
                        isLoggedIn: {
                            read() {
                                return {
                                    isLoggedIn: isLoggedInVar(),
                                };
                            },
                        },
                    },
                },
            },
        }).restore(windowApolloState || {}),
        connectToDevTools: true,
        queryDeduplication: false,
    });
};

export const initializeApollo = (
    { headers, initialState }: IInitializeApollo = {
        headers: null,
        initialState: null,
    }
) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _apolloClient = apolloClient ?? createApolloClient(headers);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
            ],
        });

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) {
        apolloClient = _apolloClient;
    }

    return _apolloClient;
};

export const addApolloState = (
    client: ApolloClient<NormalizedCacheObject>,
    pageProps: AppProps["pageProps"]
) => {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
    }

    return pageProps;
};

export function useApollo(pageProps: AppProps["pageProps"]) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const state = pageProps ? pageProps[APOLLO_STATE_PROP_NAME] : {};
    return useMemo(() => initializeApollo({ initialState: state }), [state]);
}

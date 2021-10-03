/// <reference types="node" />
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { IncomingHttpHeaders } from "http";
import type { AppProps } from "next/app";
export declare const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
export declare const isLoggedInVar: import("@apollo/client").ReactiveVar<boolean>;
declare type InitialState = NormalizedCacheObject | undefined;
interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null;
    initialState?: InitialState | null;
}
export declare const createApolloClient: (headers?: IncomingHttpHeaders | null) => ApolloClient<NormalizedCacheObject>;
export declare const initializeApollo: ({ headers, initialState }?: IInitializeApollo) => ApolloClient<NormalizedCacheObject>;
export declare const addApolloState: (client: ApolloClient<NormalizedCacheObject>, pageProps: AppProps["pageProps"]) => any;
export declare function useApollo(pageProps: AppProps["pageProps"]): ApolloClient<NormalizedCacheObject>;
export {};

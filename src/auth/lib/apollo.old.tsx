import { ApolloClient, defaultDataIdFromObject, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
    dataIdFromObject: (obj: any) => {
        // We need to set manually shop's ID, since it is singleton and
        // API does not return its ID
        if (obj.__typename === "Shop") {
            return "shop";
        }
        return defaultDataIdFromObject(obj);
    },
});

// const request = async (operation: any) => {
//     // eslint-disable-next-line @typescript-eslint/await-thenable
//     const token = await localStorage.getItem("x-token");
//     // set the token in the request header for authorization
//     operation.setContext({
//         headers: {
//             authorization: token ? `Bearer ${token}` : "",
//         },
//     });
// };
//
// export const requestLink = new ApolloLink(
//     (operation, forward) =>
//         new Observable((observer) => {
//             let handle: any;
//             Promise.resolve(operation)
//                 .then((oper) => request(oper))
//                 .then(() => {
//                     handle = forward(operation).subscribe({
//                         next: observer.next.bind(observer),
//                         error: observer.error.bind(observer),
//                         complete: observer.complete.bind(observer),
//                     });
//                 })
//                 .catch(observer.error.bind(observer));
//
//             return () => {
//                 if (handle) handle.unsubscribe();
//             };
//         })
// );
//
// // DON'T TOUCH THIS
// // These are separate clients and do not share configs between themselves
// // so we need to explicitly set them
// const linkOptions = {
//     uri: "https://vercel.saleor.cloud/graphql/",
//     credentials: "include",
//     // Make sure that CORS and cookies work
//     fetchOptions: {
//         mode: "cors",
//     },
//     // fetch: enhancedFetch,
// };
//
// // this uses apollo-link-http under the hood, so all the options here come from that package
// const uploadLink = createUploadLink(linkOptions);
//
// const batchLink = new BatchHttpLink({
//     batchMax: 25, // No more than 25 operations per batch
//     batchInterval: 100, // Wait no more than 100ms after first batched operation
//     ...linkOptions,
// });
//
// const combinedBatchLink = ApolloLink.split(
//     (operation) => operation.getContext().useBatching,
//     batchLink,
//     uploadLink
// );
//
// const authToken = localStorage.getItem("auth");
// const csrfToken = localStorage.getItem("csrf");
//
// const refreshLink = new TokenRefreshLink({
//     accessTokenField: "newToken",
//     // No need to refresh if token exists and is still valid
//     isTokenValidOrUndefined: () => {
//         // No need to refresh if we don't have a userId
//         if (!userId) {
//             return true;
//         }
//         // No need to refresh if token exists and is valid
//         if (authToken && jwt.decode(authToken)?.exp * 1000 > Date.now()) {
//             return true;
//         }
//     },
//     fetchAccessToken: async () => {
//         if (!userId) {
//             // no need to refresh if userId is not defined
//             return null;
//         }
//
//         // Use fetch to access the refreshUserToken mutation
//         const response = await fetch(`${API_URI}`, {
//             method: "POST",
//             headers: {
//                 "content-type": "application/json",
//             },
//             body: JSON.stringify({
//                 query: `mutation {
//                     tokenRefresh(csrfToken: ${csrfToken}) {
//                         token
//                         accountErrors {
//                             code
//                         }
//                     }
//                 }`,
//             }),
//         });
//
//         return response.json();
//     },
//     handleFetch: (newToken) => {
//         // const accessTokenDecrypted = jwtDecode(accessToken);
//         // save new authentication token to state
//         setAuthToken(newToken, true);
//         //   setExpiresIn(parseExp(accessTokenDecrypted.exp).toString());
//     },
//     handleResponse: (operation, accessTokenField) => (response: any) => {
//         if (!response) return { newToken: null };
//         return { newToken: response.data?.refreshUserToken?.token };
//     },
//     handleError: (error) => {
//         console.error("Cannot refresh access token:", error);
//         // your custom action here
//         //  user.logout();
//     },
// });
//
// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//     if (graphQLErrors) {
//         console.log(`[GraphQL error]: ${JSON.stringify(graphQLErrors, null, 4)}`);
//
//         for (const err of graphQLErrors) {
//             switch (err.extensions?.code) {
//                 // Apollo Server sets code to UNAUTHENTICATED
//                 // when an AuthenticationError is thrown in a resolver
//                 case "UNAUTHENTICATED":
//                     // Modify the operation context with a new token
//                     const oldHeaders = operation.getContext().headers;
//                     operation.setContext({
//                         headers: {
//                             ...oldHeaders,
//                             authorization: getTokens().auth,
//                         },
//                     });
//                     // Retry the request, returning the new observable
//                     return forward(operation);
//             }
//         }
//     }
//
//     // To retry on network errors, we recommend the RetryLink
//     // instead of the onError link. This just logs the error.
//     if (networkError) {
//         console.log(
//             `[Network error]: ${JSON.stringify(
//                 networkError,
//                 null,
//                 4
//             )}. Backend is unreachable. Is it running?`
//         );
//     }
// });
//
// const link = ApolloLink.from([errorLink, requestLink, combinedBatchLink]);

const client = new ApolloClient({
    // link,
    cache,
    connectToDevTools: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
});

export default client;

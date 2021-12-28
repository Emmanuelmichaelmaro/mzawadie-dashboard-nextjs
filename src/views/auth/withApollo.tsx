/* eslint-disable react/static-property-placement */
// @ts-nocheck
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { NextPage, NextPageContext } from "next";
import PropTypes from "prop-types";
import React from "react";

import { initializeApollo } from "./apollo";

// eslint-disable-next-line import/no-anonymous-default-export
export default (ComposedComponent: NextPage) => {
    return class WithApollo extends React.Component {
        static displayName = `WithApollo(${ComposedComponent.displayName})`;

        static propTypes = {
            // eslint-disable-next-line react/forbid-prop-types
            serverState: PropTypes.object.isRequired,
        };

        static async getInitialProps(ctx: NextPageContext) {
            const headers = ctx.req ? ctx.req.headers : {};

            let serverState = {};

            // Setup a server-side one-time-use apollo client for initial props and
            // rendering (on server)
            const apollo = initializeApollo({ headers });

            // Evaluate the composed component's getInitialProps()
            let composedInitialProps = {};

            if (ComposedComponent.getInitialProps) {
                composedInitialProps = await ComposedComponent.getInitialProps(ctx);
            }

            // Run all graphql queries in the component tree
            // and extract the resulting data
            if (!process.browser) {
                if (ctx.res && ctx.res.finished) {
                    // When redirecting, the response is finished.
                    // No point in continuing to render
                    return;
                }

                // Provide the `url` prop data in case a graphql query uses it
                const url = { query: ctx.query, pathname: ctx.pathname };

                try {
                    // Run all GraphQL queries
                    const app = (
                        <ApolloProvider client={apollo}>
                            <ComposedComponent url={url} {...composedInitialProps} />
                        </ApolloProvider>
                    );

                    await getDataFromTree(app, {
                        router: {
                            query: ctx.query,
                            pathname: ctx.pathname,
                            asPath: ctx.asPath,
                        },
                    });
                } catch (error) {
                    // Prevent Apollo Client GraphQL errors from crashing SSR.
                    // Handle them in components via the data.error prop:
                    // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
                    console.error("Error while running `getDataFromTree`", error);
                }

                // getDataFromTree does not call componentWillUnmount
                // head side effect therefore need to be cleared manually
                // Head.rewind();

                // Extract query data from the Apollo's store
                const state = apollo.cache.extract();

                serverState = {
                    apollo: {
                        // Make sure to only include Apollo's data state
                        data: state.data,
                    },
                };
            }

            return {
                serverState,
                headers,
                ...composedInitialProps,
            };
        }

        apollo: ApolloClient<NormalizedCacheObject>;

        constructor(props: any) {
            super(props);

            // Note: Apollo should never be used on the server side beyond the initial
            // render within `getInitialProps()` above (since the entire prop tree
            // will be initialized there), meaning the below will only ever be
            // executed on the client.
            this.apollo = initializeApollo({
                headers: props.headers,
                initialState: props.serverState.apollo.data,
            });
        }

        render() {
            return (
                <ApolloProvider client={this.apollo}>
                    <ComposedComponent {...this.props} />
                </ApolloProvider>
            );
        }
    };
};

// To use it in pages
// you can export components with this as HOC
// example; WithApollo(WrappedComponent)

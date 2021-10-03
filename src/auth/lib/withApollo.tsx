/* eslint-disable react/static-property-placement */
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { NextPage, NextPageContext } from "next";
import PropTypes from "prop-types";
import React from "react";

import { createApolloClient, initializeApollo } from "./apollo";

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

            // Evaluate the composed component's getInitialProps()
            let composedInitialProps = {};

            if (ComposedComponent.getInitialProps) {
                composedInitialProps = await ComposedComponent.getInitialProps(ctx);
            }

            // Run all graphql queries in the component tree
            // and extract the resulting data
            if (!process.browser) {
                const apollo = createApolloClient(headers);
                // const apollo = useApollo(composedInitialProps);

                // Provide the `url` prop data in case a graphql query uses it
                // const url = { query: ctx.query, pathname: ctx.pathname };

                // Run all graphql queries
                const app = (
                    <ApolloProvider client={apollo}>
                        <ComposedComponent {...composedInitialProps} />
                    </ApolloProvider>
                );

                await getDataFromTree(app, {
                    router: {
                        query: ctx.query,
                        pathname: ctx.pathname,
                        asPath: ctx.asPath,
                    },
                });

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
            const { headers } = props;
            const initialState = props.serverState;
            this.apollo = initializeApollo({ headers, initialState });
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

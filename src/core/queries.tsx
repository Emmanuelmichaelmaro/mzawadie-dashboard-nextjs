/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
import { ApolloQueryResult, QueryResult } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import useAppState from "@mzawadie/hooks/useAppState";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useUser from "@mzawadie/hooks/useUser";
import { handleQueryAuthError } from "@mzawadie/views/auth/utils";
import { DocumentNode } from "graphql";
import React from "react";
import { useIntl } from "react-intl";

import { RequireAtLeastOne } from "./misc";

export interface LoadMore<TData, TVariables> {
    loadMore: (
        mergeFunction: (previous: TData, next: TData) => TData,
        extraVariables: Partial<TVariables>
    ) => Promise<ApolloQueryResult<TData>>;
}

export type TypedQueryResult<TData, TVariables> = QueryResult<TData, TVariables> &
    LoadMore<TData, TVariables>;

export interface TypedQueryInnerProperties<TData, TVariables> {
    children: (result: TypedQueryResult<TData, TVariables>) => React.ReactNode;
    displayLoader?: boolean;
    skip?: boolean;
    variables?: TVariables;
}

interface QueryProgressProperties {
    loading: boolean;
    onLoading: () => void;
    onCompleted: () => void;
}

class QueryProgress extends React.Component<QueryProgressProperties, {}> {
    componentDidMount() {
        const { loading, onLoading } = this.props;

        if (loading) {
            onLoading();
        }
    }

    componentDidUpdate(previousProperties: any) {
        const { loading, onLoading, onCompleted } = this.props;

        if (previousProperties.loading !== loading) {
            if (loading) {
                onLoading();
            } else {
                onCompleted();
            }
        }
    }

    render() {
        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}

// For some reason Query returns () => Element instead of () => ReactNode
export function TypedQuery<TData, TVariables>(
    query: DocumentNode
): React.FC<TypedQueryInnerProperties<TData, TVariables>> {
    // eslint-disable-next-line react/display-name
    return ({ children, displayLoader, skip, variables }) => {
        const notify = useNotifier();

        const [, dispatchAppState] = useAppState();

        const intl = useIntl();

        const user = useUser();

        return (
            <Query
                fetchPolicy="cache-and-network"
                query={query}
                variables={variables}
                skip={skip}
                context={{ useBatching: true }}
                errorPolicy="all"
                onError={(error: Query.ApolloError) =>
                    handleQueryAuthError(error, notify, user.tokenRefresh, user.logout, intl)
                }
            >
                {(queryData: QueryResult<TData, TVariables>) => {
                    const loadMore = (
                        mergeFunction: (previousResults: TData, fetchMoreResult: TData) => TData,
                        extraVariables: RequireAtLeastOne<TVariables>
                    ) =>
                        queryData.fetchMore({
                            query,
                            updateQuery: (previousResults, { fetchMoreResult }) => {
                                if (!fetchMoreResult) {
                                    return previousResults;
                                }
                                return mergeFunction(previousResults, fetchMoreResult);
                            },
                            variables: { ...variables, ...extraVariables },
                        });

                    if (displayLoader) {
                        return (
                            <QueryProgress
                                loading={queryData.loading}
                                onCompleted={() =>
                                    dispatchAppState({
                                        payload: {
                                            value: false,
                                        },
                                        type: "displayLoader",
                                    })
                                }
                                onLoading={() =>
                                    dispatchAppState({
                                        payload: {
                                            value: true,
                                        },
                                        type: "displayLoader",
                                    })
                                }
                            >
                                {children({
                                    ...queryData,
                                    loadMore,
                                })}
                            </QueryProgress>
                        );
                    }

                    return (
                        <>
                            {children({
                                ...queryData,
                                loadMore,
                            })}
                        </>
                    );
                }}
            </Query>
        );
    };
}

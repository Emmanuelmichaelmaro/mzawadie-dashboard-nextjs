/* eslint-disable @typescript-eslint/no-misused-promises */
// @ts-nocheck
import { ApolloQueryResult, QueryResult, useQuery as useBaseQuery } from "@apollo/client";
import { RequireAtLeastOne } from "@mzawadie/core";
import { User_userPermissions } from "@mzawadie/fragments/types/User";
import { useAuth } from "@mzawadie/sdk/lib/src";
import { PrefixedPermissions } from "@mzawadie/types/extendedTypes";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { handleQueryAuthError } from "@mzawadie/views/auth/utils";
import { DocumentNode } from "graphql";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import useAppState from "./useAppState";
import useNotifier from "./useNotifier";

const getPermissionKey = (permission: string) => `PERMISSION_${permission}` as PrefixedPermissions;

const allPermissions = Object.keys(PermissionEnum).reduce(
    (previous, code) => ({
        ...previous,
        [getPermissionKey(code)]: false,
    }),
    {} as Record<PrefixedPermissions, boolean>
);

const getUserPermissions = (userPermissions: User_userPermissions[]) =>
    userPermissions.reduce(
        (previous, permission) => ({
            ...previous,
            [getPermissionKey(permission.code)]: true,
        }),
        {} as Record<PrefixedPermissions, boolean>
    );

export interface LoadMore<TData, TVariables> {
    loadMore: (
        mergeFunction: (previous: TData, next: TData) => TData,
        extraVariables: Partial<TVariables>
    ) => Promise<ApolloQueryResult<TData>>;
}

export type UseQueryResult<TData, TVariables> = QueryResult<TData, TVariables> &
    LoadMore<TData, TVariables>;

export type UseQueryOpts<TVariables> = Partial<{
    displayLoader: boolean;
    skip: boolean;
    variables: TVariables;
}>;

type UseQueryHook<TData, TVariables> = (
    options: UseQueryOpts<Omit<TVariables, PrefixedPermissions>>
) => UseQueryResult<TData, TVariables>;

function makeQuery<TData, TVariables>(query: DocumentNode): UseQueryHook<TData, TVariables> {
    function useQuery({
        displayLoader,
        skip,
        variables,
    }: UseQueryOpts<TVariables>): UseQueryResult<TData, TVariables> {
        const notify = useNotifier();

        const intl = useIntl();

        const [, dispatchAppState] = useAppState();

        const { refreshSignInToken, signOut, user } = useAuth();

        const userPermissions = getUserPermissions(user?.userPermissions || []);

        const variablesWithPermissions = {
            ...variables,
            ...allPermissions,
            ...userPermissions,
        };

        const queryData = useBaseQuery(query, {
            context: {
                useBatching: true,
            },
            errorPolicy: "all",
            fetchPolicy: "cache-and-network",
            onError: (error) => handleQueryAuthError(error, notify, refreshSignInToken, signOut, intl),
            skip,
            variables: variablesWithPermissions,
        });

        useEffect(() => {
            if (displayLoader) {
                dispatchAppState({
                    payload: {
                        value: queryData.loading,
                    },
                    type: "displayLoader",
                });
            }
        }, [dispatchAppState, displayLoader, queryData.loading]);

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
                variables: { ...variablesWithPermissions, ...extraVariables },
            });

        return {
            ...queryData,
            loadMore,
        };
    }

    return useQuery;
}

export default makeQuery;

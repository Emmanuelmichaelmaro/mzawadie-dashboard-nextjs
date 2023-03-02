/* eslint-disable no-console */
// @ts-nocheck
import {
    ApolloError,
    MutationFunction,
    MutationResult,
    useMutation as useBaseMutation,
} from "@apollo/client";
import { commonMessages, getMutationStatus, MutationResultAdditionalProps } from "@mzawadie/core";
import { useUser } from "@mzawadie/pages/auth";
import { isJwtError } from "@mzawadie/pages/auth/errors";
import { GqlErrors, hasError } from "@mzawadie/utils/api";
import { DocumentNode } from "graphql";
import { useIntl } from "react-intl";

import { useNotifier } from "./useNotifier";

export type MutationResultWithOpts<TData> = MutationResult<TData> & MutationResultAdditionalProps;

export type UseMutation<TData, TVariables> = [
    MutationFunction<TData, TVariables>,
    MutationResultWithOpts<TData>
];

export type UseMutationCbs<TData> = Partial<{
    onCompleted: (data: TData) => void;
    onError: (error: ApolloError) => void;
    refetchQueries?: string[];
}>;

export type UseMutationHook<TData, TVariables> = (
    cbs: UseMutationCbs<TData>
) => UseMutation<TData, TVariables>;

function makeMutation<TData, TVariables>(mutation: DocumentNode): UseMutationHook<TData, TVariables> {
    function useMutation<TData, TVariables>({
        onCompleted,
        onError,
        refetchQueries = [],
    }: UseMutationCbs<TData>): UseMutation<TData, TVariables> {
        const notify = useNotifier();
        const intl = useIntl();
        const user = useUser();

        const [mutateFn, result] = useBaseMutation(mutation, {
            onCompleted,
            refetchQueries,
            onError: (err: ApolloError) => {
                if (hasError(err, GqlErrors.ReadOnlyException)) {
                    notify({
                        status: "error",
                        text: intl.formatMessage(commonMessages.readOnly),
                    });
                } else if (err.graphQLErrors.some(isJwtError)) {
                    user.logout().then((r) => console.log(r));
                    notify({
                        status: "error",
                        text: intl.formatMessage(commonMessages.sessionExpired),
                    });
                } else if (!hasError(err, GqlErrors.LimitReachedException)) {
                    notify({
                        status: "error",
                        text: intl.formatMessage(commonMessages.somethingWentWrong),
                    });
                }

                if (onError) {
                    onError(err);
                }
            },
        });

        return [
            mutateFn,
            {
                ...result,
                status: getMutationStatus(result),
            },
        ];
    }

    return useMutation;
}

export default makeMutation;

/* eslint-disable react-hooks/rules-of-hooks */
import {
    ApolloError,
    DocumentNode,
    MutationFunction,
    MutationResult,
    MutationUpdaterFn,
} from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { isJwtError } from "@mzawadie/auth";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useUser from "@mzawadie/hooks/useUser";
import { commonMessages } from "@mzawadie/intl";
import { getMutationStatus } from "@mzawadie/misc";
import { GqlErrors, hasError } from "@mzawadie/utils/api";
import React from "react";
import { useIntl } from "react-intl";

import { MutationResultAdditionalProps } from "./types";

export interface TypedMutationInnerProps<TData, TVariables> {
    children: (
        mutateFn: MutationFunction<TData, TVariables>,
        result: MutationResult<TData> & MutationResultAdditionalProps
    ) => React.ReactNode;
    onCompleted?: (data: TData) => void;
    onError?: (error: ApolloError) => void;
    variables?: TVariables;
}

// For some reason Mutation returns () => Element instead of () => ReactNode
export function TypedMutation<TData, TVariables>(
    mutation: DocumentNode,
    update?: MutationUpdaterFn<TData>
) {
    return (props: TypedMutationInnerProps<TData, TVariables>) => {
        const { children, onCompleted, onError, variables } = props;
        const intl = useIntl();
        const notify = useNotifier();
        const user = useUser();

        return (
            <Mutation
                mutation={mutation}
                onCompleted={onCompleted}
                onError={(err: ApolloError) => {
                    if (err.networkError) {
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.somethingWentWrong),
                        });
                    }

                    if (hasError(err, GqlErrors.ReadOnlyException)) {
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.readOnly),
                        });
                    } else if (err.graphQLErrors.some(isJwtError)) {
                        user.logout();
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
                }}
                variables={variables}
                update={update}
            >
                {(mutateFn: MutationFunction, result: MutationResult) => (
                    <>
                        {children(mutateFn, {
                            ...result,
                            status: getMutationStatus(result),
                        })}
                    </>
                )}
            </Mutation>
        );
    };
}

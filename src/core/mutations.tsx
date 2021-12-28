/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
import {
    ApolloError,
    DocumentNode,
    MutationFunction,
    MutationResult,
    MutationUpdaterFn,
} from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { useAuth } from "@mzawadie/sdk/lib/src";
import { GqlErrors, hasError } from "@mzawadie/utils/api";
import { isJwtError } from "@mzawadie/views/auth/errors";
import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "./intl";
import { getMutationStatus } from "./misc";
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
): React.FC<TypedMutationInnerProps<TData, TVariables>> {
    // eslint-disable-next-line react/display-name
    return ({ children, onCompleted, onError, variables }) => {
        // const { children, onCompleted, onError, variables } = props;

        const intl = useIntl();
        const notify = useNotifier();
        const { user } = useAuth();

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

// @ts-nocheck
import { ApolloError, MutationFunction, MutationResult, MutationUpdaterFn } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useUser } from "@mzawadie/pages/auth";
import { isJwtError } from "@mzawadie/pages/auth/errors";
import { GqlErrors, hasError } from "@mzawadie/utils/api";
import { DocumentNode } from "graphql";
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
    return ({ children, onCompleted, onError, variables }) => {
        const notify = useNotifier();
        const intl = useIntl();
        const user = useUser();

        return (
            <Mutation
                mutation={mutation}
                onCompleted={onCompleted}
                onError={(err: ApolloError) => {
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(err, null, 4));
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
                {(mutateFn, result) => (
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

/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable react/display-name */

/* eslint-disable unicorn/no-array-callback-reference */
import Mutation, {
    ApolloError,
    MutationFunction,
    MutationResult,
    MutationUpdaterFn,
} from "@apollo/client"
import { DocumentNode } from "graphql"
import React from "react"
import { useIntl } from "react-intl"

import { isJwtError } from "./auth/errors"
import useNotifier from "./hooks/useNotifier"
import useUser from "./hooks/useUser"
import { commonMessages } from "./intl"
import { getMutationStatus } from "./misc"
import { MutationResultAdditionalProps as MutationResultAdditionalProperties } from "./types"
import { GqlErrors, hasError } from "./utils/api"

export interface TypedMutationInnerProperties<TData, TVariables> {
    children: (
        mutateFunction: MutationFunction<TData, TVariables>,
        result: MutationResult<TData> & MutationResultAdditionalProperties
    ) => React.ReactNode
    onCompleted?: (data: TData) => void
    onError?: (error: ApolloError) => void
    variables?: TVariables
}

// For some reason Mutation returns () => Element instead of () => ReactNode
export function TypedMutation<TData, TVariables>(
    mutation: DocumentNode,
    update?: MutationUpdaterFn<TData>
) {
    return (properties: TypedMutationInnerProperties<TData, TVariables>) => {
        const notify = useNotifier()
        const intl = useIntl()
        const user = useUser()
        const { children, onCompleted, onError, variables } = properties

        return (
            <Mutation
                mutation={mutation}
                onCompleted={onCompleted}
                onError={(error: ApolloError) => {
                    if (error.networkError) {
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.somethingWentWrong),
                        })
                    }
                    if (hasError(error, GqlErrors.ReadOnlyException)) {
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.readOnly),
                        })
                    } else if (error.graphQLErrors.some(isJwtError)) {
                        user.logout()
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.sessionExpired),
                        })
                    } else if (!hasError(error, GqlErrors.LimitReachedException)) {
                        notify({
                            status: "error",
                            text: intl.formatMessage(commonMessages.somethingWentWrong),
                        })
                    }
                    if (onError) {
                        onError(error)
                    }
                }}
                variables={variables}
                update={update}
            >
                {(mutateFunction: any, result: any) => (
                    <>
                        {children(mutateFunction, {
                            ...result,
                            status: getMutationStatus(result),
                        })}
                    </>
                )}
            </Mutation>
        )
    }
}

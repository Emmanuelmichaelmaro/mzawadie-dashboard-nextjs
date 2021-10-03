import { ApolloError, DocumentNode, MutationFunction, MutationResult, MutationUpdaterFn } from "@apollo/client";
import React from "react";
import { MutationResultAdditionalProps } from "./types";
export interface TypedMutationInnerProps<TData, TVariables> {
    children: (mutateFn: MutationFunction<TData, TVariables>, result: MutationResult<TData> & MutationResultAdditionalProps) => React.ReactNode;
    onCompleted?: (data: TData) => void;
    onError?: (error: ApolloError) => void;
    variables?: TVariables;
}
export declare function TypedMutation<TData, TVariables>(mutation: DocumentNode, update?: MutationUpdaterFn<TData>): (props: TypedMutationInnerProps<TData, TVariables>) => JSX.Element;

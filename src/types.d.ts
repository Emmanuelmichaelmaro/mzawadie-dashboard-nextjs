import { MutationResult } from "@apollo/client";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
export interface MutationResultAdditionalProps {
    status: ConfirmButtonTransitionState;
}
export interface PartialMutationProviderOutput<TData extends {} = {}, TVariables extends {} = {}> {
    opts: MutationResult<TData> & MutationResultAdditionalProps;
    mutate: (variables: TVariables) => void;
}
export interface UserError {
    field: string | null;
    message?: string;
}

import { MutationFunction, MutationResult } from "@apollo/client";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { MutationResultAdditionalProps, PartialMutationProviderOutput, UserError } from "./types";
export declare function maybe<T>(exp: () => T): T | undefined;
export declare function maybe<T>(exp: () => T, d: T): T;
export declare function only<T>(obj: T, key: keyof T): boolean;
export declare function empty(obj: {}): boolean;
export declare function hasErrors(errorList: UserError[] | null): boolean;
export declare function findValueInEnum<TEnum extends {}>(needle: string, haystack: TEnum): TEnum[keyof TEnum];
interface MzawadieMutationResult {
    errors?: UserError[];
}
export declare function getMutationState(called: boolean, loading: boolean, ...errorList: any[][]): ConfirmButtonTransitionState;
export declare function getMutationErrors<TData extends Record<string, MzawadieMutationResult>>(data: TData): UserError[];
export declare function getMutationStatus<TData extends Record<string, MzawadieMutationResult | any>>(opts: MutationResult<TData>): ConfirmButtonTransitionState;
export declare function getMutationProviderData<TData, TVariables>(mutateFn: MutationFunction<TData, TVariables>, opts: MutationResult<TData> & MutationResultAdditionalProps): PartialMutationProviderOutput<TData, TVariables>;
interface User {
    email: string;
    firstName?: string;
    lastName?: string;
}
export declare function getUserName(user?: User, returnEmail?: boolean): string | undefined;
export declare function getUserInitials(user?: User): string | undefined;
export declare function getFullName<T extends {
    firstName: string;
    lastName: string;
}>(data: T): string;
export {};

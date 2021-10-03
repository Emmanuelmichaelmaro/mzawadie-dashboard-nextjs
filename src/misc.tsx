/* eslint-disable import/prefer-default-export */

/* eslint-disable @typescript-eslint/ban-types */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MutationFunction, MutationResult } from "@apollo/client";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";

import { MutationResultAdditionalProps, PartialMutationProviderOutput, UserError } from "./types";

export function maybe<T>(exp: () => T): T | undefined;
export function maybe<T>(exp: () => T, d: T): T;
export function maybe(exp: any, d?: any) {
    try {
        const result = exp();
        return result === undefined ? d : result;
    } catch {
        return d;
    }
}

export function only<T>(obj: T, key: keyof T): boolean {
    return Object.keys(obj).every((objKey) =>
        objKey === key ? obj[key] !== undefined : obj[key] === undefined
    );
}

export function empty(obj: {}): boolean {
    // @ts-ignore
    return Object.keys(obj).every((key) => obj[key] === undefined);
}

export function hasErrors(errorList: UserError[] | null): boolean {
    return !(errorList === undefined || errorList === null || errorList.length === 0);
}

export function findValueInEnum<TEnum extends {}>(needle: string, haystack: TEnum): TEnum[keyof TEnum] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const match = Object.entries(haystack).find(([_, value]) => value === needle);

    if (!match) {
        throw new Error(`Value ${needle} not found in enum`);
    }

    return needle as unknown as TEnum[keyof TEnum];
}

interface MzawadieMutationResult {
    errors?: UserError[];
}

export function getMutationState(
    called: boolean,
    loading: boolean,
    ...errorList: any[][]
): ConfirmButtonTransitionState {
    if (loading) {
        return "loading";
    }

    if (called) {
        return errorList.map(hasErrors).reduce((acc, curr) => acc || curr, false) ? "error" : "success";
    }

    return "default";
}

export function getMutationErrors<TData extends Record<string, MzawadieMutationResult>>(
    data: TData
): UserError[] {
    return Object.values(data).reduce(
        // @ts-ignore
        (acc: UserError[], mut) => [...acc, ...maybe(() => mut.errors, [])],
        []
    );
}

export function getMutationStatus<TData extends Record<string, MzawadieMutationResult | any>>(
    opts: MutationResult<TData>
): ConfirmButtonTransitionState {
    const errors = opts.data ? getMutationErrors(opts.data) : [];

    return getMutationState(opts.called, opts.loading, errors);
}

export function getMutationProviderData<TData, TVariables>(
    mutateFn: MutationFunction<TData, TVariables>,
    opts: MutationResult<TData> & MutationResultAdditionalProps
): PartialMutationProviderOutput<TData, TVariables> {
    return {
        mutate: (variables: any) => mutateFn({ variables }),
        opts,
    };
}

interface User {
    email: string;
    firstName?: string;
    lastName?: string;
}

export function getUserName(user?: User, returnEmail?: boolean) {
    return user && (user.email || (user.firstName && user.lastName))
        ? user.firstName && user.lastName
            ? [user.firstName, user.lastName].join(" ")
            : returnEmail
            ? user.email
            : user.email.split("@")[0]
        : undefined;
}

export function getUserInitials(user?: User) {
    return user && (user.email || (user.firstName && user.lastName))
        ? (user.firstName && user.lastName
              ? user.firstName[0] + user.lastName[0]
              : user.email.slice(0, 2)
          ).toUpperCase()
        : undefined;
}

export function getFullName<T extends { firstName: string; lastName: string }>(data: T) {
    if (!data || !data.firstName || !data.lastName) {
        return "";
    }

    return `${data.firstName} ${data.lastName}`;
}

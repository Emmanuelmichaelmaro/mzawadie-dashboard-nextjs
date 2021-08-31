import { MutationResult } from "@apollo/client"
import { ThemeType } from "@saleor/macaw-ui"

import { ConfirmButtonTransitionState } from "./components/ConfirmButton"
import { UserError } from "./types"

export const isDarkTheme = (themeType: ThemeType) => themeType === "dark"

export function findValueInEnum<TEnum extends {}>(
    needle: string,
    haystack: TEnum
): TEnum[keyof TEnum] {
    const match = Object.entries(haystack).find(([_, value]) => value === needle)

    if (!match) {
        throw new Error(`Value ${needle} not found in enum`)
    }

    return needle as unknown as TEnum[keyof TEnum]
}

export function getMutationState(
    called: boolean,
    loading: boolean,
    ...errorList: any[][]
): ConfirmButtonTransitionState {
    if (loading) {
        return "loading"
    }
    if (called) {
        return errorList
            .map(hasErrors)
            .reduce((accumulator, current) => accumulator || current, false)
            ? "error"
            : "success"
    }
    return "default"
}

interface SaleorMutationResult {
    errors?: UserError[]
}
export function getMutationErrors<TData extends Record<string, SaleorMutationResult>>(
    data: TData
): UserError[] {
    return Object.values(data).reduce(
        (accumulator: UserError[], mut) => [
            ...accumulator,
            ...maybe(() => mut.errors, []),
        ],
        []
    )
}

export function getMutationStatus<
    TData extends Record<string, SaleorMutationResult | any>
>(options: MutationResult<TData>): ConfirmButtonTransitionState {
    const errors = options.data ? getMutationErrors(options.data) : []

    return getMutationState(options.called, options.loading, errors)
}

export function getFullName<T extends { firstName: string; lastName: string }>(data: T) {
    if (!data || !data.firstName || !data.lastName) {
        return ""
    }

    return `${data.firstName} ${data.lastName}`
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    { [K in Keys]-?: Required<Pick<T, K>> }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys]

interface User {
    email: string
    firstName?: string
    lastName?: string
}

export function getUserName(user?: User, returnEmail?: boolean) {
    return user && (user.email || (user.firstName && user.lastName))
        ? user.firstName && user.lastName
            ? [user.firstName, user.lastName].join(" ")
            : returnEmail
            ? user.email
            : user.email.split("@")[0]
        : undefined
}

export function getUserInitials(user?: User) {
    return user && (user.email || (user.firstName && user.lastName))
        ? (user.firstName && user.lastName
              ? user.firstName[0] + user.lastName[0]
              : user.email.slice(0, 2)
          ).toUpperCase()
        : undefined
}

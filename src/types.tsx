import { PermissionEnum } from "../generated/graphql"
import { ConfirmButtonTransitionState } from "./components/ConfirmButton"

// eslint-disable-next-line unicorn/prevent-abbreviations
export interface MutationResultAdditionalProps {
    status: ConfirmButtonTransitionState
}

export interface UserError {
    field: string | null
    message?: string
}

export interface DialogProperties {
    open: boolean
    onClose: () => void
}

export interface ListSettings<TColumn extends string = string> {
    columns?: TColumn[]
    rowNumber: number
}

export type PrefixedPermissions = `PERMISSION_${PermissionEnum}`

export type ActiveTab<TTab extends string = string> = Partial<{
    activeTab: TTab
}>

export type BulkAction = Partial<{
    ids: string[]
}>

export type Filters<TFilters extends string> = Partial<Record<TFilters, string>>

export type FiltersWithMultipleValues<TFilters extends string> = Partial<
    Record<TFilters, string[]>
>

export type FiltersAsDictWithMultipleValues<TFilters extends string> = Partial<
    Record<TFilters, Record<string, string[]>>
>

export type Search = Partial<{
    query: string
}>

export type SingleAction = Partial<{
    id: string
}>

export type Sort<TSort extends string = string> = Partial<{
    asc: boolean
    sort: TSort
}>

export interface Node {
    id: string
}
export interface SlugNode {
    slug: string
}

export interface TagNode {
    tag: string
}

export type Pagination = Partial<{
    after: string
    before: string
}>

export type Dialog<TDialog extends string> = Partial<{
    action: TDialog
}>

export type TabActionDialog = "save-search" | "delete-search"

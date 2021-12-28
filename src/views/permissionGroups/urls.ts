// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { BulkAction, Dialog, Pagination, SingleAction, Sort, TabActionDialog } from "@mzawadie/core";
import { stringifyQs } from "@mzawadie/utils/urls";
import urlJoin from "url-join";

const permissionGroupSection = "/permission-groups/";

export const permissionGroupListPath = permissionGroupSection;

export type PermissionGroupListUrlDialog = "remove" | TabActionDialog;
export enum PermissionGroupListUrlSortField {
    name = "name",
}
export type PermissionGroupListUrlSort = Sort<PermissionGroupListUrlSortField>;
export type PermissionGroupListUrlQueryParams = Dialog<PermissionGroupListUrlDialog> &
    Pagination &
    PermissionGroupListUrlSort &
    SingleAction;
export const permissionGroupListUrl = (params?: PermissionGroupListUrlQueryParams) =>
    // eslint-disable-next-line prefer-template
    permissionGroupListPath + "?" + stringifyQs(params || {});

export const permissionGroupAddPath = urlJoin(permissionGroupSection, "add");
export const permissionGroupAddUrl = permissionGroupAddPath;

export enum MembersListUrlSortField {
    name = "name",
    email = "email",
}
export type MembersListUrlSort = Sort<MembersListUrlSortField>;

export const permissionGroupDetailsPath = (id: string) => urlJoin(permissionGroupSection, id);
export type PermissionGroupDetailsUrlDialog = "remove" | "assign" | "unassign" | "unassignError";
export type PermissionGroupDetailsUrlQueryParams = BulkAction &
    Pagination &
    MembersListUrlSort &
    Dialog<PermissionGroupDetailsUrlDialog>;

export const permissionGroupDetailsUrl = (
    id: string | undefined,
    params?: PermissionGroupDetailsUrlQueryParams
    // eslint-disable-next-line prefer-template
) => permissionGroupDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params || {});

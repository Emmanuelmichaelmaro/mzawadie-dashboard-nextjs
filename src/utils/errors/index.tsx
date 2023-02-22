/* eslint-disable no-param-reassign */
// @ts-nocheck
import { UserError } from "@mzawadie/core";

export function getFieldError<T extends UserError>(errors: T[], field: string): T {
    return errors.find((err) => err.field === field);
}

export function getErrors(errors: UserError[]): string[] {
    return errors.filter((err) => ["", null].includes(err.field)).map((err) => err.message);
}

export type FormErrors<TField extends string, TError extends UserError> = Record<TField, TError>;

export function getFormErrors<TField extends string, TError extends UserError>(
    fields: TField[],
    errors: TError[] = []
): Record<TField, TError> {
    return fields.reduce((errs, field) => {
        errs[field] = getFieldError(errors, field);
        return errs;
    }, {} as unknown as Record<TField, TError>);
}

export interface ChannelError {
    field: string | null;
    channels: string[] | [];
}

export function getFieldChannelError<T extends ChannelError>(errors: T[], field: string): T[] {
    return errors.filter((err) => err.field === field);
}

export function getFormChannelErrors<TField extends string, TError extends ChannelError>(
    fields: TField[],
    errors: TError[]
) {
    return fields.reduce((errs, field) => {
        errs[field] = [...(errs[field] ? errs[field] : []), ...getFieldChannelError(errors, field)];
        return errs;
    }, {} as Record<TField, TError[]>);
}

export function getFormChannelError<TError extends ChannelError>(
    formError: TError[],
    channelId: string
) {
    return formError?.find((error) => error.channels?.find((id) => id === channelId));
}

export { default as getAccountErrorMessage } from "./account";
export { default as getAppErrorMessage } from "./app";
export { default as getAttributeErrorMessage } from "./attribute";
export { default as getChannelsErrorMessage } from "./channels";
export { default as getCommonErrorMessage } from "./common";
export { default as getDiscountsErrorMessage } from "./discounts";
export { default as getExportErrorMessage } from "./export";
export { default as getInvoiceErrorMessage } from "./invoice";
export { default as getMenuErrorMessage } from "./menu";
export { default as getOrderErrorMessage } from "./order";
export { default as getPageErrorMessage } from "./page";
export { default as getPermissionGroupErrorMessage } from "./permissionGroups";
export { default as getPluginsErrorMessage } from "./plugins";
export { default as getProductErrorMessage } from "./product";
export { default as getShippingErrorMessage } from "./shipping";
export { default as getShopErrorMessage } from "./shop";
export { default as getStaffErrorMessage } from "./staff";
export { default as getStockErrorMessage } from "./stock";
export { default as getWarehouseErrorMessage } from "./warehouse";
export { default as getWebhookErrorMessage } from "./webhooks";

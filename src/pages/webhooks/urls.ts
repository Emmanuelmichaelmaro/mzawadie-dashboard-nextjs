// @ts-nocheck
import { ActiveTab, Dialog, SingleAction, TabActionDialog } from "@mzawadie/core";
import { customAppListPath, appsSection } from "@mzawadie/pages/apps/urls";
import { stringifyQs } from "@mzawadie/utils/urls";
import urlJoin from "url-join";

export const webhookSection = "/webhooks/";
export const webhookListPath = webhookSection;

export type WebhookListUrlDialog = "remove" | TabActionDialog;

export type WebhookListUrlQueryParams = ActiveTab & Dialog<WebhookListUrlDialog> & SingleAction;

export const webhookPath = (id: string) => urlJoin(appsSection, webhookSection, id);

export type WebhookUrlDialog = "remove";
export type WebhookUrlQueryParams = Dialog<WebhookUrlDialog> & SingleAction;
export const webhookUrl = (id: string, params?: WebhookUrlQueryParams) =>
    `${webhookPath(encodeURIComponent(id))}?${stringifyQs(params)}`;

export const webhookAddPath = (id: string) => urlJoin(customAppListPath, id, webhookSection, "add");
export const webhookAddUrl = webhookAddPath;

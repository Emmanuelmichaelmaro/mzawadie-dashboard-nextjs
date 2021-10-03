import { WebhookErrorCode } from "./../../types/globalTypes";
export interface WebhookErrorFragment {
    __typename: "WebhookError";
    code: WebhookErrorCode;
    field: string | null;
}

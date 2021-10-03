export interface WebhooksDetailsFragment_app {
    __typename: "App";
    id: string;
    name: string | null;
}
export interface WebhooksDetailsFragment {
    __typename: "Webhook";
    id: string;
    name: string;
    isActive: boolean;
    app: WebhooksDetailsFragment_app;
}

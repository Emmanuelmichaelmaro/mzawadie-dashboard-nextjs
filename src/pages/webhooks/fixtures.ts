// @ts-nocheck
import { WebhookDetailsQuery } from "@mzawadie/graphql";

export const webhook: WebhookDetailsQuery["webhook"] = {
    __typename: "Webhook",
    app: {
        __typename: "App",
        id: "Jzx1ss23sEt==",
        name: "Test App 2",
    },
    syncEvents: [],
    asyncEvents: [],
    id: "Jzx123sEt==",
    isActive: true,
    name: "Webhook Test 2",
    secretKey: "zxczx_asdas",
    targetUrl: "https://www.getsaleor.com",
};

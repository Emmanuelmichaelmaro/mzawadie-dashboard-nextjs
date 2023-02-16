import { FulfillmentStatus } from "@mzawadie/types/globalTypes";

export const refundFulfilledStatuses = [
    FulfillmentStatus.FULFILLED,
    FulfillmentStatus.RETURNED,
    FulfillmentStatus.WAITING_FOR_APPROVAL,
];

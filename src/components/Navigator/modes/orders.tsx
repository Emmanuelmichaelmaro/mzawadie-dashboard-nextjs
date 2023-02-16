// @ts-nocheck
import { maybe, transformOrderStatus } from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import { IntlShape } from "react-intl";

import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";
import { QuickSearchAction } from "../types";
import messages from "./messages";

export function isQueryValidOrderNumber(query: string): boolean {
    // eslint-disable-next-line radix
    return query === parseInt(query, 0).toString();
}

export function getGqlOrderId(orderNumber: string): string {
    return btoa(`Order:${orderNumber}`);
}

function getOrdersModeActions(
    query: string,
    intl: IntlShape,
    navigate: UseNavigatorResult,
    order: CheckIfOrderExists_order | undefined | null
): QuickSearchAction[] {
    const gqlId = getGqlOrderId(query);

    if (isQueryValidOrderNumber(query) && maybe(() => order?.id === gqlId)) {
        return [
            {
                extraInfo: transformOrderStatus(order?.status, intl).localized,
                label: intl.formatMessage(messages.goToOrder, {
                    orderNumber: query,
                }),
                onClick: () => {
                    navigate(orderUrl(gqlId));
                    return false;
                },
                type: "action",
            },
        ];
    }

    return [];
}

export default getOrdersModeActions;

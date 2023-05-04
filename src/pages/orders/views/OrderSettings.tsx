// @ts-nocheck
import { commonMessages } from "@mzawadie/core";
import { extractMutationErrors, getMutationState } from "@mzawadie/core";
import { useOrderSettingsQuery, useOrderSettingsUpdateMutation } from "@mzawadie/graphql";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { OrderSettingsPage } from "@mzawadie/pages/orders/components/OrderSettingsPage";
import React from "react";
import { useIntl } from "react-intl";

import { OrderSettingsFormData } from "../components/OrderSettingsPage/types";

export const OrderSettings: React.FC = () => {
    const intl = useIntl();

    const notify = useNotifier();

    const { data, loading } = useOrderSettingsQuery({});

    const [orderSettingsUpdate, orderSettingsUpdateOpts] = useOrderSettingsUpdateMutation({
        onCompleted: ({ orderSettingsUpdate: { errors } }) => {
            if (!errors.length) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                return;
            }

            notify({
                status: "error",
                text: intl.formatMessage(commonMessages.somethingWentWrong),
            });
        },
    });

    const handleSubmit = async ({
        automaticallyConfirmAllNewOrders,
        automaticallyFulfillNonShippableGiftCard,
        fulfillmentAutoApprove,
        fulfillmentAllowUnpaid,
    }: OrderSettingsFormData) =>
        extractMutationErrors(
            orderSettingsUpdate({
                variables: {
                    orderSettingsInput: {
                        automaticallyFulfillNonShippableGiftCard,
                        automaticallyConfirmAllNewOrders,
                    },
                    shopSettingsInput: {
                        fulfillmentAutoApprove,
                        fulfillmentAllowUnpaid,
                    },
                },
            })
        );

    return (
        <OrderSettingsPage
            orderSettings={data?.orderSettings}
            shop={data?.shop}
            disabled={loading || orderSettingsUpdateOpts.loading}
            onSubmit={handleSubmit}
            saveButtonBarState={getMutationState(
                orderSettingsUpdateOpts.called,
                orderSettingsUpdateOpts.loading,
                [...(orderSettingsUpdateOpts.data?.orderSettingsUpdate?.errors || [])]
            )}
        />
    );
};

export default OrderSettings;

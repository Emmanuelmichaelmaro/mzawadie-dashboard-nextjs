// @ts-nocheck
import { commonMessages, extractMutationErrors, getMutationState } from "@mzawadie/core";
import { useOrderSettingsQuery, useOrderSettingsUpdateMutation } from "@mzawadie/graphql";
import { useNavigator, useNotifier } from "@mzawadie/hooks";
import {
    OrderSettingsPage,
    OrderSettingsFormData,
} from "@mzawadie/pages/orders/components/OrderSettingsPage";
import { orderListUrl } from "@mzawadie/pages/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

export const OrderSettings: React.FC = () => {
    const intl = useIntl();
    const navigate = useNavigator();
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

    const handleBack = () => navigate(orderListUrl());

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
            onBack={handleBack}
            saveButtonBarState={getMutationState(
                orderSettingsUpdateOpts.called,
                orderSettingsUpdateOpts.loading,
                [...(orderSettingsUpdateOpts.data?.orderSettingsUpdate?.errors || [])]
            )}
        />
    );
};

export default OrderSettings;

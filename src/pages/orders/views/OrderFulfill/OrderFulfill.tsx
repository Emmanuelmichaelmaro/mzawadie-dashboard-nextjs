// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { extractMutationErrors } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { OrderFulfillPage } from "@mzawadie/pages/orders/components/OrderFulfillPage";
import { useOrderFulfill } from "@mzawadie/pages/orders/mutations";
import { useOrderFulfillData, useOrderFulfillSettingsQuery } from "@mzawadie/pages/orders/queries";
import { OrderFulfillData_order } from "@mzawadie/pages/orders/types/OrderFulfillData";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import { getWarehousesFromOrderLines } from "@mzawadie/pages/orders/utils/data";
import { WarehouseClickAndCollectOptionEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderFulfillProps {
    orderId: string;
}

const resolveLocalFulfillment = (order: OrderFulfillData_order, orderLineWarehouses: any) => {
    const deliveryMethod = order?.deliveryMethod;
    if (
        deliveryMethod?.__typename === "Warehouse" &&
        deliveryMethod?.clickAndCollectOption === WarehouseClickAndCollectOptionEnum.LOCAL
    ) {
        return orderLineWarehouses?.filter((warehouse) => warehouse?.id === deliveryMethod?.id);
    }
    return orderLineWarehouses;
};

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data: settings, loading: settingsLoading } = useOrderFulfillSettingsQuery({});

    const { data, loading } = useOrderFulfillData({
        displayLoader: true,
        variables: {
            orderId,
        },
    });

    const orderLinesWarehouses = getWarehousesFromOrderLines(data?.order?.lines);

    const [fulfillOrder, fulfillOrderOpts] = useOrderFulfill({
        onCompleted: (data) => {
            if (data.orderFulfill?.errors.length === 0) {
                navigate(orderUrl(orderId), { replace: true });
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Fulfilled Items",
                        id: "CYEnGq",
                        description: "order fulfilled success message",
                    }),
                });
            }
        },
    });

    const resolvedOrderLinesWarehouses = resolveLocalFulfillment(data?.order, orderLinesWarehouses);

    return (
        <>
            <WindowTitle
                title={
                    data?.order?.number
                        ? intl.formatMessage(
                              {
                                  defaultMessage: "Fulfill Order #{orderNumber}",
                                  id: "2MKBk2",
                                  description: "window title",
                              },
                              {
                                  orderNumber: data.order.number,
                              }
                          )
                        : intl.formatMessage({
                              defaultMessage: "Fulfill Order",
                              id: "NzifUg",
                              description: "window title",
                          })
                }
            />

            <OrderFulfillPage
                loading={loading || settingsLoading || fulfillOrderOpts.loading}
                errors={fulfillOrderOpts.data?.orderFulfill?.errors}
                onBack={() => navigate(orderUrl(orderId))}
                onSubmit={(formData) =>
                    extractMutationErrors(
                        fulfillOrder({
                            variables: {
                                input: {
                                    lines: formData.items.map((line) => ({
                                        orderLineId: line.id,
                                        stocks: line.value,
                                    })),
                                    notifyCustomer:
                                        settings?.shop?.fulfillmentAutoApprove && formData.sendInfo,
                                },
                                orderId,
                            },
                        })
                    )
                }
                order={data?.order}
                saveButtonBar="default"
                warehouses={resolvedOrderLinesWarehouses}
                shopSettings={settings?.shop}
            />
        </>
    );
};

OrderFulfill.displayName = "OrderFulfill";

export default OrderFulfill;

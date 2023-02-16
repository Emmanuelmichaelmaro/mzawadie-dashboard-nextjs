// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { getDatePeriod, getUserName } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useUser } from "@mzawadie/pages/auth";
import { channelsListUrl } from "@mzawadie/pages/channels/urls";
import { orderListUrl } from "@mzawadie/pages/orders/urls";
import { productListUrl, productVariantEditUrl } from "@mzawadie/pages/products/urls";
import { OrderStatusFilter, StockAvailability } from "@mzawadie/types/globalTypes";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { HomePage } from "../components/HomePage";
import { useHomePage } from "../queries";

const HomeSection = () => {
    const navigate = useNavigator();
    const { user } = useUser();
    const { channel } = useAppChannel();

    const noChannel = !channel && typeof channel !== "undefined";

    const { data } = useHomePage({
        displayLoader: true,
        skip: noChannel,
        variables: { channel: channel?.slug, datePeriod: getDatePeriod(1) },
    });

    return (
        <HomePage
            activities={mapEdgesToItems(data?.activities)?.reverse()}
            orders={data?.ordersToday?.totalCount}
            sales={data?.salesToday?.gross}
            topProducts={mapEdgesToItems(data?.productTopToday)}
            onProductClick={(productId, variantId) =>
                navigate(productVariantEditUrl(productId, variantId))
            }
            onCreateNewChannelClick={() => {
                navigate(channelsListUrl());
            }}
            onOrdersToCaptureClick={() =>
                navigate(
                    orderListUrl({
                        status: [OrderStatusFilter.READY_TO_CAPTURE],
                        channel: [channel?.id],
                    })
                )
            }
            onOrdersToFulfillClick={() =>
                navigate(
                    orderListUrl({
                        status: [OrderStatusFilter.READY_TO_FULFILL],
                        channel: [channel?.id],
                    })
                )
            }
            onProductsOutOfStockClick={() =>
                navigate(
                    productListUrl({
                        stockStatus: StockAvailability.OUT_OF_STOCK,
                        channel: channel?.slug,
                    })
                )
            }
            ordersToCapture={data?.ordersToCapture?.totalCount}
            ordersToFulfill={data?.ordersToFulfill?.totalCount}
            productsOutOfStock={data?.productsOutOfStock.totalCount}
            userName={getUserName(user, true)}
            userPermissions={user?.userPermissions}
            noChannel={noChannel}
        />
    );
};

export default HomeSection;

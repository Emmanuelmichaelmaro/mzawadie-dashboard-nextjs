// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { getDatePeriod, getUserName } from "@mzawadie/core";
import { OrderStatusFilter, StockAvailability, useHomeQuery } from "@mzawadie/graphql";
import { useUser } from "@mzawadie/pages/auth";
import { channelsListUrl } from "@mzawadie/pages/channels/urls";
import { HomePage } from "@mzawadie/pages/home/components/HomePage";
import { orderListUrl } from "@mzawadie/pages/orders/urls";
import { productListUrl } from "@mzawadie/pages/products/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

const HomeSection = () => {
    const { user } = useUser();
    const { channel } = useAppChannel();

    const noChannel = !channel && typeof channel !== "undefined";

    const { data } = useHomeQuery({
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
            createNewChannelHref={channelsListUrl()}
            ordersToCaptureHref={orderListUrl({
                status: [OrderStatusFilter.READY_TO_CAPTURE],
                channel: [channel?.id],
            })}
            ordersToFulfillHref={orderListUrl({
                status: [OrderStatusFilter.READY_TO_FULFILL],
                channel: [channel?.id],
            })}
            productsOutOfStockHref={productListUrl({
                stockStatus: StockAvailability.OUT_OF_STOCK,
                channel: channel?.slug,
            })}
            ordersToCapture={data?.ordersToCapture?.totalCount}
            ordersToFulfill={data?.ordersToFulfill?.totalCount}
            productsOutOfStock={data?.productsOutOfStock?.totalCount}
            userName={getUserName(user, true)}
            noChannel={noChannel}
        />
    );
};

export default HomeSection;

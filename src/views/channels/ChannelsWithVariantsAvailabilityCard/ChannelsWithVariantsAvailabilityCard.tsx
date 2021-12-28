/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// @ts-ignore
import ChannelAvailabilityItemContent from "@mzawadie/components/ChannelsAvailabilityCard/Channel/ChannelAvailabilityItemContent";
import ChannelsAvailabilityCardWrapper, {
    ChannelsAvailabilityWrapperProps,
} from "@mzawadie/components/ChannelsAvailabilityCard/ChannelsAvailabilityCardWrapper";
import {
    ChannelOpts,
    ChannelsAvailabilityError,
    Messages,
} from "@mzawadie/components/ChannelsAvailabilityCard/types";
import { getChannelsAvailabilityMessages } from "@mzawadie/components/ChannelsAvailabilityCard/utils";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import CannotDefineChannelsAvailabilityCard from "@mzawadie/views/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@mzawadie/views/channels/utils";
import { getById } from "@mzawadie/views/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_variants } from "@mzawadie/views/products/types/ProductDetails";
import { ChannelsWithVariantsData } from "@mzawadie/views/products/views/ProductUpdate/types";
import {
    areAnyChannelVariantsSelected,
    getTotalSelectedChannelsCount,
} from "@mzawadie/views/products/views/ProductUpdate/utils";
import React from "react";
import { useIntl } from "react-intl";

import ChannelWithVariantsAvailabilityItemWrapper from "./ChannelWithVariantsAvailabilityItemWrapper";

type CommonChannelsAvailabilityProps = Omit<
    ChannelsAvailabilityWrapperProps,
    "children" | "selectedChannelsCount" | "allChannelsCount" | "managePermissions"
>;

export interface ChannelsWithVariantsAvailabilityCardProps extends CommonChannelsAvailabilityProps {
    channelsWithVariantsData: ChannelsWithVariantsData;
    channels: ChannelData[];
    variants: ProductDetails_product_variants[];
    errors?: ChannelsAvailabilityError[];
    messages: Messages;
    onChange: (id: string, data: ChannelOpts) => void;
}

const ChannelsWithVariantsAvailabilityCard: React.FC<ChannelsWithVariantsAvailabilityCardProps> = ({
    channels,
    channelsWithVariantsData,
    openModal,
    variants,
    errors = [],
    messages,
    onChange,
}) => {
    const intl = useIntl();
    const localizeDate = useDateLocalize();

    const channelsMessages = getChannelsAvailabilityMessages({
        messages,
        channels,
        intl,
        localizeDate,
    });

    const allChannelsCount = channels.length;

    const selectedChannelsCount = getTotalSelectedChannelsCount(channelsWithVariantsData);

    if (!variants?.length) {
        return <CannotDefineChannelsAvailabilityCard />;
    }

    return (
        <ChannelsAvailabilityCardWrapper
            managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
            selectedChannelsCount={selectedChannelsCount}
            allChannelsCount={allChannelsCount}
            openModal={openModal}
        >
            {channels
                .filter(({ id }) => areAnyChannelVariantsSelected(channelsWithVariantsData[id]))
                .map(({ id }) => (
                    <ChannelWithVariantsAvailabilityItemWrapper
                        messages={channelsMessages[id]}
                        key={id}
                        channelsWithVariantsData={channelsWithVariantsData}
                        variants={variants}
                        channels={channels}
                        channelId={id}
                    >
                        <ChannelAvailabilityItemContent
                            onChange={onChange}
                            data={channels.find(getById(id))}
                            errors={errors}
                            messages={channelsMessages[id]}
                        />
                    </ChannelWithVariantsAvailabilityItemWrapper>
                ))}
        </ChannelsAvailabilityCardWrapper>
    );
};

export default ChannelsWithVariantsAvailabilityCard;

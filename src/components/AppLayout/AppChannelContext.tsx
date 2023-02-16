// @ts-nocheck
import { ChannelFragment } from "@mzawadie/fragments/types/ChannelFragment";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import { useUser } from "@mzawadie/pages/auth";
import { useBaseChannelsList } from "@mzawadie/pages/channels/queries";
import { BaseChannels_channels } from "@mzawadie/pages/channels/types/BaseChannels";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import { useSaleorConfig } from "@saleor/sdk";
import React from "react";

interface UseAppChannel {
    availableChannels: ChannelFragment[];
    channel: ChannelFragment;
    isPickerActive: boolean;
    refreshChannels: () => void;
    setChannel: (id: string) => void;
}

export interface AppChannelContextData extends UseAppChannel {
    setPickerActive: (isActive: boolean) => void;
}

const AppChannelContext = React.createContext<AppChannelContextData>({
    availableChannels: [],
    channel: undefined,
    isPickerActive: false,
    refreshChannels: () => undefined,
    setChannel: () => undefined,
    setPickerActive: () => undefined,
});

const isValidChannel = (channelId: string, channelList?: BaseChannels_channels[]) => {
    if (!channelId) {
        return false;
    }

    return channelList?.some(getById(channelId));
};

export const AppChannelProvider: React.FC = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { setChannel } = useSaleorConfig();

    const { authenticated } = useUser();

    const [selectedChannel, setSelectedChannel] = useLocalStorage("channel", "");

    const { data: channelData, refetch } = useBaseChannelsList({
        skip: !authenticated,
    });

    const [isPickerActive, setPickerActive] = React.useState(false);

    React.useEffect(() => {
        if (
            !isValidChannel(selectedChannel, channelData?.channels) &&
            channelData?.channels?.length > 0
        ) {
            setSelectedChannel(channelData.channels[0].id);
        }
    }, [channelData]);

    React.useEffect(() => {
        setChannel(selectedChannel);
    }, [selectedChannel]);

    const availableChannels = channelData?.channels || [];

    const channel = channelData && (availableChannels.find(getById(selectedChannel)) || null);

    return (
        <AppChannelContext.Provider
            value={{
                availableChannels,
                channel,
                isPickerActive,
                refreshChannels: refetch,
                setChannel: setSelectedChannel,
                setPickerActive,
            }}
        >
            {children}
        </AppChannelContext.Provider>
    );
};

AppChannelProvider.displayName = "AppChannelProvider";

export function useAppChannel(enablePicker = true): UseAppChannel {
    const { setPickerActive, ...data } = React.useContext(AppChannelContext);

    React.useEffect(() => {
        if (enablePicker) {
            setPickerActive(true);
        }

        return () => setPickerActive(false);
    }, [enablePicker]);

    return data;
}

export default useAppChannel;

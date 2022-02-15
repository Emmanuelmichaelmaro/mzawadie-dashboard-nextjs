// @ts-nocheck
import { ChannelFragment } from "@mzawadie/fragments/types/ChannelFragment";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import { useAuth } from "@mzawadie/views/auth/AuthProvider";
import { useBaseChannelsList } from "@mzawadie/views/channels/queries";
import { BaseChannels_channels } from "@mzawadie/views/channels/types/BaseChannels";
import { getById } from "@mzawadie/views/orders/components/OrderReturnPage/utils";
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
    const { isAuthenticated } = useAuth();

    const [selectedChannel, setSelectedChannel] = useLocalStorage("channel", "");

    const { data: channelData, refetch } = useBaseChannelsList({
        skip: !isAuthenticated,
    });

    const [isPickerActive, setPickerActive] = React.useState(false);

    React.useEffect(() => {
        if (
            !isValidChannel(selectedChannel, channelData?.channels) &&
            channelData?.channels?.length > 0
        ) {
            setSelectedChannel(channelData?.channels[0].id);
        }
    }, [channelData]);

    const availableChannels = channelData?.channels || [];

    const channel =
        channelData && (availableChannels.find((channel) => channel.id === selectedChannel) || null);

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

function useAppChannel(enablePicker = true): UseAppChannel {
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

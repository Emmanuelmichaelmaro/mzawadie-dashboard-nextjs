import { PluginConfigurationBaseFragment } from "@mzawadie/fragments/types/PluginConfigurationBaseFragment";

export const isPluginGlobal = (globalConfiguration: PluginConfigurationBaseFragment) =>
    !!globalConfiguration;

export const getConfigByChannelId =
    (channelIdToCompare: string) =>
    ({ channel }: { channel: { id: string } }) =>
        channel.id === channelIdToCompare;

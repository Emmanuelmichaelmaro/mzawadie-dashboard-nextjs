import { PluginConfigurationBaseFragment } from "@mzawadie/fragments/types/PluginConfigurationBaseFragment";

export const getAllChannelConfigsCount = (channelConfigurations: PluginConfigurationBaseFragment[]) =>
    channelConfigurations?.length;

export const getActiveChannelConfigsCount = (
    channelConfigurations: PluginConfigurationBaseFragment[]
) => channelConfigurations?.filter(({ active }) => !!active).length;

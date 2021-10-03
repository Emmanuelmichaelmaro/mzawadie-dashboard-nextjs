import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";
export interface PluginConfigurationExtendedFragment_channel {
    __typename: "Channel";
    id: string;
    name: string;
    slug: string;
}
export interface PluginConfigurationExtendedFragment_configuration {
    __typename: "ConfigurationItem";
    name: string;
    value: string | null;
    type: ConfigurationTypeFieldEnum | null;
    helpText: string | null;
    label: string | null;
}
export interface PluginConfigurationExtendedFragment {
    __typename: "PluginConfiguration";
    active: boolean;
    channel: PluginConfigurationExtendedFragment_channel | null;
    configuration: (PluginConfigurationExtendedFragment_configuration | null)[] | null;
}

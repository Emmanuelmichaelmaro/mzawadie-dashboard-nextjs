export interface PluginConfigurationBaseFragment_channel {
    __typename: "Channel";
    id: string;
    name: string;
    slug: string;
}
export interface PluginConfigurationBaseFragment {
    __typename: "PluginConfiguration";
    active: boolean;
    channel: PluginConfigurationBaseFragment_channel | null;
}

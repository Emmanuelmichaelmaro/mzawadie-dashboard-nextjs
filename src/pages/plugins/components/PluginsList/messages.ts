import { defineMessages } from "react-intl";

export const pluginAvailabilityStatusMessages = defineMessages({
    channelTitle: {
        defaultMessage:
            "{activeChannelsCount,plural, =0 {Deactivated} other {Active in {activeChannelsCount}}}",
        id: "HedXnw",
        description: "plugin channel availability status title",
    },
});

export const channelConfigPluginMessages = defineMessages({
    title: {
        defaultMessage: "Assigned to {activeChannelsCount} of {allChannelsCount} channels",
        id: "8u7els",
        description: "channel config plugin status popup title",
    },
});

export const globalConfigPluginMessages = defineMessages({
    title: {
        defaultMessage: "Global Plugin",
        description: "global config plugin status popup title",
        id: "T4wa2Y",
    },
    description: {
        defaultMessage:
            "Global plugins are set across all channels in your ecommerce. Only status is shown for those types of plugins",
        id: "reP5Uf",
        description: "global config plugin status popup description",
    },
});

export const pluginsListTableHeadMessages = defineMessages({
    nameLabel: {
        defaultMessage: "Name",
        id: "QH74y5",
        description: "table header name col label",
    },
    confLabel: {
        defaultMessage: "Configuration",
        id: "AijtXU",
        description: "table header configuration col label",
    },
    channelLabel: {
        defaultMessage: "Channel",
        id: "ycrTBX",
        description: "table header channel col label",
    },
});

export const pluginChannelConfigurationCellMessages = defineMessages({
    globalLabel: {
        defaultMessage: "Global",
        id: "xTIKA/",
        description: "PluginChannelConfigurationCell global title",
    },
    channelLabel: {
        defaultMessage: "Per channel",
        description: "PluginChannelConfigurationCell channel title",
        id: "gz9v22",
    },
});

export const pluginStatusMessages = defineMessages({
    active: {
        defaultMessage: "Active",
        id: "rQOS7K",
        description: "status label active",
    },
    deactivated: {
        defaultMessage: "Deactivated",
        id: "ho75Lr",
        description: "status label deactivated",
    },
});

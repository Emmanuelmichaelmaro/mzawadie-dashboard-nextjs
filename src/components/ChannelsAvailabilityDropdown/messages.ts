import { defineMessages } from "react-intl";

export const messages = defineMessages({
    status: {
        defaultMessage: "Status",
        id: "s2y5eG",
        description: "Status label",
    },
    channel: {
        defaultMessage: "Channel",
        id: "cFVgOo",
        description: "Channel label",
    },
    dropdownLabel: {
        defaultMessage: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
        id: "T0Mfxq",
        description: "product status title",
    },
    noChannels: {
        defaultMessage: "No channels",
        id: "JgXBAw",
        description: "dropdown label when there are no channels assigned",
    },
});

export const channelStatusMessages = defineMessages({
    unpublished: {
        defaultMessage: "Unpublished",
        id: "rHoRbE",
        description: "Status label when object is unpublished in a channel",
    },
    scheduled: {
        defaultMessage: "Scheduled to publish",
        id: "GzbSQk",
        description: "Status label when object is scheduled to publish in a channel",
    },
    published: {
        defaultMessage: "Published",
        id: "sdA14A",
        description: "Status label when object is published in a channel",
    },
});

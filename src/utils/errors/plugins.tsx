import { commonMessages } from "@mzawadie/core";
import { PluginErrorFragment, PluginErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    misconfigured: {
        defaultMessage: "Plugin is misconfigured and cannot be activated",
        id: "0AQH0Q",
    },
    unique: {
        defaultMessage: "This field needs to be unique",
        id: "lqIzC8",
    },
});

function getPluginErrorMessage(err: PluginErrorFragment, intl: IntlShape): string | undefined {
    if (err) {
        switch (err.code) {
            case PluginErrorCode.PLUGIN_MISCONFIGURED:
                return intl.formatMessage(messages.misconfigured);
            case PluginErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case PluginErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case PluginErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case PluginErrorCode.UNIQUE:
                return intl.formatMessage(messages.unique);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getPluginErrorMessage;

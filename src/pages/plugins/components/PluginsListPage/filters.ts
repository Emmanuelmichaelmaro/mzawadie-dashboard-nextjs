// @ts-nocheck
import { IFilter, IFilterElement } from "@mzawadie/components/Filter";
import { statusLabelMessages } from "@mzawadie/components/StatusLabel/messages";
import { sectionNames, AutocompleteFilterOpts, FilterOpts } from "@mzawadie/core";
import { PluginConfigurationType } from "@mzawadie/graphql";
import {
    createAutocompleteField,
    createBooleanField,
    createOptionsField,
} from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

import { pluginChannelConfigurationCellMessages } from "../PluginsList/messages";

export enum PluginFilterKeys {
    active = "active",
    channels = "channels",
    status = "status",
    type = "type",
}

export interface PluginListFilterOpts {
    isActive: FilterOpts<boolean>;
    channels: FilterOpts<string[]> & AutocompleteFilterOpts;
    type: FilterOpts<PluginConfigurationType>;
    status: FilterOpts<boolean>;
}

const messages = defineMessages({
    channelStatusSectionTitle: {
        defaultMessage: "Status in channel",
        id: "TC/EOG",
        description: "status section title",
    },
    channelStatusSectionSubtitle: {
        defaultMessage: "Channel status",
        id: "zQnYKn",
        description: "status section subtitle",
    },
    configTypeSectionTitle: {
        defaultMessage: "Configuration Type",
        id: "cwoN25",
        description: "config type section title",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: PluginListFilterOpts
): IFilter<PluginFilterKeys> {
    return [
        {
            active: opts.status.active,
            name: PluginFilterKeys.status,
            label: intl.formatMessage(messages.channelStatusSectionTitle),
            multipleFields: [
                {
                    required: true,
                    ...createBooleanField(
                        PluginFilterKeys.active,
                        intl.formatMessage(messages.channelStatusSectionSubtitle),
                        opts.isActive.value,
                        {
                            negative: intl.formatMessage(statusLabelMessages.inactive),
                            positive: intl.formatMessage(statusLabelMessages.active),
                        }
                    ),
                },
                {
                    required: true,
                    ...createAutocompleteField(
                        PluginFilterKeys.channels,
                        intl.formatMessage(sectionNames.channels),
                        opts.channels.value,
                        opts.channels.displayValues,
                        true,
                        opts.channels.choices,
                        {
                            hasMore: opts.channels.hasMore,
                            initialSearch: "",
                            loading: opts.channels.loading,
                            onFetchMore: opts.channels.onFetchMore,
                            onSearchChange: opts.channels.onSearchChange,
                        }
                    ),
                },
            ],
        } as IFilterElement<PluginFilterKeys.status>,
        {
            active: opts.type.active,
            name: PluginFilterKeys.type,
            ...createOptionsField(
                PluginFilterKeys.type,
                intl.formatMessage(messages.configTypeSectionTitle),
                [],
                false,
                [
                    {
                        value: PluginConfigurationType.GLOBAL,
                        label: intl.formatMessage(pluginChannelConfigurationCellMessages.globalLabel),
                    },
                    {
                        value: PluginConfigurationType.PER_CHANNEL,
                        label: intl.formatMessage(pluginChannelConfigurationCellMessages.channelLabel),
                    },
                ]
            ),
        },
    ];
}

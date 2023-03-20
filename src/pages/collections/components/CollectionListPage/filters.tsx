import { IFilter } from "@mzawadie/components/Filter";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { commonMessages, FilterOpts } from "@mzawadie/core";
import { CollectionPublished } from "@mzawadie/graphql";
import { createOptionsField } from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export interface CollectionListFilterOpts {
    status: FilterOpts<CollectionPublished>;
    channel: FilterOpts<string> & { choices: MultiAutocompleteChoiceType[] };
}

export enum CollectionFilterKeys {
    status = "status",
    channel = "channel",
}

const messages = defineMessages({
    hidden: {
        defaultMessage: "Hidden",
        id: "9eC0MZ",
        description: "collection",
    },
    published: {
        defaultMessage: "Published",
        id: "lL3YJO",
        description: "collection",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: CollectionListFilterOpts
): IFilter<CollectionFilterKeys> {
    return [
        {
            ...createOptionsField(
                CollectionFilterKeys.status,
                intl.formatMessage(commonMessages.status),
                [opts.status.value],
                false,
                [
                    {
                        label: intl.formatMessage(messages.published),
                        value: CollectionPublished.PUBLISHED,
                    },
                    {
                        label: intl.formatMessage(messages.hidden),
                        value: CollectionPublished.HIDDEN,
                    },
                ]
            ),
            active: opts.status.active,
            dependencies: [CollectionFilterKeys.channel],
        },
        {
            ...createOptionsField(
                CollectionFilterKeys.channel,
                intl.formatMessage(commonMessages.channel),
                [opts.channel?.value],
                false,
                opts.channel?.choices
            ),
            active: opts.channel?.active,
        },
    ];
}

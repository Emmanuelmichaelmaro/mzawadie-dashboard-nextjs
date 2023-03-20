import CardSpacer from "@mzawadie/components/CardSpacer";
import {
    MultiAutocompleteSelectField,
    MultiAutocompleteChoiceType,
} from "@mzawadie/components/MultiAutocompleteSelectField";
import { ChannelFragment } from "@mzawadie/graphql";
import { useChannelsSearch } from "@mzawadie/hooks/useChannelsSearch";
import { FormChange } from "@mzawadie/hooks/useForm";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
    subtitle: {
        defaultMessage:
            "Assign channels to this shipping zone so we know which orders will be supported",
        id: "avj76v",
        description: "ChannelsSection subtitle",
    },
    selectFieldLabel: {
        defaultMessage: "Channel",
        description: "ChannelsSection select field label",
        id: "mLZMb6",
    },
    selectFieldPlaceholder: {
        defaultMessage: "Add Channel",
        id: "cnvyqW",
        description: "ChannelsSection select field placeholder",
    },
});

interface ChannelsSectionProps {
    onChange: FormChange;
    selectedChannels: string[];
    allChannels?: ChannelFragment[];
    channelsDisplayValues: MultiAutocompleteChoiceType[];
}

const ChannelsSection: React.FC<ChannelsSectionProps> = ({
    onChange,
    allChannels = [],
    selectedChannels,
    channelsDisplayValues,
}) => {
    const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);

    const intl = useIntl();

    return (
        <>
            <FormattedMessage {...messages.subtitle} />
            <CardSpacer />
            <MultiAutocompleteSelectField
                choices={mapNodeToChoice(filteredChannels)}
                displayValues={channelsDisplayValues}
                fetchChoices={onQueryChange}
                hasMore={false}
                label={intl.formatMessage(messages.selectFieldLabel)}
                loading={false}
                name="channels"
                onChange={onChange}
                placeholder={intl.formatMessage(messages.selectFieldPlaceholder)}
                value={selectedChannels}
            />
        </>
    );
};

export default ChannelsSection;

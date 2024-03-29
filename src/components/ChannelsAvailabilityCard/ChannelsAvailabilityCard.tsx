// @ts-nocheck
import { Typography } from "@material-ui/core";
import Hr from "@mzawadie/components/Hr";
import { RequireOnlyOne } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/graphql";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { Channel as ChannelList, ChannelData } from "@mzawadie/pages/channels/utils";
import React from "react";
import { useIntl } from "react-intl";

import ChannelsAvailabilityCardWrapper, {
    ChannelsAvailabilityWrapperProps,
} from "./ChannelsAvailabilityCardWrapper";
import ChannelAvailabilityItemContent from "./channel/ChannelAvailabilityItemContent";
import ChannelAvailabilityItemWrapper from "./channel/ChannelAvailabilityItemWrapper";
import { useStyles } from "./styles";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "./types";
import { getChannelsAvailabilityMessages } from "./utils";

export interface ChannelsAvailability
    extends Omit<ChannelsAvailabilityWrapperProps, "children" | "selectedChannelsCount"> {
    channels: ChannelData[];
    /** Channels that have no settings */
    channelsList: ChannelList[];
    errors?: ChannelsAvailabilityError[];
    disabled?: boolean;
    messages?: Messages;
    managePermissions: PermissionEnum[];
    onChange?: (id: string, data: ChannelOpts) => void;
}

export type ChannelsAvailabilityCardProps = RequireOnlyOne<
    ChannelsAvailability,
    "channels" | "channelsList"
>;

export const ChannelsAvailability: React.FC<ChannelsAvailabilityCardProps> = (props) => {
    const {
        channelsList,
        errors = [],
        allChannelsCount = 0,
        channels,
        messages,
        managePermissions,
        onChange,
        openModal,
    } = props;

    const intl = useIntl();

    const localizeDate = useDateLocalize();

    const classes = useStyles({});

    const channelsMessages = getChannelsAvailabilityMessages({
        messages,
        channels,
        intl,
        localizeDate,
    });

    return (
        <ChannelsAvailabilityCardWrapper
            selectedChannelsCount={(channels ?? channelsList).length ?? 0}
            allChannelsCount={allChannelsCount}
            managePermissions={managePermissions}
            openModal={openModal}
        >
            {channels
                ? channels.map((data) => {
                      const channelErrors =
                          errors?.filter((error) => error.channels.includes(data.id)) || [];

                      return (
                          <ChannelAvailabilityItemWrapper messages={messages} data={data} key={data.id}>
                              <ChannelAvailabilityItemContent
                                  data={data}
                                  onChange={onChange}
                                  messages={channelsMessages[data?.id]}
                                  errors={channelErrors}
                              />
                          </ChannelAvailabilityItemWrapper>
                      );
                  })
                : channelsList
                ? channelsList.map((data) => (
                      <React.Fragment key={data.id}>
                          <div className={classes.channelItem}>
                              <div className={classes.channelName}>
                                  <Typography>{data.name}</Typography>
                              </div>
                          </div>
                          <Hr className={classes.hr} />
                      </React.Fragment>
                  ))
                : null}
        </ChannelsAvailabilityCardWrapper>
    );
};

export default ChannelsAvailability;

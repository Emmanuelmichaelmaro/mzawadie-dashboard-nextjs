/* eslint-disable @typescript-eslint/no-redeclare, no-redeclare */
// @ts-nocheck
import { Typography } from "@material-ui/core";
import Hr from "@mzawadie/components/Hr";
import { RequireOnlyOne } from "@mzawadie/core";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { Channel as ChannelList, ChannelData } from "@mzawadie/pages/channels/utils";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
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

export interface ChannelsAvailabilityInterface
    extends Omit<ChannelsAvailabilityWrapperProps, "children"> {
    channels: ChannelData[];
    channelsList: ChannelList[];
    errors?: ChannelsAvailabilityError[];
    disabled?: boolean;
    messages?: Messages;
    managePermissions: PermissionEnum[];
    onChange?: (id: string, data: ChannelOpts) => void;
}

export type ChannelsAvailabilityCardProps = RequireOnlyOne<
    ChannelsAvailabilityInterface,
    "channels" | "channelsList"
>;

export const ChannelsAvailability: React.FC<ChannelsAvailabilityCardProps> = (props) => {
    const {
        channelsList,
        errors = [],
        selectedChannelsCount = 0,
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
            selectedChannelsCount={selectedChannelsCount}
            allChannelsCount={allChannelsCount}
            managePermissions={managePermissions}
            openModal={openModal}
        >
            {channels
                ? channels.map((data) => {
                      const channelErrors =
                          errors?.filter((error) => error.channels.includes(data.id)) || [];

                      return (
                          // eslint-disable-next-line react/jsx-key
                          <ChannelAvailabilityItemWrapper messages={messages} data={data}>
                              <ChannelAvailabilityItemContent
                                  data={data}
                                  onChange={onChange}
                                  messages={channelsMessages[data.id]}
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

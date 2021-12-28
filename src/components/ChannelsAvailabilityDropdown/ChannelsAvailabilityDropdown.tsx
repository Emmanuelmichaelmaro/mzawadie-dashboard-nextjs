/* eslint-disable jsx-a11y/click-events-have-key-events,
jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus */
import { Menu, MenuItem, Typography } from "@material-ui/core";
import Hr from "@mzawadie/components/Hr";
import StatusLabel from "@mzawadie/components/StatusLabel";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { CollectionList_collections_edges_node_channelListings } from "@mzawadie/views/collections/types/CollectionList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

type Channels = Pick<
    CollectionList_collections_edges_node_channelListings,
    "isPublished" | "publicationDate" | "channel"
>;

export interface ChannelsAvailabilityDropdownProps {
    allChannelsCount: number;
    channels: Channels[] | null;
    showStatus?: boolean;
}

const isActive = (channelData: Channels) => channelData?.isPublished;

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
    allChannelsCount,
    channels,
    showStatus = false,
}) => {
    const intl = useIntl();
    const classes = useStyles({});
    const localizeDate = useDateLocalize();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const activeInAllChannels = React.useMemo(
        () => showStatus && channels?.every(isActive),
        [channels, showStatus]
    );

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <div
                aria-controls="availability-menu"
                aria-haspopup="true"
                role="button"
                onClick={handleClick}
            >
                <StatusLabel
                    label={intl.formatMessage(
                        {
                            defaultMessage: "{count}/{allCount} channels",
                            id: "9DnWEE",
                            description: "product status title",
                        },
                        {
                            allCount: allChannelsCount,
                            count: channels?.length,
                        }
                    )}
                    status={showStatus ? (activeInAllChannels ? "success" : "error") : undefined}
                />
            </div>
            <Menu
                id="availability-menu"
                anchorEl={anchorEl}
                keepMounted
                elevation={3}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "top",
                }}
            >
                <Typography className={classes.title}>
                    <FormattedMessage
                        defaultMessage="Available in {count} out of {allCount, plural, one {# channel} other {# channels}}"
                        id="/hs20V"
                        description="product status"
                        values={{
                            allCount: allChannelsCount,
                            count: channels?.length,
                        }}
                    />
                </Typography>
                <Hr className={classes.hr} />
                {channels?.map((channelData) => {
                    const notPublishedText = intl.formatMessage(
                        {
                            defaultMessage: "Will become available on {date}",
                            id: "pjFabA",
                            description: "product channel publication date",
                        },
                        {
                            date: localizeDate(channelData.publicationDate, "L"),
                        }
                    );

                    const publishedText = intl.formatMessage(
                        {
                            defaultMessage: "published since {date}",
                            id: "pG70pm",
                            description: "product channel  publication date",
                        },
                        {
                            date: localizeDate(channelData.publicationDate, "L"),
                        }
                    );

                    return (
                        <MenuItem key={channelData.channel.id} className={classes.menuItem}>
                            <StatusLabel
                                label={channelData.channel.name}
                                status={isActive(channelData) ? "success" : "error"}
                            />
                            <div>
                                <Typography variant="caption" className={classes.caption}>
                                    {channelData.isPublished && channelData.publicationDate
                                        ? publishedText
                                        : channelData.publicationDate && !channelData.isPublished
                                        ? notPublishedText
                                        : channelData.isPublished
                                        ? ""
                                        : intl.formatMessage({
                                              defaultMessage: "hidden",
                                              id: "qgYKM/",
                                              description: "product channel publication status",
                                          })}
                                </Typography>
                            </div>
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";

export default ChannelsAvailabilityDropdown;

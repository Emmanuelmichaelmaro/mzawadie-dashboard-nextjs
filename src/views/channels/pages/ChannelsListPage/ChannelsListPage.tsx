// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card, IconButton, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@mzawadie/components/Container";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import PageHeader from "@mzawadie/components/PageHeader";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import Skeleton from "@mzawadie/components/Skeleton";
import TableCellHeader from "@mzawadie/components/TableCellHeader";
import { renderCollection, sectionNames, stopPropagation } from "@mzawadie/core";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Channels_channels } from "../../types/Channels";
import { useStyles } from "./styles";

export interface ChannelsListPageProps {
    channelsList: Channels_channels[] | undefined;
    limits: RefreshLimits_shop_limits;
    navigateToChannelCreate: () => void;
    onBack: () => void;
    onRowClick: (id: string) => () => void;
    onRemove: (id: string) => void;
}

const numberOfColumns = 2;

export const ChannelsListPage: React.FC<ChannelsListPageProps> = ({
    channelsList,
    limits,
    navigateToChannelCreate,
    onBack,
    onRemove,
    onRowClick,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    const limitReached = isLimitReached(limits, "channels");

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader
                title={intl.formatMessage(sectionNames.channels)}
                limitText={
                    hasLimits(limits, "channels") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} channels used",
                            id: "rZMT44",
                            description: "created channels counter",
                        },
                        {
                            count: limits.currentUsage.channels,
                            max: limits.allowedUsage.channels,
                        }
                    )
                }
            >
                <Button
                    disabled={limitReached}
                    onClick={navigateToChannelCreate}
                    color="primary"
                    variant="contained"
                    data-test="add-channel"
                >
                    <FormattedMessage
                        defaultMessage="Create Channel"
                        id="OGm8wO"
                        description="button"
                    />
                </Button>
            </PageHeader>
            {limitReached && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        defaultMessage: "Channel limit reached",
                        id: "PTW56s",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You have reached your channel limit, you will be no longer able to add channels to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="ZMy18J"
                    />
                </LimitReachedAlert>
            )}
            <Card>
                <ResponsiveTable>
                    <TableHead>
                        <TableRow>
                            <TableCellHeader>
                                <FormattedMessage
                                    defaultMessage="Channel Name"
                                    id="j/vV0n"
                                    description="channel name"
                                />
                            </TableCellHeader>
                            <TableCell className={classes.colRight}>
                                <FormattedMessage
                                    defaultMessage="Actions"
                                    id="VHuzgq"
                                    description="table actions"
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderCollection(
                            channelsList,
                            (channel) => (
                                <TableRow
                                    hover={!!channel}
                                    key={channel ? channel.id : "skeleton"}
                                    className={classes.tableRow}
                                    onClick={channel ? onRowClick(channel.id) : undefined}
                                >
                                    <TableCell className={classes.colName}>
                                        <span data-test="name">{channel?.name || <Skeleton />}</span>
                                    </TableCell>
                                    <TableCell className={classes.colAction}>
                                        {channelsList?.length > 1 && (
                                            <IconButton
                                                color="primary"
                                                onClick={
                                                    channel
                                                        ? stopPropagation(() => onRemove(channel.id))
                                                        : undefined
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ),
                            () => (
                                <TableRow>
                                    <TableCell colSpan={numberOfColumns}>
                                        <FormattedMessage
                                            defaultMessage="No channels found"
                                            id="/glQgs"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </ResponsiveTable>
            </Card>
        </Container>
    );
};

ChannelsListPage.displayName = "ChannelsListPage";
export default ChannelsListPage;

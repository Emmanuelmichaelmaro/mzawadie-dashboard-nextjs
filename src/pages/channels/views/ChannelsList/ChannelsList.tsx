// @ts-nocheck
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { ChannelDeleteMutation, useChannelDeleteMutation, useChannelsQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import {
    channelAddUrl,
    channelsListUrl,
    ChannelsListUrlDialog,
    ChannelsListUrlQueryParams,
    channelUrl,
} from "@mzawadie/pages/channels/urls";
import { getChannelsCurrencyChoices } from "@mzawadie/pages/channels/utils";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import getChannelsErrorMessage from "@mzawadie/utils/errors/channels";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelDeleteDialog } from "../../components/ChannelDeleteDialog";
import { ChannelsListPage } from "../../components/ChannelsListPage";

interface ChannelsListProps {
    params: ChannelsListUrlQueryParams;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data, refetch } = useChannelsQuery({ displayLoader: true });

    const limitOpts = useShopLimitsQuery({
        variables: {
            channels: true,
        },
    });

    const selectedChannel = data?.channels?.find((channel) => channel.id === params?.id);

    const [openModal, closeModal] = createDialogActionHandlers<
        ChannelsListUrlDialog,
        ChannelsListUrlQueryParams
    >(navigate, channelsListUrl, params);

    const onCompleted = (data: ChannelDeleteMutation) => {
        const { errors } = data.channelDelete;

        if (errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Channel deleted",
                    id: "AkyGP2",
                }),
            });
            refetch();
            limitOpts.refetch();
            closeModal();
        } else {
            errors.map((error) =>
                notify({
                    status: "error",
                    text: getChannelsErrorMessage(error, intl),
                })
            );
        }
    };

    const [deleteChannel, deleteChannelOpts] = useChannelDeleteMutation({
        onCompleted,
    });

    const channelsChoices = getChannelsCurrencyChoices(params.id, selectedChannel, data?.channels);

    const navigateToChannelCreate = () => navigate(channelAddUrl);

    const handleRemoveConfirm = (channelId?: string) => {
        const inputVariables = channelId ? { input: { channelId } } : {};

        deleteChannel({
            variables: {
                id: params.id,
                ...inputVariables,
            },
        });
    };

    return (
        <>
            <ChannelsListPage
                channelsList={data?.channels}
                limits={limitOpts.data?.shop.limits}
                navigateToChannelCreate={navigateToChannelCreate}
                onBack={() => navigate(configurationMenuUrl)}
                onRowClick={(id) => () => navigate(channelUrl(id))}
                onRemove={(id) =>
                    openModal("remove", {
                        id,
                    })
                }
            />

            {!!selectedChannel && (
                <ChannelDeleteDialog
                    channelsChoices={channelsChoices}
                    hasOrders={selectedChannel.hasOrders}
                    open={params.action === "remove"}
                    confirmButtonState={deleteChannelOpts.status}
                    onBack={() => navigate(channelsListUrl())}
                    onClose={closeModal}
                    onConfirm={handleRemoveConfirm}
                />
            )}
        </>
    );
};

ChannelsList.displayName = "ChannelsList";

export default ChannelsList;

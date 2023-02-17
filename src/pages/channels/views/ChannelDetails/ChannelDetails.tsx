// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, sectionNames } from "@mzawadie/core";
import { ChannelErrorFragment } from "@mzawadie/fragments/types/ChannelErrorFragment";
import { getSearchFetchMoreProps } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@mzawadie/hooks/useNotifier/utils";
import { FormData } from "@mzawadie/pages/channels/components/ChannelForm/ChannelForm";
import { ChannelDelete } from "@mzawadie/pages/channels/types/ChannelDelete";
import { getChannelsCurrencyChoices } from "@mzawadie/pages/channels/utils";
import { useChannelShippingZones } from "@mzawadie/pages/shipping/queries";
import useShippingZonesSearch from "@mzawadie/searches/useShippingZonesSearch";
import getChannelsErrorMessage from "@mzawadie/utils/errors/channels";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelDeleteDialog } from "../../components/ChannelDeleteDialog";
import { ChannelDetailsPage } from "../../components/ChannelDetailsPage";
import {
    useChannelActivateMutation,
    useChannelDeactivateMutation,
    useChannelDeleteMutation,
    useChannelUpdateMutation,
} from "../../mutations";
import { useChannelDetails, useChannelsList } from "../../queries";
import { ChannelUpdate } from "../../types/ChannelUpdate";
import { channelsListUrl, channelUrl, ChannelUrlDialog, ChannelUrlQueryParams } from "../../urls";

interface ChannelDetailsProps {
    id: string;
    params: ChannelUrlQueryParams;
}

export const ChannelDetails: React.FC<ChannelDetailsProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    const handleBack = () => navigate(channelsListUrl());

    const channelsListData = useChannelsList({ displayLoader: true });

    const [openModal, closeModal] = createDialogActionHandlers<ChannelUrlDialog, ChannelUrlQueryParams>(
        navigate,
        (params) => channelUrl(id, params),
        params
    );

    const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
        onCompleted: ({ channelUpdate: { errors } }: ChannelUpdate) =>
            notify(getDefaultNotifierSuccessErrorData(errors, intl)),
    });

    const { data, loading } = useChannelDetails({
        displayLoader: true,
        variables: { id },
    });

    const handleError = (error: ChannelErrorFragment) => {
        notify({
            status: "error",
            text: getChannelsErrorMessage(error, intl),
        });
    };

    const [activateChannel, activateChannelOpts] = useChannelActivateMutation({
        onCompleted: (data) => {
            const { errors } = data.channelActivate;
            if (errors.length) {
                errors.forEach((error) => handleError(error));
            }
        },
    });

    const [deactivateChannel, deactivateChannelOpts] = useChannelDeactivateMutation({
        onCompleted: (data) => {
            const { errors } = data.channelDeactivate;
            if (errors.length) {
                errors.forEach((error) => handleError(error));
            }
        },
    });

    const handleSubmit = ({
        name,
        slug,
        shippingZonesIdsToRemove,
        shippingZonesIdsToAdd,
        defaultCountry,
    }: FormData) =>
        extractMutationErrors(
            updateChannel({
                variables: {
                    id: data?.channel.id,
                    input: {
                        name,
                        slug,
                        defaultCountry,
                        addShippingZones: shippingZonesIdsToAdd,
                        removeShippingZones: shippingZonesIdsToRemove,
                    },
                },
            })
        );

    const onDeleteCompleted = (data: ChannelDelete) => {
        const { errors } = data.channelDelete;

        if (errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Channel deleted",
                    id: "AkyGP2",
                }),
            });
            closeModal();
            navigate(channelsListUrl());
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
        onCompleted: onDeleteCompleted,
    });

    const channelsChoices = getChannelsCurrencyChoices(
        id,
        data?.channel,
        channelsListData?.data?.channels
    );

    const handleRemoveConfirm = (channelId?: string) => {
        const data = channelId ? { id, input: { channelId } } : { id };
        deleteChannel({ variables: data });
    };

    const { data: channelShippingZonesData, loading: channelsShippingZonesLoading } =
        useChannelShippingZones({
            variables: {
                filter: {
                    channels: [id],
                },
            },
        });

    const {
        loadMore: fetchMoreShippingZones,
        search: searchShippingZones,
        result: searchShippingZonesResult,
    } = useShippingZonesSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Channel details",
                    id: "D9Rg+F",
                    description: "window title",
                })}
            />

            <Container>
                <Backlink onClick={handleBack}>{intl.formatMessage(sectionNames.channels)}</Backlink>
                <PageHeader title={data?.channel?.name} />
                <ChannelDetailsPage
                    channelShippingZones={channelShippingZonesData?.shippingZones?.edges?.map(
                        ({ node }) => node
                    )}
                    searchShippingZones={searchShippingZones}
                    searchShippingZonesData={searchShippingZonesResult.data}
                    fetchMoreShippingZones={getSearchFetchMoreProps(
                        searchShippingZonesResult,
                        fetchMoreShippingZones
                    )}
                    channel={data?.channel}
                    disabled={updateChannelOpts.loading || loading || channelsShippingZonesLoading}
                    disabledStatus={activateChannelOpts.loading || deactivateChannelOpts.loading}
                    errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
                    onBack={handleBack}
                    onDelete={() => openModal("remove")}
                    onSubmit={handleSubmit}
                    updateChannelStatus={() =>
                        data?.channel?.isActive
                            ? deactivateChannel({ variables: { id } })
                            : activateChannel({ variables: { id } })
                    }
                    saveButtonBarState={updateChannelOpts.status}
                    countries={shop?.countries || []}
                />
            </Container>

            <ChannelDeleteDialog
                channelsChoices={channelsChoices}
                hasOrders={data?.channel?.hasOrders}
                open={params.action === "remove"}
                confirmButtonState={deleteChannelOpts.status}
                onBack={() => navigate(channelsListUrl())}
                onClose={closeModal}
                onConfirm={handleRemoveConfirm}
            />
        </>
    );
};

export default ChannelDetails;

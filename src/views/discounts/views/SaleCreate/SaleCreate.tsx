// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { ChannelsAction } from "@mzawadie/views/channels/urls";
import { ChannelSaleData, createSortedSaleData } from "@mzawadie/views/channels/utils";
import SaleCreatePage from "@mzawadie/views/discounts/components/SaleCreatePage";
import { TypedSaleCreate, useSaleChannelListingUpdate } from "@mzawadie/views/discounts/mutations";
import { SaleCreate } from "@mzawadie/views/discounts/types/SaleCreate";
import {
    saleAddUrl,
    SaleCreateUrlQueryParams,
    saleListUrl,
    saleUrl,
} from "@mzawadie/views/discounts/urls";
import React from "react";
import { useIntl } from "react-intl";

import { createHandler } from "./handlers";

interface SaleCreateProps {
    params: SaleCreateUrlQueryParams;
}

export const SaleCreateView: React.FC<SaleCreateProps> = ({ params }) => {
    const navigate = useNavigator();
    const pushMessage = useNotifier();
    const intl = useIntl();

    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const [openModal, closeModal] = createDialogActionHandlers<
        ChannelsAction,
        SaleCreateUrlQueryParams
    >(navigate, (params) => saleAddUrl(params), params);

    const { availableChannels } = useAppChannel(false);
    const allChannels: ChannelSaleData[] = createSortedSaleData(availableChannels);

    const {
        channelListElements,
        channelsToggle,
        currentChannels,
        handleChannelsConfirm,
        handleChannelsModalClose,
        handleChannelsModalOpen,
        isChannelSelected,
        isChannelsModalOpen,
        setCurrentChannels,
        toggleAllChannels,
    } = useChannels(allChannels, params?.action, { closeModal, openModal });

    const [updateChannels, updateChannelsOpts] = useSaleChannelListingUpdate({});

    const handleSaleCreate = (data: SaleCreate) => {
        if (data.saleCreate.errors.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Successfully created sale",
                    id: "n7Fg8i",
                }),
            });
            navigate(saleUrl(data.saleCreate.sale.id), true);
        }
    };

    return (
        <>
            {!!allChannels?.length && (
                <ChannelsAvailabilityDialog
                    isSelected={isChannelSelected}
                    disabled={!channelListElements.length}
                    channels={allChannels}
                    onChange={channelsToggle}
                    onClose={handleChannelsModalClose}
                    open={isChannelsModalOpen}
                    title={intl.formatMessage({
                        defaultMessage: "Manage Sales Channel Availability",
                        id: "ESDTC/",
                    })}
                    confirmButtonState="default"
                    selected={channelListElements.length}
                    onConfirm={handleChannelsConfirm}
                    toggleAll={toggleAllChannels}
                />
            )}
            <TypedSaleCreate onCompleted={handleSaleCreate}>
                {(saleCreate, saleCreateOpts) => {
                    const handleCreate = createHandler(
                        (variables) => saleCreate({ variables }),
                        updateChannels
                    );
                    const handleSubmit = createMetadataCreateHandler(
                        handleCreate,
                        updateMetadata,
                        updatePrivateMetadata
                    );

                    return (
                        <>
                            <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
                            <SaleCreatePage
                                allChannelsCount={allChannels?.length}
                                channelListings={currentChannels}
                                disabled={saleCreateOpts.loading || updateChannelsOpts.loading}
                                errors={[
                                    ...(saleCreateOpts.data?.saleCreate.errors || []),
                                    ...(updateChannelsOpts.data?.saleChannelListingUpdate.errors || []),
                                ]}
                                onBack={() => navigate(saleListUrl())}
                                onSubmit={handleSubmit}
                                saveButtonBarState={saleCreateOpts.status}
                                openChannelsModal={handleChannelsModalOpen}
                                onChannelsChange={setCurrentChannels}
                            />
                        </>
                    );
                }}
            </TypedSaleCreate>
        </>
    );
};
export default SaleCreateView;

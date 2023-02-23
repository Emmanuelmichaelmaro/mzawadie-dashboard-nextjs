// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { ChannelsAvailabilityDialog } from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { ChannelsAction } from "@mzawadie/pages/channels/urls";
import { ChannelVoucherData, createSortedVoucherData } from "@mzawadie/pages/channels/utils";
import { VoucherCreatePage } from "@mzawadie/pages/discounts/components/VoucherCreatePage";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { TypedVoucherCreate, useVoucherChannelListingUpdate } from "../../mutations";
import { VoucherCreate } from "../../types/VoucherCreate";
import { voucherAddUrl, VoucherCreateUrlQueryParams, voucherListUrl, voucherUrl } from "../../urls";
import { createHandler } from "./handlers";
import { VOUCHER_CREATE_FORM_ID } from "./types";

interface VoucherCreateProps {
    params: VoucherCreateUrlQueryParams;
}

export const VoucherCreateView: React.FC<VoucherCreateProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const [openModal, closeModal] = createDialogActionHandlers<
        ChannelsAction,
        VoucherCreateUrlQueryParams
    >(navigate, (params) => voucherAddUrl(params), params);

    const { availableChannels } = useAppChannel(false);
    const allChannels: ChannelVoucherData[] = createSortedVoucherData(availableChannels);

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
    } = useChannels(
        allChannels,
        params?.action,
        { closeModal, openModal },
        { formId: VOUCHER_CREATE_FORM_ID }
    );

    const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdate({});

    const handleVoucherCreate = (data: VoucherCreate) => {
        if (data.voucherCreate.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Successfully created voucher",
                    id: "Q8mpW3",
                }),
            });
            navigate(voucherUrl(data.voucherCreate.voucher.id), { replace: true });
        }
    };

    return (
        <TypedVoucherCreate onCompleted={handleVoucherCreate}>
            {(voucherCreate, voucherCreateOpts) => {
                const handleCreate = createHandler(
                    (variables) => voucherCreate({ variables }),
                    updateChannels
                );
                const handleSubmit = createMetadataCreateHandler(
                    handleCreate,
                    updateMetadata,
                    updatePrivateMetadata
                );

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
                                    defaultMessage: "Manage Products Channel Availability",
                                    id: "Eau5AV",
                                })}
                                confirmButtonState="default"
                                selected={channelListElements.length}
                                onConfirm={handleChannelsConfirm}
                                toggleAll={toggleAllChannels}
                            />
                        )}
                        <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
                        <VoucherCreatePage
                            allChannelsCount={allChannels?.length}
                            channelListings={currentChannels}
                            hasChannelChanged={allChannels?.length !== currentChannels?.length}
                            disabled={voucherCreateOpts.loading || updateChannelsOpts.loading}
                            errors={[
                                ...(voucherCreateOpts.data?.voucherCreate.errors || []),
                                ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors || []),
                            ]}
                            onBack={() => navigate(voucherListUrl())}
                            onSubmit={handleSubmit}
                            saveButtonBarState={voucherCreateOpts.status}
                            openChannelsModal={handleChannelsModalOpen}
                            onChannelsChange={setCurrentChannels}
                        />
                    </>
                );
            }}
        </TypedVoucherCreate>
    );
};

export default VoucherCreateView;

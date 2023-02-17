// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { Channel } from "@mzawadie/pages/channels/utils";
import React from "react";

import {ChannelsAvailabilityDialogChannelsList} from "../ChannelsAvailabilityDialogChannelsList";
import {ChannelsAvailabilityDialogWrapper} from "../ChannelsAvailabilityDialogContentWrapper";
import { useChannelsSearch } from "./utils";

export interface ChannelsAvailabilityDialogProps {
    isSelected: (option: Channel) => boolean;
    channels: Channel[];
    confirmButtonState: ConfirmButtonTransitionState;
    contentType?: string;
    disabled?: boolean;
    open: boolean;
    onClose: () => void;
    onChange: (option: Channel) => void;
    onConfirm: () => void;
    selected?: number;
    title: string;
    toggleAll?: (items: Channel[], selected: number) => void;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
    isSelected,
    channels,
    confirmButtonState,
    contentType,
    disabled,
    open,
    onClose,
    onChange,
    onConfirm,
    selected,
    title,
    toggleAll,
}) => {
    const { query, onQueryChange, filteredChannels } = useChannelsSearch(channels);

    const handleToggleAll = () => toggleAll(channels, selected);

    const hasAllSelected = selected === channels.length;

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            disabled={disabled}
        >
            <ChannelsAvailabilityDialogWrapper
                hasAnyChannelsToDisplay={!!filteredChannels.length}
                hasAllSelected={hasAllSelected}
                query={query}
                onQueryChange={onQueryChange}
                toggleAll={handleToggleAll}
                contentType={contentType}
            >
                <ChannelsAvailabilityDialogChannelsList
                    channels={filteredChannels}
                    isChannelSelected={isSelected}
                    onChange={onChange}
                />
            </ChannelsAvailabilityDialogWrapper>
        </ActionDialog>
    );
};

export default ChannelsAvailabilityDialog;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import ChannelsAvailabilityDialog from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames, MinMax } from "@mzawadie/core";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeEnum } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import { createSortedShippingChannels } from "@mzawadie/views/channels/utils";
import ShippingZonePostalCodeRangeDialog from "@mzawadie/views/shipping/components/ShippingZonePostalCodeRangeDialog";
import ShippingZoneRatesCreatePage from "@mzawadie/views/shipping/components/ShippingZoneRatesCreatePage";
import { useShippingRateCreator } from "@mzawadie/views/shipping/handlers";
import { useShippingZoneChannels } from "@mzawadie/views/shipping/queries";
import {
    shippingPriceRatesUrl,
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams,
    shippingZoneUrl,
} from "@mzawadie/views/shipping/urls";
import postalCodesReducer from "@mzawadie/views/shipping/views/reducer";
import {
    filterPostalCodes,
    getPostalCodeRuleByMinMax,
    getRuleObject,
} from "@mzawadie/views/shipping/views/utils";
import React from "react";
import { useIntl } from "react-intl";

export interface PriceRatesCreateProps {
    id: string;
    params: ShippingRateCreateUrlQueryParams;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const intl = useIntl();

    const [openModal, closeModal] = createDialogActionHandlers<
        ShippingRateCreateUrlDialog,
        ShippingRateCreateUrlQueryParams
    >(navigate, (params) => shippingPriceRatesUrl(id, params), params);

    const { data: shippingZoneData, loading: channelsLoading } = useShippingZoneChannels({
        displayLoader: true,
        variables: { id },
    });

    const allChannels = createSortedShippingChannels(shippingZoneData?.shippingZone?.channels);

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

    const [state, dispatch] = React.useReducer(postalCodesReducer, {
        codesToDelete: [],
        havePostalCodesChanged: false,
        inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
        originalCodes: [],
        postalCodeRules: [],
    });

    const { channelErrors, createShippingRate, errors, status } = useShippingRateCreator(
        id,
        ShippingMethodTypeEnum.PRICE,
        state.postalCodeRules,
        state.inclusionType
    );

    const handleBack = () => navigate(shippingZoneUrl(id));

    const onPostalCodeAssign = (rule: MinMax) => {
        if (state.postalCodeRules.filter(getPostalCodeRuleByMinMax(rule)).length > 0) {
            closeModal();
            return;
        }

        const newCode = getRuleObject(rule, state.inclusionType);
        dispatch({
            havePostalCodesChanged: true,
            postalCodeRules: [...state.postalCodeRules, newCode],
        });
        closeModal();
    };

    const onPostalCodeInclusionChange = (inclusion: PostalCodeRuleInclusionTypeEnum) => {
        dispatch({
            inclusionType: inclusion,
            postalCodeRules: [],
        });
    };

    const onPostalCodeUnassign = (code) => {
        dispatch({
            havePostalCodesChanged: true,
            postalCodeRules: filterPostalCodes(state.postalCodeRules, code),
        });
    };

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
            {!!allChannels?.length && (
                <ChannelsAvailabilityDialog
                    isSelected={isChannelSelected}
                    disabled={!channelListElements.length}
                    channels={allChannels}
                    onChange={channelsToggle}
                    onClose={handleChannelsModalClose}
                    open={isChannelsModalOpen}
                    title={intl.formatMessage({
                        defaultMessage: "Manage Channel Availability",
                        id: "EM730i",
                    })}
                    confirmButtonState="default"
                    selected={channelListElements.length}
                    onConfirm={handleChannelsConfirm}
                    toggleAll={toggleAllChannels}
                />
            )}

            <ShippingZoneRatesCreatePage
                allChannelsCount={allChannels?.length}
                shippingChannels={currentChannels}
                disabled={channelsLoading || status === "loading"}
                saveButtonBarState={status}
                onSubmit={createShippingRate}
                onBack={handleBack}
                errors={errors}
                channelErrors={channelErrors}
                postalCodes={state.postalCodeRules}
                openChannelsModal={handleChannelsModalOpen}
                onChannelsChange={setCurrentChannels}
                onPostalCodeAssign={() => openModal("add-range")}
                onPostalCodeUnassign={onPostalCodeUnassign}
                onPostalCodeInclusionChange={onPostalCodeInclusionChange}
                variant={ShippingMethodTypeEnum.PRICE}
            />
            <ShippingZonePostalCodeRangeDialog
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={onPostalCodeAssign}
                open={params.action === "add-range"}
            />
        </>
    );
};

export default PriceRatesCreate;

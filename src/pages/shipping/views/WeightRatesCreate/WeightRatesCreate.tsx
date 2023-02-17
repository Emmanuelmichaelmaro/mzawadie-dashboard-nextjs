// @ts-nocheck
import { ChannelsAvailabilityDialog } from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames, MinMax } from "@mzawadie/core";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { createShippingChannels, createSortedShippingChannels } from "@mzawadie/pages/channels/utils";
import { ShippingZonePostalCodeRangeDialog } from "@mzawadie/pages/shipping/components/ShippingZonePostalCodeRangeDialog";
import { ShippingZoneRatesCreatePage } from "@mzawadie/pages/shipping/components/ShippingZoneRatesCreatePage";
import { useShippingRateCreator } from "@mzawadie/pages/shipping/handlers";
import { useShippingZoneChannels } from "@mzawadie/pages/shipping/queries";
import {
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams,
    shippingWeightRatesUrl,
    shippingZoneUrl,
} from "@mzawadie/pages/shipping/urls";
import postalCodesReducer from "@mzawadie/pages/shipping/views/reducer";
import {
    filterPostalCodes,
    getPostalCodeRuleByMinMax,
    getRuleObject,
} from "@mzawadie/pages/shipping/views/utils";
import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeEnum } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { WEIGHT_RATES_CREATE_FORM_ID } from "./consts";

export interface WeightRatesCreateProps {
    id: string;
    params: ShippingRateCreateUrlQueryParams;
}

export const WeightRatesCreate: React.FC<WeightRatesCreateProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const intl = useIntl();

    const { data: shippingZoneData, loading: channelsLoading } = useShippingZoneChannels({
        displayLoader: true,
        variables: { id },
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        ShippingRateCreateUrlDialog,
        ShippingRateCreateUrlQueryParams
    >(navigate, (params) => shippingWeightRatesUrl(id, params), params);

    const shippingChannels = createShippingChannels(shippingZoneData?.shippingZone?.channels);
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
    } = useChannels(
        shippingChannels,
        params?.action,
        { closeModal, openModal },
        { formId: WEIGHT_RATES_CREATE_FORM_ID }
    );

    const [state, dispatch] = React.useReducer(postalCodesReducer, {
        codesToDelete: [],
        havePostalCodesChanged: false,
        inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
        originalCodes: [],
        postalCodeRules: [],
    });

    const { channelErrors, createShippingRate, errors, status } = useShippingRateCreator(
        id,
        ShippingMethodTypeEnum.WEIGHT,
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
                    channels={allChannels}
                    onChange={channelsToggle}
                    onClose={handleChannelsModalClose}
                    open={isChannelsModalOpen}
                    title={intl.formatMessage({
                        defaultMessage: "Manage Channels Availability",
                        id: "eR3vfw",
                    })}
                    confirmButtonState="default"
                    selected={channelListElements.length}
                    onConfirm={handleChannelsConfirm}
                    toggleAll={toggleAllChannels}
                />
            )}
            <ShippingZoneRatesCreatePage
                formId={WEIGHT_RATES_CREATE_FORM_ID}
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
                variant={ShippingMethodTypeEnum.WEIGHT}
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

export default WeightRatesCreate;

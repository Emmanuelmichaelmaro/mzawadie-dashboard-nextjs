// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import CardSpacer from "@mzawadie/components/CardSpacer";
import ChannelsAvailabilityCard from "@mzawadie/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ShippingChannelsErrorFragment } from "@mzawadie/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { ShippingMethodFragment_postalCodeRules } from "@mzawadie/fragments/types/ShippingMethodFragment";
import {
    PermissionEnum,
    PostalCodeRuleInclusionTypeEnum,
    ShippingMethodTypeEnum,
} from "@mzawadie/types/globalTypes";
import { ChannelShippingData } from "@mzawadie/views/channels/utils";
import { validatePrice } from "@mzawadie/views/products/utils/validation";
import OrderValue from "@mzawadie/views/shipping/components/OrderValue";
import OrderWeight from "@mzawadie/views/shipping/components/OrderWeight";
import PricingCard from "@mzawadie/views/shipping/components/PricingCard";
import ShippingRateInfo from "@mzawadie/views/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@mzawadie/views/shipping/handlers";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";

export interface FormData {
    channelListings: ChannelShippingData[];
    name: string;
    description: OutputData;
    noLimits: boolean;
    minValue: string;
    maxValue: string;
    minDays: string;
    maxDays: string;
    type: ShippingMethodTypeEnum;
}

export interface ShippingZoneRatesCreatePageProps {
    allChannelsCount?: number;
    shippingChannels: ChannelShippingData[];
    disabled: boolean;
    hasChannelChanged?: boolean;
    postalCodes?: ShippingMethodFragment_postalCodeRules[];
    channelErrors: ShippingChannelsErrorFragment[];
    errors: ShippingErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onDelete?: () => void;
    onSubmit: (data: FormData) => void;
    onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
    onPostalCodeAssign: () => void;
    onPostalCodeUnassign: (code: any) => void;
    onChannelsChange: (data: ChannelShippingData[]) => void;
    openChannelsModal: () => void;
    variant: ShippingMethodTypeEnum;
}

export const ShippingZoneRatesCreatePage: React.FC<ShippingZoneRatesCreatePageProps> = ({
    allChannelsCount,
    shippingChannels,
    channelErrors,
    disabled,
    errors,
    hasChannelChanged,
    onBack,
    onDelete,
    onSubmit,
    onPostalCodeInclusionChange,
    onChannelsChange,
    onPostalCodeAssign,
    onPostalCodeUnassign,
    openChannelsModal,
    saveButtonBarState,
    variant,
    postalCodes,
}) => {
    const intl = useIntl();
    const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
    const initialForm: FormData = {
        channelListings: shippingChannels,
        maxDays: "",
        maxValue: "",
        minDays: "",
        minValue: "",
        name: "",
        description: null,
        noLimits: false,
        type: null,
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, triggerChange, set }) => {
                const handleChannelsChange = createChannelsChangeHandler(
                    shippingChannels,
                    onChannelsChange,
                    triggerChange
                );
                const formDisabled = data.channelListings?.some((channel) =>
                    validatePrice(channel.price)
                );
                const onDescriptionChange = (description: OutputData) => {
                    set({ description });
                    triggerChange();
                };

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            <FormattedMessage defaultMessage="Shipping" id="PRlD0A" />
                        </Backlink>
                        <PageHeader
                            title={
                                isPriceVariant
                                    ? intl.formatMessage({
                                          defaultMessage: "Price Rate Create",
                                          id: "RXPGi/",
                                          description: "page title",
                                      })
                                    : intl.formatMessage({
                                          defaultMessage: "Weight Rate Create",
                                          id: "NDm2Fe",
                                          description: "page title",
                                      })
                            }
                        />
                        <Grid>
                            <div>
                                <ShippingRateInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                    onDescriptionChange={onDescriptionChange}
                                />
                                <CardSpacer />
                                {isPriceVariant ? (
                                    <OrderValue
                                        channels={data.channelListings}
                                        errors={channelErrors}
                                        noLimits={data.noLimits}
                                        disabled={disabled}
                                        onChange={change}
                                        onChannelsChange={handleChannelsChange}
                                    />
                                ) : (
                                    <OrderWeight
                                        noLimits={data.noLimits}
                                        disabled={disabled}
                                        minValue={data.minValue}
                                        maxValue={data.maxValue}
                                        onChange={change}
                                        errors={errors}
                                    />
                                )}
                                <CardSpacer />
                                <PricingCard
                                    channels={data.channelListings}
                                    onChange={handleChannelsChange}
                                    disabled={disabled}
                                    errors={channelErrors}
                                />
                                <CardSpacer />
                                <ShippingZonePostalCodes
                                    disabled={disabled}
                                    onPostalCodeDelete={onPostalCodeUnassign}
                                    onPostalCodeInclusionChange={onPostalCodeInclusionChange}
                                    onPostalCodeRangeAdd={onPostalCodeAssign}
                                    postalCodes={postalCodes}
                                />
                            </div>
                            <div>
                                <ChannelsAvailabilityCard
                                    managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
                                    allChannelsCount={allChannelsCount}
                                    selectedChannelsCount={shippingChannels?.length}
                                    channelsList={data.channelListings}
                                    openModal={openChannelsModal}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || formDisabled || (!hasChanged && !hasChannelChanged)}
                            onCancel={onBack}
                            onDelete={onDelete}
                            onSubmit={submit}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

export default ShippingZoneRatesCreatePage;

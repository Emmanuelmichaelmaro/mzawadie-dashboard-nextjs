// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import CardSpacer from "@mzawadie/components/CardSpacer";
import ChannelsAvailabilityCard from "@mzawadie/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { MetadataFormData } from "@mzawadie/components/Metadata/types";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ListActions, ListProps } from "@mzawadie/core";
import { ShippingChannelsErrorFragment } from "@mzawadie/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { ShippingMethodFragment_postalCodeRules } from "@mzawadie/fragments/types/ShippingMethodFragment";
import {
    PermissionEnum,
    PostalCodeRuleInclusionTypeEnum,
    ShippingMethodTypeEnum,
} from "@mzawadie/types/globalTypes";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ChannelShippingData } from "@mzawadie/views/channels/utils";
import { validatePrice } from "@mzawadie/views/products/utils/validation";
import OrderValue from "@mzawadie/views/shipping/components/OrderValue";
import OrderWeight from "@mzawadie/views/shipping/components/OrderWeight";
import PricingCard from "@mzawadie/views/shipping/components/PricingCard";
import ShippingMethodProducts from "@mzawadie/views/shipping/components/ShippingMethodProducts";
import ShippingRateInfo from "@mzawadie/views/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@mzawadie/views/shipping/handlers";
import {
    ShippingZone_shippingZone_shippingMethods,
    ShippingZone_shippingZone_shippingMethods_postalCodeRules,
} from "@mzawadie/views/shipping/types/ShippingZone";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";

export interface FormData extends MetadataFormData {
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

export interface ShippingZoneRatesPageProps
    extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
        ListActions {
    allChannelsCount?: number;
    shippingChannels: ChannelShippingData[];
    disabled: boolean;
    hasChannelChanged?: boolean;
    havePostalCodesChanged?: boolean;
    rate: ShippingZone_shippingZone_shippingMethods;
    channelErrors: ShippingChannelsErrorFragment[];
    errors: ShippingErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    postalCodeRules: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
    onBack: () => void;
    onDelete?: () => void;
    onSubmit: (data: FormData) => void;
    onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
    onPostalCodeAssign: () => void;
    onPostalCodeUnassign: (code: ShippingMethodFragment_postalCodeRules) => void;
    onChannelsChange: (data: ChannelShippingData[]) => void;
    openChannelsModal: () => void;
    onProductAssign: () => void;
    onProductUnassign: (ids: string[]) => void;
    variant: ShippingMethodTypeEnum;
}

export const ShippingZoneRatesPage: React.FC<ShippingZoneRatesPageProps> = ({
    allChannelsCount,
    shippingChannels,
    channelErrors,
    disabled,
    errors,
    hasChannelChanged,
    havePostalCodesChanged,
    onBack,
    onDelete,
    onSubmit,
    onPostalCodeInclusionChange,
    onChannelsChange,
    onPostalCodeAssign,
    onPostalCodeUnassign,
    onProductAssign,
    onProductUnassign,
    openChannelsModal,
    rate,
    saveButtonBarState,
    postalCodeRules,
    variant,
    ...listProps
}) => {
    const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
    const initialForm: FormData = {
        channelListings: shippingChannels,
        maxDays: rate?.maximumDeliveryDays?.toString() || "",
        maxValue: rate?.maximumOrderWeight?.value.toString() || "",
        metadata: rate?.metadata.map(mapMetadataItemToInput),
        minDays: rate?.minimumDeliveryDays?.toString() || "",
        minValue: rate?.minimumOrderWeight?.value.toString() || "",
        name: rate?.name || "",
        description: rate?.description && JSON.parse(rate.description),
        noLimits: false,
        privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
        type: rate?.type || null,
    };

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, set, triggerChange }) => {
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

                const changeMetadata = makeMetadataChangeHandler(change);
                const formIsUnchanged = !hasChanged && !hasChannelChanged && !havePostalCodesChanged;

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            <FormattedMessage defaultMessage="Shipping" id="PRlD0A" />
                        </Backlink>
                        <PageHeader title={rate?.name} />
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
                                    postalCodes={postalCodeRules}
                                />
                                <CardSpacer />
                                <ShippingMethodProducts
                                    products={mapEdgesToItems(rate?.excludedProducts)}
                                    onProductAssign={onProductAssign}
                                    onProductUnassign={onProductUnassign}
                                    disabled={disabled}
                                    {...listProps}
                                />
                                <CardSpacer />
                                <Metadata data={data} onChange={changeMetadata} />
                            </div>
                            <div>
                                <ChannelsAvailabilityCard
                                    managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
                                    allChannelsCount={allChannelsCount}
                                    selectedChannelsCount={shippingChannels?.length}
                                    channelsList={data.channelListings.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                    }))}
                                    openModal={openChannelsModal}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || formDisabled || formIsUnchanged}
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

export default ShippingZoneRatesPage;

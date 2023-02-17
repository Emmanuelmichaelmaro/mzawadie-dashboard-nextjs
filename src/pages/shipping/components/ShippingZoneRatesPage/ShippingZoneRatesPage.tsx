// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { WithFormId } from "@mzawadie/components/Form/ExitFormDialogProvider";
import { Grid } from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ListActions, ListProps } from "@mzawadie/core";
import { ShippingChannelsErrorFragment } from "@mzawadie/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { ShippingMethodTypeFragment_postalCodeRules } from "@mzawadie/fragments/types/ShippingMethodTypeFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ChannelShippingData } from "@mzawadie/pages/channels/utils";
import { validatePrice } from "@mzawadie/pages/products/utils/validation";
import { createChannelsChangeHandler } from "@mzawadie/pages/shipping/handlers";
import {
    ShippingZone_shippingZone_shippingMethods,
    ShippingZone_shippingZone_shippingMethods_postalCodeRules,
} from "@mzawadie/pages/shipping/types/ShippingZone";
import {
    PermissionEnum,
    PostalCodeRuleInclusionTypeEnum,
    ShippingMethodTypeEnum,
} from "@mzawadie/types/globalTypes";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderValue } from "../OrderValue";
import { OrderWeight } from "../OrderWeight";
import { PricingCard } from "../PricingCard";
import { ShippingMethodProducts } from "../ShippingMethodProducts";
import { ShippingRateInfo } from "../ShippingRateInfo";
import { ShippingZonePostalCodes } from "../ShippingZonePostalCodes";
import { ShippingZoneRateUpdateFormData } from "./types";

export interface ShippingZoneRatesPageProps
    extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
        ListActions,
        WithFormId {
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
    onSubmit: (data: ShippingZoneRateUpdateFormData) => SubmitPromise;
    onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
    onPostalCodeAssign: () => void;
    onPostalCodeUnassign: (code: ShippingMethodTypeFragment_postalCodeRules) => void;
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
    formId,
    ...listProps
}) => {
    const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;

    const initialForm: ShippingZoneRateUpdateFormData = {
        channelListings: shippingChannels,
        maxDays: rate?.maximumDeliveryDays?.toString() || "",
        maxValue: rate?.maximumOrderWeight?.value.toString() || "",
        metadata: rate?.metadata.map(mapMetadataItemToInput),
        minDays: rate?.minimumDeliveryDays?.toString() || "",
        minValue: rate?.minimumOrderWeight?.value.toString() || "",
        name: rate?.name || "",
        description: rate?.description && JSON.parse(rate.description),
        orderValueRestricted: !!rate?.channelListings.length,
        privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
        type: rate?.type || null,
    };

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit} formId={formId}>
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
                                        orderValueRestricted={data.orderValueRestricted}
                                        disabled={disabled}
                                        onChange={change}
                                        onChannelsChange={handleChannelsChange}
                                    />
                                ) : (
                                    <OrderWeight
                                        orderValueRestricted={data.orderValueRestricted}
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

// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { WithFormId } from "@mzawadie/components/Form/ExitFormDialogProvider";
import { Grid } from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ListActions, ListProps } from "@mzawadie/core";
import {
    PermissionEnum,
    PostalCodeRuleInclusionTypeEnum,
    ShippingChannelsErrorFragment,
    ShippingErrorFragment,
    ShippingMethodTypeEnum,
    ShippingMethodTypeFragment,
    ShippingZoneQuery,
} from "@mzawadie/graphql";
import useForm, { SubmitPromise } from "@mzawadie/hooks/useForm";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { ChannelShippingData } from "@mzawadie/pages/channels/utils";
import { validatePrice } from "@mzawadie/pages/products/utils/validation";
import { OrderValue } from "@mzawadie/pages/shipping/components/OrderValue";
import { OrderWeight } from "@mzawadie/pages/shipping/components/OrderWeight";
import { PricingCard } from "@mzawadie/pages/shipping/components/PricingCard";
import { ShippingMethodProducts } from "@mzawadie/pages/shipping/components/ShippingMethodProducts";
import { ShippingRateInfo } from "@mzawadie/pages/shipping/components/ShippingRateInfo";
import { ShippingZonePostalCodes } from "@mzawadie/pages/shipping/components/ShippingZonePostalCodes";
import { createChannelsChangeHandler } from "@mzawadie/pages/shipping/handlers";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@mzawadie/utils/richText/context";
import useRichText from "@mzawadie/utils/richText/useRichText";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React, { FormEventHandler } from "react";
import { FormattedMessage } from "react-intl";

import { ShippingZoneRateUpdateFormData } from "./types";

export interface ShippingZoneRatesPageProps
    extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
        ListActions,
        WithFormId {
    allChannelsCount?: number;
    shippingChannels: ChannelShippingData[];
    disabled: boolean;
    rate: ShippingZoneQuery["shippingZone"]["shippingMethods"][0];
    channelErrors: ShippingChannelsErrorFragment[];
    errors: ShippingErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    postalCodeRules: ShippingZoneQuery["shippingZone"]["shippingMethods"][0]["postalCodeRules"];
    backHref: string;
    onDelete?: () => void;
    onSubmit: (data: ShippingZoneRateUpdateFormData) => SubmitPromise;
    onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
    onPostalCodeAssign: () => void;
    onPostalCodeUnassign: (code: ShippingMethodTypeFragment["postalCodeRules"][0]) => void;
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
    backHref,
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
    const navigate = useNavigator();

    const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;

    const initialForm: Omit<ShippingZoneRateUpdateFormData, "description"> = React.useMemo(
        () => ({
            channelListings: shippingChannels,
            maxDays: rate?.maximumDeliveryDays?.toString() || "",
            maxValue: rate?.maximumOrderWeight?.value.toString() || "",
            metadata: rate?.metadata.map(mapMetadataItemToInput),
            minDays: rate?.minimumDeliveryDays?.toString() || "",
            minValue: rate?.minimumOrderWeight?.value.toString() || "",
            name: rate?.name || "",
            orderValueRestricted: !!rate?.channelListings.length,
            privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
            type: rate?.type || null,
        }),
        [shippingChannels, rate]
    );

    const {
        change,
        data: formData,
        setIsSubmitDisabled,
        triggerChange,
    } = useForm(initialForm, undefined, { confirmLeave: true, formId });

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit,
    });

    const richText = useRichText({
        initial: rate?.description,
        loading: !rate,
        triggerChange,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const data: ShippingZoneRateUpdateFormData = {
        ...formData,
        description: null,
    };

    // Prevents closing ref in submit functions
    const getData = async (): Promise<ShippingZoneRateUpdateFormData> => ({
        ...data,
        description: await richText.getValue(),
    });

    const handleFormElementSubmit: FormEventHandler = async (event) => {
        event.preventDefault();
        handleFormSubmit(await getData());
    };

    const handleSubmit = async () => handleFormSubmit(await getData());

    const handleChannelsChange = createChannelsChangeHandler(
        shippingChannels,
        onChannelsChange,
        triggerChange
    );

    const isValid = !formData.channelListings?.some((channel) => validatePrice(channel.price));

    const changeMetadata = makeMetadataChangeHandler(change);

    const isSaveDisabled = disabled || !isValid;

    setIsSubmitDisabled(isSaveDisabled);

    return (
        <RichTextContext.Provider value={richText}>
            <form onSubmit={handleFormElementSubmit}>
                <Container>
                    <Backlink href={backHref}>
                        <FormattedMessage id="PRlD0A" defaultMessage="Shipping" />
                    </Backlink>

                    <PageHeader title={rate?.name} />

                    <Grid>
                        <div>
                            <ShippingRateInfo
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
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
                                channelsList={data.channelListings.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                }))}
                                openModal={openChannelsModal}
                            />
                        </div>
                    </Grid>

                    <Savebar
                        disabled={isSaveDisabled}
                        onCancel={() => navigate(backHref)}
                        onDelete={onDelete}
                        onSubmit={handleSubmit}
                        state={saveButtonBarState}
                    />
                </Container>
            </form>
        </RichTextContext.Provider>
    );
};

export default ShippingZoneRatesPage;

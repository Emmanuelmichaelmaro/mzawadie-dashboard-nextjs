// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import CountryList from "@mzawadie/components/CountryList";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { ChannelProps, FetchMoreProps, SearchProps, getStringOrPlaceholder } from "@mzawadie/core";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { ShippingZoneDetailsFragment_warehouses } from "@mzawadie/fragments/types/ShippingZoneDetailsFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { ShippingMethodTypeEnum } from "@mzawadie/types/globalTypes";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { BaseChannels_channels } from "@mzawadie/views/channels/types/BaseChannels";
import { ShippingZone_shippingZone } from "@mzawadie/views/shipping/types/ShippingZone";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import ShippingZoneInfo from "../ShippingZoneInfo";
import ShippingZoneRates from "../ShippingZoneRates";
import ShippingZoneSettingsCard from "../ShippingZoneSettingsCard";
import { FormData } from "./types";
import { getInitialFormData } from "./utils";

const messages = defineMessages({
    countries: {
        defaultMessage: "Countries",
        id: "55LMJv",
        description: "country list header",
    },
    defaultZone: {
        defaultMessage:
            "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones",
        id: "ddWFtA",
    },
    noCountriesAssigned: {
        defaultMessage: "Currently, there are no countries assigned to this shipping zone",
        id: "y7mfbl",
    },
    shipping: {
        defaultMessage: "Shipping",
        id: "G0+gAp",
        description: "shipping section header",
    },
});

export interface ShippingZoneDetailsPageProps extends FetchMoreProps, SearchProps, ChannelProps {
    disabled: boolean;
    errors: ShippingErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    shippingZone: ShippingZone_shippingZone;
    warehouses: ShippingZoneDetailsFragment_warehouses[];
    onBack: () => void;
    onCountryAdd: () => void;
    onCountryRemove: (code: string) => void;
    onDelete: () => void;
    onPriceRateAdd: () => void;
    onPriceRateEdit: (id: string) => void;
    onRateRemove: (rateId: string) => void;
    onSubmit: (data: FormData) => SubmitPromise;
    onWarehouseAdd: () => void;
    onWeightRateAdd: () => void;
    onWeightRateEdit: (id: string) => void;
    allChannels?: BaseChannels_channels[];
}

function warehouseToChoice(warehouse: Record<"id" | "name", string>): SingleAutocompleteChoiceType {
    return {
        label: warehouse.name,
        value: warehouse.id,
    };
}

const ShippingZoneDetailsPage: React.FC<ShippingZoneDetailsPageProps> = ({
    disabled,
    errors,
    hasMore,
    loading,
    onBack,
    onCountryAdd,
    onCountryRemove,
    onDelete,
    onFetchMore,
    onPriceRateAdd,
    onPriceRateEdit,
    onRateRemove,
    onSearchChange,
    onSubmit,
    onWarehouseAdd,
    onWeightRateAdd,
    onWeightRateEdit,
    saveButtonBarState,
    selectedChannelId,
    shippingZone,
    warehouses,
    allChannels,
}) => {
    const intl = useIntl();

    const initialForm = getInitialFormData(shippingZone);

    const [warehouseDisplayValues, setWarehouseDisplayValues] = useStateFromProps<
        MultiAutocompleteChoiceType[]
    >(mapNodeToChoice(shippingZone?.warehouses));

    const warehouseChoices = warehouses.map(warehouseToChoice);

    const channelChoices = mapNodeToChoice(allChannels);

    const [channelsDisplayValues, setChannelDisplayValues] = useStateFromProps<
        MultiAutocompleteChoiceType[]
    >(mapNodeToChoice(shippingZone?.channels));

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, toggleValue }) => {
                const handleWarehouseChange = createMultiAutocompleteSelectHandler(
                    toggleValue,
                    setWarehouseDisplayValues,
                    warehouseDisplayValues,
                    warehouseChoices
                );

                const handleChannelChange = createMultiAutocompleteSelectHandler(
                    toggleValue,
                    setChannelDisplayValues,
                    channelsDisplayValues,
                    channelChoices
                );

                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            <FormattedMessage {...messages.shipping} />
                        </Backlink>
                        <PageHeader title={shippingZone?.name} />
                        <Grid>
                            <div>
                                <ShippingZoneInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <CountryList
                                    countries={shippingZone?.countries}
                                    disabled={disabled}
                                    emptyText={getStringOrPlaceholder(
                                        shippingZone?.default === undefined
                                            ? undefined
                                            : shippingZone.default
                                            ? intl.formatMessage(messages.defaultZone)
                                            : intl.formatMessage(messages.noCountriesAssigned)
                                    )}
                                    onCountryAssign={onCountryAdd}
                                    onCountryUnassign={onCountryRemove}
                                    title={intl.formatMessage(messages.countries)}
                                />
                                <CardSpacer />
                                <ShippingZoneRates
                                    disabled={disabled}
                                    onRateAdd={onPriceRateAdd}
                                    onRateEdit={onPriceRateEdit}
                                    onRateRemove={onRateRemove}
                                    rates={shippingZone?.shippingMethods?.filter(
                                        (method) => method.type === ShippingMethodTypeEnum.PRICE
                                    )}
                                    variant="price"
                                    selectedChannelId={selectedChannelId}
                                    testId="add-price-rate"
                                />
                                <CardSpacer />
                                <ShippingZoneRates
                                    disabled={disabled}
                                    onRateAdd={onWeightRateAdd}
                                    onRateEdit={onWeightRateEdit}
                                    onRateRemove={onRateRemove}
                                    rates={shippingZone?.shippingMethods?.filter(
                                        (method) => method.type === ShippingMethodTypeEnum.WEIGHT
                                    )}
                                    variant="weight"
                                    selectedChannelId={selectedChannelId}
                                    testId="add-weight-rate"
                                />
                                <CardSpacer />
                                <Metadata data={data} onChange={changeMetadata} />
                            </div>
                            <div>
                                <ShippingZoneSettingsCard
                                    formData={data}
                                    warehousesDisplayValues={warehouseDisplayValues}
                                    hasMoreWarehouses={hasMore}
                                    loading={loading}
                                    onWarehouseChange={handleWarehouseChange}
                                    onFetchMoreWarehouses={onFetchMore}
                                    onWarehousesSearchChange={onSearchChange}
                                    onWarehouseAdd={onWarehouseAdd}
                                    warehousesChoices={warehouseChoices}
                                    allChannels={allChannels}
                                    channelsDisplayValues={channelsDisplayValues}
                                    onChannelChange={handleChannelChange}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
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
ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;

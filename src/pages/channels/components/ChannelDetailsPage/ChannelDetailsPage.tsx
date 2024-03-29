// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import Savebar from "@mzawadie/components/Savebar";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import {
    ChannelErrorFragment,
    CountryFragment,
    SearchShippingZonesQuery,
    CountryCode,
    ChannelDetailsFragment,
} from "@mzawadie/graphql";
import { SearchData } from "@mzawadie/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { getById, getByUnmatchingId } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../ChannelForm";
import { ChannelStatus } from "../ChannelStatus";
import { ShippingZonesCard } from "../ShippingZonesCard";
import { ChannelShippingZones } from "./types";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export interface ChannelDetailsPageProps<TErrors> {
    channel?: ChannelDetailsFragment;
    currencyCodes?: SingleAutocompleteChoiceType[];
    disabled: boolean;
    disabledStatus?: boolean;
    errors: ChannelErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    searchShippingZonesData?: SearchData;
    fetchMoreShippingZones: FetchMoreProps;
    channelShippingZones?: ChannelShippingZones;
    countries: CountryFragment[];
    onBack?: () => void;
    onDelete?: () => void;
    onSubmit: (data: FormData) => SubmitPromise<TErrors[]>;
    updateChannelStatus?: () => void;
    searchShippingZones: (query: string) => void;
}

const ChannelDetailsPage = function <TErrors>({
    channel,
    currencyCodes,
    disabled,
    disabledStatus,
    onSubmit,
    errors,
    onBack,
    onDelete,
    saveButtonBarState,
    updateChannelStatus,
    searchShippingZones,
    searchShippingZonesData,
    fetchMoreShippingZones,
    countries,
    channelShippingZones = [],
}: ChannelDetailsPageProps<TErrors>) {
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
    const [selectedCountryDisplayName, setSelectedCountryDisplayName] = useStateFromProps(
        channel?.defaultCountry.country || ""
    );

    const [shippingZonesToDisplay, setShippingZonesToDisplay] =
        useStateFromProps<ChannelShippingZones>(channelShippingZones);

    const countryChoices = mapCountriesToChoices(countries || []);

    const { defaultCountry, ...formData } = channel || {};
    const initialData: FormData = {
        currencyCode: "",
        name: "",
        slug: "",
        shippingZonesIdsToAdd: [],
        shippingZonesIdsToRemove: [],
        defaultCountry: (defaultCountry?.code || "") as CountryCode,
        ...formData,
    };

    const getFilteredShippingZonesChoices = (): Array<
        RelayToFlat<SearchShippingZonesQuery["search"]>
    > =>
        getParsedSearchData({ data: searchShippingZonesData }).filter(
            ({ id: searchedZoneId }) => !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId)
        );

    return (
        <Form confirmLeave onSubmit={onSubmit} initial={initialData}>
            {({ change, data, hasChanged, submit, set }) => {
                const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
                    change,
                    setSelectedCurrencyCode,
                    currencyCodes
                );
                const handleDefaultCountrySelect = createSingleAutocompleteSelectHandler(
                    change,
                    setSelectedCountryDisplayName,
                    countryChoices
                );

                const addShippingZone = (zoneId: string) => {
                    set({
                        ...data,
                        shippingZonesIdsToRemove: getUpdatedIdsWithoutNewId(
                            data.shippingZonesIdsToRemove,
                            zoneId
                        ),
                        shippingZonesIdsToAdd: getUpdatedIdsWithNewId(
                            data.shippingZonesIdsToAdd,
                            zoneId
                        ),
                    });

                    setShippingZonesToDisplay([
                        ...shippingZonesToDisplay,
                        getParsedSearchData({ data: searchShippingZonesData }).find(getById(zoneId)),
                    ]);
                };

                const removeShippingZone = (zoneId: string) => {
                    set({
                        ...data,
                        shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(
                            data.shippingZonesIdsToAdd,
                            zoneId
                        ),
                        shippingZonesIdsToRemove: getUpdatedIdsWithNewId(
                            data.shippingZonesIdsToRemove,
                            zoneId
                        ),
                    });

                    setShippingZonesToDisplay(shippingZonesToDisplay.filter(getByUnmatchingId(zoneId)));
                };

                const formDisabled =
                    !data.name ||
                    !data.slug ||
                    !data.currencyCode ||
                    !data.defaultCountry ||
                    !(data.name.trim().length > 0);

                return (
                    <>
                        <Grid>
                            <div>
                                <ChannelForm
                                    data={data}
                                    disabled={disabled}
                                    currencyCodes={currencyCodes}
                                    countries={countryChoices}
                                    selectedCurrencyCode={selectedCurrencyCode}
                                    selectedCountryDisplayName={selectedCountryDisplayName}
                                    onChange={change}
                                    onCurrencyCodeChange={handleCurrencyCodeSelect}
                                    onDefaultCountryChange={handleDefaultCountrySelect}
                                    errors={errors}
                                />
                            </div>
                            <div>
                                {!!updateChannelStatus && (
                                    <>
                                        <ChannelStatus
                                            isActive={channel?.isActive}
                                            disabled={disabledStatus}
                                            updateChannelStatus={updateChannelStatus}
                                        />
                                        <CardSpacer />
                                    </>
                                )}
                                <ShippingZonesCard
                                    shippingZonesChoices={getFilteredShippingZonesChoices()}
                                    shippingZones={shippingZonesToDisplay}
                                    addShippingZone={addShippingZone}
                                    removeShippingZone={removeShippingZone}
                                    searchShippingZones={searchShippingZones}
                                    fetchMoreShippingZones={fetchMoreShippingZones}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            onCancel={onBack}
                            onSubmit={submit}
                            onDelete={onDelete}
                            state={saveButtonBarState}
                            disabled={disabled || formDisabled || !onSubmit || !hasChanged}
                        />
                    </>
                );
            }}
        </Form>
    );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Savebar from "@mzawadie/components/Savebar";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps } from "@mzawadie/core";
import { ChannelErrorFragment } from "@mzawadie/fragments/types/ChannelErrorFragment";
import { SearchData } from "@mzawadie/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import ShippingZonesCard from "@mzawadie/views/channels/components/ShippingZonesCard/ShippingZonesCard";
import { getById, getByUnmatchingId } from "@mzawadie/views/orders/components/OrderReturnPage/utils";
import { SearchShippingZones_search_edges_node } from "@mzawadie/views/searches/types/SearchShippingZones";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { Channel_channel } from "../../types/Channel";
import { ChannelShippingZones } from "./types";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export interface ChannelDetailsPageProps {
    channel?: Channel_channel;
    currencyCodes?: SingleAutocompleteChoiceType[];
    disabled: boolean;
    disabledStatus?: boolean;
    errors: ChannelErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack?: () => void;
    onDelete?: () => void;
    onSubmit: (data: FormData) => void;
    updateChannelStatus?: () => void;
    searchShippingZones: (query: string) => void;
    searchShippingZonesData?: SearchData;
    fetchMoreShippingZones: FetchMoreProps;
    channelShippingZones?: ChannelShippingZones;
}

export const ChannelDetailsPage: React.FC<ChannelDetailsPageProps> = ({
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
    channelShippingZones = [],
}) => {
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");

    const [shippingZonesToDisplay, setShippingZonesToDisplay] =
        useStateFromProps<ChannelShippingZones>(channelShippingZones);

    const initialData: FormData = {
        currencyCode: "",
        name: "",
        slug: "",
        shippingZonesIdsToAdd: [],
        shippingZonesIdsToRemove: [],
        ...channel,
    };

    const getFilteredShippingZonesChoices = (): SearchShippingZones_search_edges_node[] =>
        getParsedSearchData({ data: searchShippingZonesData }).filter(
            ({ id: searchedZoneId }) => !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId)
        );

    return (
        <Form onSubmit={onSubmit} initial={initialData}>
            {({ change, data, hasChanged, submit, set }) => {
                const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
                    change,
                    setSelectedCurrencyCode,
                    currencyCodes
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

                const formDisabled = !data.name || !data.slug || !data.currencyCode;

                return (
                    <>
                        <Grid>
                            <div>
                                <ChannelForm
                                    data={data}
                                    disabled={disabled}
                                    currencyCodes={currencyCodes}
                                    selectedCurrencyCode={selectedCurrencyCode}
                                    onChange={change}
                                    onCurrencyCodeChange={handleCurrencyCodeSelect}
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

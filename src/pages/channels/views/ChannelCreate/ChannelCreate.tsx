// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, sectionNames } from "@mzawadie/core";
import { ChannelCreateMutation, useChannelCreateMutation } from "@mzawadie/graphql";
import { getSearchFetchMoreProps } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@mzawadie/hooks/useNotifier/utils";
import useShop from "@mzawadie/hooks/useShop";
import { channelPath, channelsListUrl } from "@mzawadie/pages/channels/urls";
import useShippingZonesSearch from "@mzawadie/searches/useShippingZonesSearch";
import { Backlink } from "@saleor/macaw-ui";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelDetailsPage } from "../../components/ChannelDetailsPage";
import { FormData } from "../../components/ChannelForm/ChannelForm";

export function ChannelCreateView() {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    const handleBack = () => navigate(channelsListUrl());

    const [createChannel, createChannelOpts] = useChannelCreateMutation({
        onCompleted: ({ channelCreate: { errors, channel } }: ChannelCreateMutation) => {
            notify(getDefaultNotifierSuccessErrorData(errors, intl));

            if (!errors.length) {
                navigate(channelPath(channel.id));
            }
        },
    });

    const handleSubmit = ({
        shippingZonesIdsToAdd,
        shippingZonesIdsToRemove,
        currencyCode,
        ...rest
    }: FormData) =>
        createChannel({
            variables: {
                input: {
                    ...rest,
                    currencyCode: currencyCode.toUpperCase(),
                    addShippingZones: shippingZonesIdsToAdd,
                },
            },
        });

    const {
        loadMore: fetchMoreShippingZones,
        search: searchShippingZones,
        result: searchShippingZonesResult,
    } = useShippingZonesSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const currencyCodeChoices = currencyCodes.data.map((currencyData) => ({
        label: intl.formatMessage(
            {
                defaultMessage: "{code} - {countries}",
                id: "J7mFhU",
                description: "currency code select",
            },
            {
                code: currencyData.code,
                countries: currencyData.countries.join(","),
            }
        ),
        value: currencyData.code,
    }));

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create Channel",
                    id: "OrMr/k",
                    description: "window title",
                })}
            />

            <Container>
                <Backlink onClick={handleBack}>{intl.formatMessage(sectionNames.channels)}</Backlink>

                <PageHeader
                    title={intl.formatMessage({
                        defaultMessage: "New Channel",
                        id: "DnghuS",
                        description: "channel create",
                    })}
                />

                <ChannelDetailsPage
                    searchShippingZones={searchShippingZones}
                    searchShippingZonesData={searchShippingZonesResult.data}
                    fetchMoreShippingZones={getSearchFetchMoreProps(
                        searchShippingZonesResult,
                        fetchMoreShippingZones
                    )}
                    disabled={createChannelOpts.loading}
                    errors={createChannelOpts?.data?.channelCreate?.errors || []}
                    currencyCodes={currencyCodeChoices}
                    onSubmit={handleSubmit}
                    onBack={handleBack}
                    saveButtonBarState={createChannelOpts.status}
                    countries={shop?.countries || []}
                />
            </Container>
        </>
    );
}

export default ChannelCreateView;

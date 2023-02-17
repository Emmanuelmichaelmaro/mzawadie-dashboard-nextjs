// @ts-nocheck
import { useShopCountries } from "@mzawadie/components/Shop/query";
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { mapCountriesToCountriesCodes } from "@mzawadie/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import {
    ShippingZoneCreatePage,
    ShippingZoneCreateFormData,
} from "../components/ShippingZoneCreatePage";
import { useShippingZoneCreate } from "../mutations";
import { shippingZonesListUrl, shippingZoneUrl } from "../urls";

const ShippingZoneCreate: React.FC<{}> = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const { data: restWorldCountries } = useShopCountries({
        variables: {
            filter: {
                attachedToShippingZones: false,
            },
        },
    });

    const [createShippingZone, createShippingZoneOpts] = useShippingZoneCreate({
        onCompleted: (data) => {
            if (data.shippingZoneCreate.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                navigate(shippingZoneUrl(data.shippingZoneCreate.shippingZone.id));
            }
        },
    });

    const handleSubmit = (data: ShippingZoneCreateFormData) =>
        extractMutationErrors(
            createShippingZone({
                variables: {
                    input: data,
                },
            })
        );

    return (
        <ShippingZoneCreatePage
            countries={shop?.countries || []}
            restWorldCountries={mapCountriesToCountriesCodes(restWorldCountries?.shop?.countries) || []}
            disabled={createShippingZoneOpts.loading}
            errors={createShippingZoneOpts.data?.shippingZoneCreate.errors || []}
            onBack={() => navigate(shippingZonesListUrl())}
            onSubmit={handleSubmit}
            saveButtonBarState={createShippingZoneOpts.status}
        />
    );
};
export default ShippingZoneCreate;

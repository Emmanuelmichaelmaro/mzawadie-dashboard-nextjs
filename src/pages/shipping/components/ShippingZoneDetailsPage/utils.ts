// @ts-nocheck
import { ShippingZoneQuery } from "@mzawadie/graphql";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";

import { FormData } from "./types";

export const getInitialFormData = (shippingZone?: ShippingZoneQuery["shippingZone"]): FormData => ({
    description: shippingZone?.description || "",
    metadata: shippingZone?.metadata.map(mapMetadataItemToInput),
    name: shippingZone?.name || "",
    privateMetadata: shippingZone?.privateMetadata.map(mapMetadataItemToInput),
    warehouses: shippingZone?.warehouses?.map((warehouse) => warehouse.id) || [],
    channels: shippingZone?.channels.map(({ id }) => id) || [],
});

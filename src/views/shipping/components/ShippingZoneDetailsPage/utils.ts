// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import { ShippingZone_shippingZone } from "@mzawadie/views/shipping/types/ShippingZone";

import { FormData } from "./types";

export const getInitialFormData = (shippingZone?: ShippingZone_shippingZone): FormData => ({
    description: shippingZone?.description || "",
    metadata: shippingZone?.metadata.map(mapMetadataItemToInput),
    name: shippingZone?.name || "",
    privateMetadata: shippingZone?.privateMetadata.map(mapMetadataItemToInput),
    warehouses: shippingZone?.warehouses?.map((warehouse) => warehouse.id) || [],
    channels: shippingZone?.channels.map(({ id }) => id) || [],
});

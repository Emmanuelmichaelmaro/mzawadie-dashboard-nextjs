// @ts-nocheck
import { RelayToFlat } from "@mzawadie/core";
import { ChannelShippingZonesQuery } from "@mzawadie/graphql";

export type ChannelShippingZones = RelayToFlat<ChannelShippingZonesQuery["shippingZones"]>;

export type ChannelShippingZone = ChannelShippingZones[0];

// @ts-nocheck
import { GiftCardUpdatePageUrlQueryParams } from "@mzawadie/pages/components/GiftCardUpdate/types";
import { GiftCardListUrlQueryParams } from "@mzawadie/pages/components/GiftCardsList/types";
import { stringifyQs } from "@mzawadie/utils/urls";
import urlJoin from "url-join";

export const giftCardsSectionUrlName = "/gift-cards";

export const giftCardsListPath = `${giftCardsSectionUrlName}/`;

export const giftCardListUrl = (params?: GiftCardListUrlQueryParams) =>
    `${giftCardsListPath}?${stringifyQs(params)}`;

export const giftCardPath = (id: string) => urlJoin(giftCardsListPath, id);

export const giftCardUrl = (id: string, params?: GiftCardUpdatePageUrlQueryParams) =>
    `${giftCardPath(encodeURIComponent(id))}?${stringifyQs(params)}`;

export const giftCardSettingsUrl = urlJoin(giftCardsListPath, "settings");

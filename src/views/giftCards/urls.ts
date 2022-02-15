import { stringifyQs } from "@mzawadie/utils/urls";
import urlJoin from "url-join";

import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";
import { GiftCardListUrlQueryParams } from "./GiftCardsList/types";

export const giftCardsSectionUrlName = "/gift-cards";

export const giftCardsListPath = `${giftCardsSectionUrlName}/`;

export const giftCardsListUrl = (params?: GiftCardListUrlQueryParams) =>
    `${giftCardsListPath}?${stringifyQs(params || {})}`;

export const giftCardUrl = (id: string, params?: GiftCardUpdatePageUrlQueryParams) =>
    `${urlJoin(giftCardsListPath, id)}?${stringifyQs(params || {})}`;

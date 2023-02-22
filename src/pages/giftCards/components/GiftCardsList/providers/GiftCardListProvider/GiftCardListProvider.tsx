// @ts-nocheck
import { ApolloError } from "@apollo/client";
import { ListViews, SortPage } from "@mzawadie/core";
import useBulkActions, { UseBulkActionsProps } from "@mzawadie/hooks/useBulkActions";
import useListSettings, { UseListSettings } from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import { createPaginationState, PageInfo, PaginationState } from "@mzawadie/hooks/usePaginator";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React, { createContext } from "react";

import { giftCardListUrl } from "../../../../urls";
import { ExtendedGiftCard } from "../../../GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { getExtendedGiftCard } from "../../../GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { getFilterVariables } from "../../GiftCardListSearchAndFilters/filters";
import { useGiftCardListQuery } from "../../queries";
import { GiftCardListColummns, GiftCardListUrlQueryParams, GiftCardUrlSortField } from "../../types";
import { GiftCardList_giftCards_edges_node, GiftCardListVariables } from "../../types/GiftCardList";
import { getSortQueryVariables } from "./sort";

const numberOfColumns = 7;

interface GiftCardsListProviderProps {
    children: React.ReactNode;
    params: GiftCardListUrlQueryParams;
}

export interface GiftCardListDataProps extends SortPage<GiftCardUrlSortField> {
    giftCards: Array<ExtendedGiftCard<GiftCardList_giftCards_edges_node>>;
    pageInfo: PageInfo;
    loading: boolean;
    params: GiftCardListUrlQueryParams;
    paginationState: PaginationState;
    numberOfColumns: number;
    totalCount: number;
}

export interface GiftCardsListConsumerProps
    extends UseBulkActionsProps,
        GiftCardListDataProps,
        UseListSettings<GiftCardListColummns>,
        SortPage<GiftCardUrlSortField> {
    selectedItemsCount: number;
}

export const GiftCardsListContext = createContext<GiftCardsListConsumerProps>(null);

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({ children, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();

    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions([]);

    const { updateListSettings, settings } = useListSettings<GiftCardListColummns>(
        ListViews.GIFT_CARD_LIST
    );

    usePaginationReset(giftCardListUrl, params, settings.rowNumber);

    const paginationState = createPaginationState(settings.rowNumber, params);

    const handleSort = createSortHandler(navigate, giftCardListUrl, params);

    const queryVariables = React.useMemo<GiftCardListVariables>(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params, paginationState]
    );

    const handleGiftCardListError = (error: ApolloError) => {
        const { message } = error?.graphQLErrors[0];

        if (!!message) {
            notify({
                status: "error",
                text: message,
            });
        }
    };

    const { data, loading } = useGiftCardListQuery({
        displayLoader: true,
        variables: queryVariables,
        handleError: handleGiftCardListError,
    });

    const giftCards = mapEdgesToItems(data?.giftCards)?.map(getExtendedGiftCard);

    const providerValues: GiftCardsListConsumerProps = {
        onSort: handleSort,
        sort: getSortParams(params),
        giftCards,
        totalCount: data?.giftCards?.totalCount || 0,
        loading,
        isSelected,
        listElements,
        reset,
        toggleAll,
        toggle,
        selectedItemsCount: listElements.length,
        pageInfo: data?.giftCards?.pageInfo,
        paginationState,
        params,
        settings,
        updateListSettings,
        numberOfColumns,
    };

    return (
        <GiftCardsListContext.Provider value={providerValues}>{children}</GiftCardsListContext.Provider>
    );
};

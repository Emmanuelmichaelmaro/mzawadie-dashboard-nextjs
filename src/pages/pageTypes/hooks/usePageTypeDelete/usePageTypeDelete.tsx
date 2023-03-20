// @ts-nocheck
import { PageCountQueryVariables, usePageCountQuery } from "@mzawadie/graphql";
import { PageTypeListUrlQueryParams, PageTypeUrlQueryParams } from "@mzawadie/pages/pageTypes/urls";
import { pageListUrl } from "@mzawadie/pages/pages/urls";
import React from "react";

import * as messages from "./messages";
import { UseTypeDeleteData, UseTypeDeleteProps } from "./types";

type UsePageTypeDeleteProps<T = PageTypeListUrlQueryParams | PageTypeUrlQueryParams> =
    UseTypeDeleteProps<T>;

function usePageTypeDelete({
    singleId,
    params,
    selectedTypes,
}: UsePageTypeDeleteProps): UseTypeDeleteData {
    const pageTypes = selectedTypes || [singleId];

    const isDeleteDialogOpen = params.action === "remove";

    const pagesAssignedToSelectedTypesQueryVars = React.useMemo<PageCountQueryVariables>(
        () => ({
            filter: {
                pageTypes,
            },
        }),
        [pageTypes]
    );

    const shouldSkipPageListQuery = !pageTypes.length || !isDeleteDialogOpen;

    const { data: pagesAssignedToSelectedTypesData, loading: loadingPagesAssignedToSelectedTypes } =
        usePageCountQuery({
            variables: pagesAssignedToSelectedTypesQueryVars,
            skip: shouldSkipPageListQuery,
        });

    const selectedPagesAssignedToDeleteUrl = pageListUrl({
        pageTypes,
    });

    const assignedItemsCount = pagesAssignedToSelectedTypesData?.pages?.totalCount;

    return {
        ...messages,
        isOpen: isDeleteDialogOpen,
        assignedItemsCount,
        viewAssignedItemsUrl: selectedPagesAssignedToDeleteUrl,
        isLoading: loadingPagesAssignedToSelectedTypes,
        typesToDelete: pageTypes,
    };
}

export default usePageTypeDelete;

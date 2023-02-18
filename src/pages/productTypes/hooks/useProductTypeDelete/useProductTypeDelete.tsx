/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck
import {
    UseTypeDeleteData,
    UseTypeDeleteProps,
} from "@mzawadie/pages/pageTypes/hooks/usePageTypeDelete/types";
import {
    ProductTypeListUrlQueryParams,
    ProductTypeUrlQueryParams,
} from "@mzawadie/pages/productTypes/urls";
import { useProductCountQuery } from "@mzawadie/pages/products/queries";
import { ProductCountVariables } from "@mzawadie/pages/products/types/ProductCount";
import { productListUrl } from "@mzawadie/pages/products/urls";
import React from "react";

import * as messages from "./messages";

type UseProductTypeDeleteProps<T = ProductTypeListUrlQueryParams | ProductTypeUrlQueryParams> =
    UseTypeDeleteProps<T>;

function useProductTypeDelete({
    params,
    singleId,
    selectedTypes,
}: UseProductTypeDeleteProps): UseTypeDeleteData {
    const productTypes = selectedTypes || [singleId];

    const isDeleteDialogOpen = params.action === "remove";

    const productsAssignedToSelectedTypesQueryVars = React.useMemo<ProductCountVariables>(
        () => ({
            filter: {
                productTypes,
            },
        }),
        [productTypes]
    );

    const shouldSkipProductListQuery = !productTypes.length || !isDeleteDialogOpen;

    const {
        data: productsAssignedToSelectedTypesData,
        loading: loadingProductsAssignedToSelectedTypes,
    } = useProductCountQuery({
        variables: productsAssignedToSelectedTypesQueryVars,
        skip: shouldSkipProductListQuery,
    });

    const selectedProductsAssignedToDeleteUrl = productListUrl({
        productTypes,
    });

    const assignedItemsCount = productsAssignedToSelectedTypesData?.products?.totalCount;

    return {
        ...messages,
        isOpen: isDeleteDialogOpen,
        assignedItemsCount,
        viewAssignedItemsUrl: selectedProductsAssignedToDeleteUrl,
        isLoading: loadingProductsAssignedToSelectedTypes,
        typesToDelete: productTypes,
    };
}

export default useProductTypeDelete;

// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { Task } from "@mzawadie/containers/BackgroundTasks/types";
import {
    DEFAULT_INITIAL_PAGINATION_DATA,
    DEFAULT_INITIAL_SEARCH_DATA,
    defaultListSettings,
    ProductListColumns,
} from "@mzawadie/core";
import { commonMessages } from "@mzawadie/core";
import { maybe } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import {
    ProductListQueryVariables,
    useGridAttributesQuery,
    useInitialProductFilterAttributesQuery,
    useInitialProductFilterCategoriesQuery,
    useInitialProductFilterCollectionsQuery,
    useInitialProductFilterProductTypesQuery,
    useProductBulkDeleteMutation,
    useProductCountQuery,
    useProductExportMutation,
    useProductListQuery,
    useWarehouseListQuery,
} from "@mzawadie/graphql";
import useBackgroundTask from "@mzawadie/hooks/useBackgroundTask";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { useSortRedirects } from "@mzawadie/hooks/useSortRedirects";
import { filterable } from "@mzawadie/pages/attributes/utils/data";
import {
    productAddUrl,
    productListUrl,
    ProductListUrlDialog,
    ProductListUrlQueryParams,
    ProductListUrlSortField,
} from "@mzawadie/pages/products/urls";
import useAttributeSearch from "@mzawadie/searches/useAttributeSearch";
import useAttributeValueSearch from "@mzawadie/searches/useAttributeValueSearch";
import useAvailableInGridAttributesSearch from "@mzawadie/searches/useAvailableInGridAttributesSearch";
import useCategorySearch from "@mzawadie/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/searches/useCollectionSearch";
import useProductTypeSearch from "@mzawadie/searches/useProductTypeSearch";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortUrlVariables } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductExportDialog } from "../../components/ProductExportDialog";
import { ProductListPage } from "../../components/ProductListPage";
import {
    getAttributeIdFromColumnValue,
    isAttributeColumnValue,
} from "../../components/ProductListPage/utils";
import { ProductTypePickerDialog } from "../../components/ProductTypePickerDialog";
import {
    deleteFilterTab,
    getActiveFilters,
    getFilterOpts,
    getFilterQueryParam,
    getFiltersCurrentTab,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";
import { getAvailableProductKinds, getProductKindOpts } from "./utils";

interface ProductListProps {
    params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();

    const { queue } = useBackgroundTask();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings<ProductListColumns>(
        ListViews.PRODUCT_LIST
    );

    usePaginationReset(productListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const { data: initialFilterAttributes } = useInitialProductFilterAttributesQuery();

    const { data: initialFilterCategories } = useInitialProductFilterCategoriesQuery({
        variables: {
            categories: params.categories,
        },
        skip: !params.categories?.length,
    });

    const { data: initialFilterCollections } = useInitialProductFilterCollectionsQuery({
        variables: {
            collections: params.collections,
        },
        skip: !params.collections?.length,
    });

    const { data: initialFilterProductTypes } = useInitialProductFilterProductTypesQuery({
        variables: {
            productTypes: params.productTypes,
        },
        skip: !params.productTypes?.length,
    });

    const searchCategories = useCategorySearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 5,
        },
    });

    const searchCollections = useCollectionSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 5,
        },
    });

    const searchProductTypes = useProductTypeSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 5,
        },
    });

    const searchAttributes = useAttributeSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 10,
        },
    });

    const [focusedAttribute, setFocusedAttribute] = useState<string>();

    const searchAttributeValues = useAttributeValueSearch({
        variables: {
            id: focusedAttribute,
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 10,
        },
        skip: !focusedAttribute,
    });

    const warehouses = useWarehouseListQuery({
        variables: {
            first: 100,
        },
        skip: params.action !== "export",
    });

    const availableProductKinds = getAvailableProductKinds();

    const { availableChannels } = useAppChannel(false);

    const limitOpts = useShopLimitsQuery({
        variables: {
            productVariants: true,
        },
    });

    const selectedChannel = availableChannels.find((channel) => channel.slug === params.channel);

    useSortRedirects<ProductListUrlSortField>({
        params,
        defaultSortField: DEFAULT_SORT_KEY,
        urlFunc: productListUrl,
        resetToDefault: !canBeSorted(params.sort, !!selectedChannel),
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        ProductListUrlDialog,
        ProductListUrlQueryParams
    >(navigate, productListUrl, params);

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const countAllProducts = useProductCountQuery({
        skip: params.action !== "export",
    });

    const [exportProducts, exportProductsOpts] = useProductExportMutation({
        onCompleted: (data) => {
            if (data.exportProducts?.errors.length === 0) {
                notify({
                    text: intl.formatMessage({
                        id: "dPYqy0",
                        defaultMessage:
                            "We are currently exporting your requested CSV. As soon as it is available it will be sent to your email address",
                    }),
                    title: intl.formatMessage({
                        id: "5QKsu+",
                        defaultMessage: "Exporting CSV",
                        description: "waiting for export to end, header",
                    }),
                });
                queue(Task.EXPORT, {
                    id: data?.exportProducts?.exportFile?.id,
                });
                closeModal();
                reset();
            }
        },
    });

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: productListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            productListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleFilterTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(productListUrl());
    };

    const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const handleSort = (field: ProductListUrlSortField, attributeId?: string) =>
        navigate(
            productListUrl({
                ...params,
                ...getSortUrlVariables(field, params),
                attributeId,
                ...DEFAULT_INITIAL_PAGINATION_DATA,
            })
        );

    const kindOpts = getProductKindOpts(availableProductKinds, intl);
    
    const paginationState = createPaginationState(settings.rowNumber, params);
    
    const channelOpts = availableChannels
        ? mapNodeToChoice(availableChannels, (channel) => channel.slug)
        : null;
    
    const filter = getFilterVariables(params, !!selectedChannel);
    
    const sort = getSortQueryVariables(params, !!selectedChannel);
    
    const queryVariables = React.useMemo<
        Omit<ProductListQueryVariables, "hasChannel" | "hasSelectedAttributes">
    >(
        () => ({
            ...paginationState,
            filter,
            sort,
            channel: selectedChannel?.slug,
        }),
        [params, settings.rowNumber]
    );

    const filteredColumnIds = settings.columns
        .filter(isAttributeColumnValue)
        .map(getAttributeIdFromColumnValue);

    const { data, loading, refetch } = useProductListQuery({
        displayLoader: true,
        variables: {
            ...queryVariables,
            hasChannel: !!selectedChannel,
            hasSelectedAttributes: filteredColumnIds.length > 0,
        },
    });

    const availableInGridAttributesOpts = useAvailableInGridAttributesSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 5,
        },
    });
    
    const gridAttributes = useGridAttributesQuery({
        variables: { ids: filteredColumnIds },
        skip: filteredColumnIds.length === 0,
    });

    const [productBulkDelete, productBulkDeleteOpts] = useProductBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.productBulkDelete?.errors.length === 0) {
                closeModal();
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                reset();
                refetch();
                limitOpts.refetch();
            }
        },
    });

    const {
        loadMore: loadMoreDialogProductTypes,
        search: searchDialogProductTypes,
        result: searchDialogProductTypesOpts,
    } = useProductTypeSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const fetchMoreDialogProductTypes = {
        hasMore: searchDialogProductTypesOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchDialogProductTypesOpts.loading,
        onFetchMore: loadMoreDialogProductTypes,
    };

    const filterOpts = getFilterOpts(
        params,
        (mapEdgesToItems(initialFilterAttributes?.attributes) || []).filter(filterable),
        searchAttributeValues,
        {
            initial: mapEdgesToItems(initialFilterCategories?.categories) || [],
            search: searchCategories,
        },
        {
            initial: mapEdgesToItems(initialFilterCollections?.collections) || [],
            search: searchCollections,
        },
        {
            initial: mapEdgesToItems(initialFilterProductTypes?.productTypes) || [],
            search: searchProductTypes,
        },
        kindOpts,
        channelOpts
    );

    const paginationValues = usePaginator({
        pageInfo: data?.products?.pageInfo,
        paginationState,
        queryString: params,
    });

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <ProductListPage
                activeAttributeSortId={params.attributeId}
                sort={{
                    asc: params.asc,
                    sort: params.sort,
                }}
                onSort={handleSort}
                availableInGridAttributes={
                    mapEdgesToItems(availableInGridAttributesOpts.result?.data?.availableInGrid) || []
                }
                currencySymbol={selectedChannel?.currencyCode || ""}
                currentTab={currentTab}
                defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
                filterOpts={filterOpts}
                gridAttributes={mapEdgesToItems(gridAttributes?.data?.grid) || []}
                settings={settings}
                loading={availableInGridAttributesOpts.result.loading || gridAttributes.loading}
                hasMore={maybe(
                    () =>
                        availableInGridAttributesOpts.result.data.availableInGrid.pageInfo.hasNextPage,
                    false
                )}
                disabled={loading}
                limits={limitOpts.data?.shop.limits}
                products={mapEdgesToItems(data?.products)}
                onColumnQueryChange={availableInGridAttributesOpts.search}
                onFetchMore={availableInGridAttributesOpts.loadMore}
                onUpdateListSettings={updateListSettings}
                onAdd={() => openModal("create-product")}
                onAll={resetFilters}
                toolbar={
                    <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() =>
                            openModal("delete", {
                                ids: listElements,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
                isChecked={isSelected}
                selected={listElements.length}
                toggle={toggle}
                toggleAll={toggleAll}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onFilterAttributeFocus={setFocusedAttribute}
                onTabSave={() => openModal("save-search")}
                onTabDelete={() => openModal("delete-search")}
                onTabChange={handleTabChange}
                initialSearch={params.query || ""}
                tabs={getFilterTabs().map((tab) => tab.name)}
                onExport={() => openModal("export")}
                selectedChannelId={selectedChannel?.id}
                columnQuery={availableInGridAttributesOpts.query}
            />
    
            <ActionDialog
                open={params.action === "delete"}
                confirmButtonState={productBulkDeleteOpts.status}
                onClose={closeModal}
                onConfirm={() =>
                    productBulkDelete({
                        variables: { ids: params.ids },
                    })
                }
                title={intl.formatMessage({
                    id: "F4WdSO",
                    defaultMessage: "Delete Products",
                    description: "dialog header",
                })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        id="yDkmX7"
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
                        description="dialog content"
                        values={{
                            counter: params?.ids?.length,
                            displayQuantity: <strong>{params?.ids?.length}</strong>,
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
    
            <ProductExportDialog
                attributes={mapEdgesToItems(searchAttributes?.result?.data?.search) || []}
                hasMore={searchAttributes.result.data?.search?.pageInfo.hasNextPage}
                loading={
                    searchAttributes.result.loading || countAllProducts.loading || warehouses.loading
                }
                onFetch={searchAttributes.search}
                onFetchMore={searchAttributes.loadMore}
                open={params.action === "export"}
                confirmButtonState={exportProductsOpts.status}
                errors={exportProductsOpts.data?.exportProducts?.errors || []}
                productQuantity={{
                    all: countAllProducts.data?.products?.totalCount,
                    filter: data?.products?.totalCount,
                }}
                selectedProducts={listElements.length}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                channels={availableChannels}
                onClose={closeModal}
                onSubmit={(data) =>
                    exportProducts({
                        variables: {
                            input: {
                                ...data,
                                filter,
                                ids: listElements,
                            },
                        },
                    })
                }
            />
    
            <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleFilterTabSave}
            />
    
            <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleFilterTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
    
            <ProductTypePickerDialog
                confirmButtonState="success"
                open={params.action === "create-product"}
                productTypes={mapNodeToChoice(
                    mapEdgesToItems(searchDialogProductTypesOpts?.data?.search)
                )}
                fetchProductTypes={searchDialogProductTypes}
                fetchMoreProductTypes={fetchMoreDialogProductTypes}
                onClose={closeModal}
                onConfirm={(productTypeId) =>
                    navigate(
                        productAddUrl({
                            "product-type-id": productTypeId,
                        })
                    )
                }
            />
        </PaginatorContext.Provider>
    );
};

export default ProductList;

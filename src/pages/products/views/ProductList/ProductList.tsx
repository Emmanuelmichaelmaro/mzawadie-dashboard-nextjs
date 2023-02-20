// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/query";
import { Task } from "@mzawadie/containers/BackgroundTasks/types";
import {
    DEFAULT_INITIAL_PAGINATION_DATA,
    DEFAULT_INITIAL_SEARCH_DATA,
    defaultListSettings,
    ProductListColumns,
    commonMessages,
    maybe,
    ListViews,
} from "@mzawadie/core";
import useBackgroundTask from "@mzawadie/hooks/useBackgroundTask";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import {
    useAvailableInGridAttributesQuery,
    useGridAttributesQuery,
    useInitialProductFilterAttributesQuery,
    useInitialProductFilterCategoriesQuery,
    useInitialProductFilterCollectionsQuery,
    useInitialProductFilterProductTypesQuery,
    useProductCountQuery,
    useProductListQuery,
} from "@mzawadie/pages/products/queries";
import { ProductListVariables } from "@mzawadie/pages/products/types/ProductList";
import {
    productAddUrl,
    productListUrl,
    ProductListUrlDialog,
    ProductListUrlQueryParams,
    ProductListUrlSortField,
    productUrl,
} from "@mzawadie/pages/products/urls";
import { useWarehouseList } from "@mzawadie/pages/warehouses/queries";
import useAttributeSearch from "@mzawadie/searches/useAttributeSearch";
import useAttributeValueSearch from "@mzawadie/searches/useAttributeValueSearch";
import useCategorySearch from "@mzawadie/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/searches/useCollectionSearch";
import useProductTypeSearch from "@mzawadie/searches/useProductTypeSearch";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortUrlVariables } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductExportDialog } from "../../components/ProductExportDialog";
import { ProductListPage } from "../../components/ProductListPage";
import {
    getAttributeIdFromColumnValue,
    isAttributeColumnValue,
} from "../../components/ProductListPage/utils";
import { useProductBulkDeleteMutation, useProductExport } from "../../mutations";
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
    const paginate = usePaginator();

    const { queue } = useBackgroundTask();

    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

    const { updateListSettings, settings } = useListSettings<ProductListColumns>(
        ListViews.PRODUCT_LIST
    );

    usePaginationReset(productListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const { data: initialFilterAttributes } = useInitialProductFilterAttributesQuery({
        skip: !params.attributes?.length,
    });

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

    const warehouses = useWarehouseList({
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

    const [openModal, closeModal] = createDialogActionHandlers<
        ProductListUrlDialog,
        ProductListUrlQueryParams
    >(navigate, productListUrl, params);

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const countAllProducts = useProductCountQuery({
        skip: params.action !== "export",
    });

    const [exportProducts, exportProductsOpts] = useProductExport({
        onCompleted: (data) => {
            if (data.exportProducts.errors.length === 0) {
                notify({
                    text: intl.formatMessage({
                        defaultMessage:
                            "We are currently exporting your requested CSV. As soon as it is available it will be sent to your email address",
                        id: "dPYqy0",
                    }),
                    title: intl.formatMessage({
                        defaultMessage: "Exporting CSV",
                        id: "5QKsu+",
                        description: "waiting for export to end, header",
                    }),
                });
                queue(Task.EXPORT, {
                    id: data.exportProducts.exportFile.id,
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

    useEffect(() => {
        const sortWithQuery = ProductListUrlSortField.rank;
        const sortWithoutQuery =
            params.sort === ProductListUrlSortField.rank ? DEFAULT_SORT_KEY : params.sort;
        navigate(
            productListUrl({
                ...params,
                asc: params.query ? undefined : params.asc,
                sort: params.query ? sortWithQuery : sortWithoutQuery,
            })
        );
    }, [params.query]);

    useEffect(() => {
        if (!canBeSorted(params.sort, !!selectedChannel)) {
            navigate(
                productListUrl({
                    ...params,
                    sort: DEFAULT_SORT_KEY,
                })
            );
        }
    }, [params]);

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

    const queryVariables = React.useMemo<ProductListVariables>(
        () => ({
            ...paginationState,
            filter,
            sort,
            channel: selectedChannel?.slug,
        }),
        [params, settings.rowNumber]
    );

    // TODO: When channel is undefined we should skip detailed pricing listings
    const { data, loading, refetch } = useProductListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    function filterColumnIds(columns: ProductListColumns[]) {
        return columns.filter(isAttributeColumnValue).map(getAttributeIdFromColumnValue);
    }

    const availableInGridAttributes = useAvailableInGridAttributesQuery({
        variables: { first: 24 },
    });

    const gridAttributes = useGridAttributesQuery({
        variables: { ids: filterColumnIds(settings.columns) },
    });

    const [productBulkDelete, productBulkDeleteOpts] = useProductBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.productBulkDelete.errors.length === 0) {
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

    const filterOpts = getFilterOpts(
        params,
        mapEdgesToItems(initialFilterAttributes?.attributes) || [],
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

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.products?.pageInfo,
        paginationState,
        params
    );

    return (
        <>
            <ProductListPage
                activeAttributeSortId={params.attributeId}
                sort={{
                    asc: params.asc,
                    sort: params.sort,
                }}
                onSort={handleSort}
                availableInGridAttributes={
                    mapEdgesToItems(availableInGridAttributes?.data?.availableInGrid) || []
                }
                currencySymbol={selectedChannel?.currencyCode || ""}
                currentTab={currentTab}
                defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
                filterOpts={filterOpts}
                gridAttributes={mapEdgesToItems(gridAttributes?.data?.grid) || []}
                totalGridAttributes={maybe(
                    () => availableInGridAttributes.data.availableInGrid.totalCount,
                    0
                )}
                settings={settings}
                loading={availableInGridAttributes.loading || gridAttributes.loading}
                hasMore={maybe(
                    () => availableInGridAttributes.data.availableInGrid.pageInfo.hasNextPage,
                    false
                )}
                onAdd={() => navigate(productAddUrl())}
                disabled={loading}
                limits={limitOpts.data?.shop.limits}
                products={mapEdgesToItems(data?.products)}
                onFetchMore={() =>
                    availableInGridAttributes.loadMore(
                        (prev, next) => {
                            if (
                                prev.availableInGrid.pageInfo.endCursor ===
                                next.availableInGrid.pageInfo.endCursor
                            ) {
                                return prev;
                            }
                            return {
                                ...prev,
                                availableInGrid: {
                                    ...prev.availableInGrid,
                                    edges: [
                                        ...prev.availableInGrid.edges,
                                        ...next.availableInGrid.edges,
                                    ],
                                    pageInfo: next.availableInGrid.pageInfo,
                                },
                            };
                        },
                        {
                            after: availableInGridAttributes.data.availableInGrid.pageInfo.endCursor,
                        }
                    )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                pageInfo={pageInfo}
                onRowClick={(id) => () => navigate(productUrl(id))}
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
                channelsCount={availableChannels?.length}
                selectedChannelId={selectedChannel?.id}
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
                    defaultMessage: "Delete Products",
                    id: "F4WdSO",
                    description: "dialog header",
                })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
                        id="yDkmX7"
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
                hasMore={searchAttributes.result.data?.search.pageInfo.hasNextPage}
                loading={
                    searchAttributes.result.loading || countAllProducts.loading || warehouses.loading
                }
                onFetch={searchAttributes.search}
                onFetchMore={searchAttributes.loadMore}
                open={params.action === "export"}
                confirmButtonState={exportProductsOpts.status}
                errors={exportProductsOpts.data?.exportProducts.errors || []}
                productQuantity={{
                    all: countAllProducts.data?.products.totalCount,
                    filter: data?.products.totalCount,
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
        </>
    );
};

export default ProductList;

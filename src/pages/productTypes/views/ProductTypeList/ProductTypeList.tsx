// @ts-nocheck
import {
    DeleteFilterTabDialog,
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
    TypeDeleteWarningDialog,
} from "@mzawadie/components";
import { commonMessages, ListViews, maybe } from "@mzawadie/core";
import { useProductTypeBulkDeleteMutation, useProductTypeListQuery } from "@mzawadie/graphql";
import {
    useBulkActions,
    useListSettings,
    useNavigator,
    useNotifier,
    usePaginationReset,
    createPaginationState,
    usePaginator,
} from "@mzawadie/hooks";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { ProductTypeListPage } from "@mzawadie/pages/productTypes/components/ProductTypeListPage";
import { useProductTypeDelete } from "@mzawadie/pages/productTypes/hooks/useProductTypeDelete";
import {
    productTypeAddUrl,
    productTypeListUrl,
    ProductTypeListUrlDialog,
    ProductTypeListUrlQueryParams,
    productTypeUrl,
} from "@mzawadie/pages/productTypes/urls";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

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
import { getSortQueryVariables } from "./sort";

interface ProductTypeListProps {
    params: ProductTypeListUrlQueryParams;
}

export const ProductTypeList: React.FC<ProductTypeListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const paginate = usePaginator();

    const {
        isSelected,
        listElements: selectedProductTypes,
        reset,
        toggle,
        toggleAll,
    } = useBulkActions(params.ids);

    const { settings } = useListSettings(ListViews.PRODUCT_LIST);

    usePaginationReset(productTypeListUrl, params, settings.rowNumber);

    const paginationState = createPaginationState(settings.rowNumber, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );

    const { data, loading, refetch } = useProductTypeListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: productTypeListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        ProductTypeListUrlDialog,
        ProductTypeListUrlQueryParams
    >(navigate, productTypeListUrl, params);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            productTypeListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(productTypeListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.productTypes.pageInfo),
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, productTypeListUrl, params);

    const productTypeDeleteData = useProductTypeDelete({
        selectedTypes: selectedProductTypes,
        params,
    });

    const productTypesData = mapEdgesToItems(data?.productTypes);

    const [productTypeBulkDelete, productTypeBulkDeleteOpts] = useProductTypeBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.productTypeBulkDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                reset();
                refetch();
                navigate(
                    productTypeListUrl({
                        ...params,
                        action: undefined,
                        ids: undefined,
                    })
                );
            }
        },
    });

    const onProductTypeBulkDelete = () =>
        productTypeBulkDelete({
            variables: {
                ids: params.ids,
            },
        });

    return (
        <>
            <ProductTypeListPage
                currentTab={currentTab}
                filterOpts={getFilterOpts(params)}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onAll={resetFilters}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map((tab) => tab.name)}
                disabled={loading}
                productTypes={productTypesData}
                pageInfo={pageInfo}
                onAdd={() => navigate(productTypeAddUrl())}
                onBack={() => navigate(configurationMenuUrl)}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRowClick={(id) => () => navigate(productTypeUrl(id))}
                onSort={handleSort}
                isChecked={isSelected}
                selected={selectedProductTypes.length}
                sort={getSortParams(params)}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                    <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() =>
                            openModal("remove", {
                                ids: selectedProductTypes,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            />

            {productTypesData && (
                <TypeDeleteWarningDialog
                    {...productTypeDeleteData}
                    typesData={productTypesData}
                    typesToDelete={selectedProductTypes}
                    onClose={closeModal}
                    onDelete={onProductTypeBulkDelete}
                    deleteButtonState={productTypeBulkDeleteOpts.status}
                />
            )}

            <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabSave}
            />

            <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
        </>
    );
};

ProductTypeList.displayName = "ProductTypeList";

export default ProductTypeList;

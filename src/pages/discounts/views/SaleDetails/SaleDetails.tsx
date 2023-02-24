// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { AssignCategoryDialog as AssignCategoriesDialog } from "@mzawadie/components/AssignCategoryDialog";
import { AssignCollectionDialog } from "@mzawadie/components/AssignCollectionDialog";
import { AssignProductDialog } from "@mzawadie/components/AssignProductDialog";
import { AssignVariantDialog } from "@mzawadie/components/AssignVariantDialog";
import { ChannelsAvailabilityDialog } from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    PAGINATE_BY,
    commonMessages,
    sectionNames,
    maybe,
} from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useChannels from "@mzawadie/hooks/useChannels";
import useLocalPaginator, { useSectionLocalPaginationState } from "@mzawadie/hooks/useLocalPaginator";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import {
    SaleDetailsPage,
    SaleDetailsPageTab,
} from "@mzawadie/pages/discounts/components/SaleDetailsPage";
import {
    TypedSaleCataloguesAdd,
    TypedSaleCataloguesRemove,
    TypedSaleDelete,
    TypedSaleUpdate,
} from "@mzawadie/pages/discounts/mutations";
import { useSaleDetails } from "@mzawadie/pages/discounts/queries";
import { SaleCataloguesAdd } from "@mzawadie/pages/discounts/types/SaleCataloguesAdd";
import { SaleCataloguesRemove } from "@mzawadie/pages/discounts/types/SaleCataloguesRemove";
import { SaleDelete } from "@mzawadie/pages/discounts/types/SaleDelete";
import { SaleUpdate } from "@mzawadie/pages/discounts/types/SaleUpdate";
import {
    saleListUrl,
    saleUrl,
    SaleUrlDialog,
    SaleUrlQueryParams,
} from "@mzawadie/pages/discounts/urls";
import { productUrl, productVariantEditPath } from "@mzawadie/pages/products/urls";
import useCategorySearch from "@mzawadie/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/searches/useCollectionSearch";
import useProductSearch from "@mzawadie/searches/useProductSearch";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { Button } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createUpdateHandler } from "./handlers";
import { messages } from "./messages";
import { SALE_UPDATE_FORM_ID } from "./types";

interface SaleDetailsProps {
    id: string;
    params: SaleUrlQueryParams;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ id, params }) => {
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const navigate = useNavigator();
    const notify = useNotifier();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const intl = useIntl();
    const {
        loadMore: loadMoreCategories,
        search: searchCategories,
        result: searchCategoriesOpts,
    } = useCategorySearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });
    const {
        loadMore: loadMoreCollections,
        search: searchCollections,
        result: searchCollectionsOpts,
    } = useCollectionSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });
    const {
        loadMore: loadMoreProducts,
        search: searchProducts,
        result: searchProductsOpts,
    } = useProductSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const { availableChannels } = useAppChannel(false);

    const [activeTab, setActiveTab] = useState<SaleDetailsPageTab>(SaleDetailsPageTab.categories);
    const [paginationState, setPaginationState] = useSectionLocalPaginationState(
        PAGINATE_BY,
        activeTab
    );
    const paginate = useLocalPaginator(setPaginationState);
    const changeTab = (tab: SaleDetailsPageTab) => {
        reset();
        setActiveTab(tab);
    };

    const { data, loading } = useSaleDetails({
        displayLoader: true,
        variables: {
            id,
            ...paginationState,
        },
    });

    const [openModal, closeModal] = createDialogActionHandlers<SaleUrlDialog, SaleUrlQueryParams>(
        navigate,
        (params) => saleUrl(id, params),
        params
    );

    const allChannels: ChannelSaleData[] = createChannelsDataWithSaleDiscountPrice(
        data?.sale,
        availableChannels
    );
    const saleChannelsChoices = createSortedChannelsDataFromSale(data?.sale);

    const {
        channelListElements,
        channelsToggle,
        currentChannels,
        handleChannelsConfirm,
        handleChannelsModalClose,
        handleChannelsModalOpen,
        isChannelSelected,
        isChannelsModalOpen,
        setCurrentChannels,
        toggleAllChannels,
    } = useChannels(
        saleChannelsChoices,
        params?.action,
        {
            closeModal,
            openModal,
        },
        { formId: SALE_UPDATE_FORM_ID }
    );

    const [selectedChannel] = useLocalStorage("salesListChannel", "");

    const handleSaleDelete = (data: SaleDelete) => {
        if (data.saleDelete.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(messages.saleDetailsSaleDeleteDialog),
            });
            navigate(saleListUrl(), { replace: true });
        }
    };

    const handleSaleUpdate = (data: SaleUpdate) => {
        if (data.saleUpdate.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
        }
    };

    const handleCatalogueAdd = (data: SaleCataloguesAdd) => {
        if (data.saleCataloguesAdd.errors.length === 0) {
            closeModal();
        }
    };

    const handleCatalogueRemove = (data: SaleCataloguesRemove) => {
        if (data.saleCataloguesRemove.errors.length === 0) {
            closeModal();
            reset();
        }
    };

    const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

    return (
        <>
            {!!allChannels?.length && (
                <ChannelsAvailabilityDialog
                    isSelected={isChannelSelected}
                    disabled={!channelListElements.length}
                    channels={allChannels}
                    onChange={channelsToggle}
                    onClose={handleChannelsModalClose}
                    open={isChannelsModalOpen}
                    title={intl.formatMessage(messages.saleDetailsChannelAvailabilityDialogHeader)}
                    selected={channelListElements.length}
                    confirmButtonState="default"
                    onConfirm={handleChannelsConfirm}
                    toggleAll={toggleAllChannels}
                />
            )}
            <TypedSaleCataloguesRemove onCompleted={handleCatalogueRemove}>
                {(saleCataloguesRemove, saleCataloguesRemoveOpts) => (
                    <TypedSaleCataloguesAdd onCompleted={handleCatalogueAdd}>
                        {(saleCataloguesAdd, saleCataloguesAddOpts) => (
                            <TypedSaleUpdate onCompleted={handleSaleUpdate}>
                                {(saleUpdate, saleUpdateOpts) => (
                                    <TypedSaleDelete onCompleted={handleSaleDelete}>
                                        {(saleDelete, saleDeleteOpts) => {
                                            const tabPageInfo =
                                                activeTab === SaleDetailsPageTab.categories
                                                    ? maybe(() => data.sale.categories.pageInfo)
                                                    : activeTab === SaleDetailsPageTab.collections
                                                    ? maybe(() => data.sale.collections.pageInfo)
                                                    : activeTab === SaleDetailsPageTab.products
                                                    ? maybe(() => data.sale.products.pageInfo)
                                                    : maybe(() => data.sale.variants.pageInfo);

                                            const handleCategoriesUnassign = (ids: string[]) =>
                                                saleCataloguesRemove({
                                                    variables: {
                                                        ...paginationState,
                                                        id,
                                                        input: {
                                                            categories: ids,
                                                        },
                                                    },
                                                });

                                            const handleCollectionsUnassign = (ids: string[]) =>
                                                saleCataloguesRemove({
                                                    variables: {
                                                        ...paginationState,
                                                        id,
                                                        input: {
                                                            collections: ids,
                                                        },
                                                    },
                                                });

                                            const handleProductsUnassign = (ids: string[]) =>
                                                saleCataloguesRemove({
                                                    variables: {
                                                        ...paginationState,
                                                        id,
                                                        input: {
                                                            products: ids,
                                                        },
                                                    },
                                                });

                                            const handleVariantsUnassign = (ids: string[]) =>
                                                saleCataloguesRemove({
                                                    variables: {
                                                        ...paginationState,
                                                        id,
                                                        input: {
                                                            variants: ids,
                                                        },
                                                    },
                                                });

                                            const { loadNextPage, loadPreviousPage, pageInfo } =
                                                paginate(tabPageInfo, paginationState);

                                            const handleUpdate = createUpdateHandler(
                                                data?.sale,
                                                saleChannelsChoices,
                                                (variables) => saleUpdate({ variables })
                                            );
                                            const handleSubmit = createMetadataUpdateHandler(
                                                data?.sale,
                                                handleUpdate,
                                                (variables) => updateMetadata({ variables }),
                                                (variables) => updatePrivateMetadata({ variables })
                                            );

                                            return (
                                                <>
                                                    <WindowTitle
                                                        title={intl.formatMessage(sectionNames.sales)}
                                                    />
                                                    <SaleDetailsPage
                                                        sale={maybe(() => data.sale)}
                                                        allChannelsCount={allChannels?.length}
                                                        channelListings={currentChannels}
                                                        hasChannelChanged={
                                                            saleChannelsChoices?.length !==
                                                            currentChannels?.length
                                                        }
                                                        disabled={
                                                            loading || saleCataloguesRemoveOpts.loading
                                                        }
                                                        errors={
                                                            saleUpdateOpts.data?.saleUpdate.errors || []
                                                        }
                                                        selectedChannelId={selectedChannel}
                                                        pageInfo={pageInfo}
                                                        openChannelsModal={handleChannelsModalOpen}
                                                        onChannelsChange={setCurrentChannels}
                                                        onNextPage={loadNextPage}
                                                        onPreviousPage={loadPreviousPage}
                                                        onCategoryAssign={() =>
                                                            openModal("assign-category")
                                                        }
                                                        onCategoryClick={(id) => () =>
                                                            navigate(categoryUrl(id))}
                                                        onCollectionAssign={() =>
                                                            openModal("assign-collection")
                                                        }
                                                        onCollectionUnassign={(collectionId) =>
                                                            handleCollectionsUnassign([collectionId])
                                                        }
                                                        onCategoryUnassign={(categoryId) =>
                                                            handleCategoriesUnassign([categoryId])
                                                        }
                                                        onCollectionClick={(id) => () =>
                                                            navigate(collectionUrl(id))}
                                                        onProductAssign={() =>
                                                            openModal("assign-product")
                                                        }
                                                        onProductUnassign={(productId) =>
                                                            handleProductsUnassign([productId])
                                                        }
                                                        onProductClick={(id) => () =>
                                                            navigate(productUrl(id))}
                                                        onVariantAssign={() =>
                                                            openModal("assign-variant")
                                                        }
                                                        onVariantUnassign={(variantId) =>
                                                            handleVariantsUnassign([variantId])
                                                        }
                                                        onVariantClick={(productId, variantId) => () =>
                                                            navigate(
                                                                productVariantEditPath(
                                                                    productId,
                                                                    variantId
                                                                )
                                                            )}
                                                        activeTab={activeTab}
                                                        onBack={() => navigate(saleListUrl())}
                                                        onTabClick={changeTab}
                                                        onSubmit={handleSubmit}
                                                        onRemove={() => openModal("remove")}
                                                        saveButtonBarState={saleUpdateOpts.status}
                                                        categoryListToolbar={
                                                            <Button
                                                                onClick={() =>
                                                                    openModal("unassign-category", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignCategory}
                                                                />
                                                            </Button>
                                                        }
                                                        collectionListToolbar={
                                                            <Button
                                                                onClick={() =>
                                                                    openModal("unassign-collection", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignCollection}
                                                                />
                                                            </Button>
                                                        }
                                                        productListToolbar={
                                                            <Button
                                                                onClick={() =>
                                                                    openModal("unassign-product", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignProduct}
                                                                />
                                                            </Button>
                                                        }
                                                        variantListToolbar={
                                                            <Button
                                                                onClick={() =>
                                                                    openModal("unassign-variant", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignVariant}
                                                                />
                                                            </Button>
                                                        }
                                                        isChecked={isSelected}
                                                        selected={listElements.length}
                                                        toggle={toggle}
                                                        toggleAll={toggleAll}
                                                    />
                                                    <AssignVariantDialog
                                                        confirmButtonState={
                                                            saleCataloguesAddOpts.status
                                                        }
                                                        hasMore={
                                                            searchProductsOpts.data?.search.pageInfo
                                                                .hasNextPage
                                                        }
                                                        open={params.action === "assign-variant"}
                                                        onFetch={searchProducts}
                                                        onFetchMore={loadMoreProducts}
                                                        loading={searchProductsOpts.loading}
                                                        onClose={closeModal}
                                                        onSubmit={(variants) =>
                                                            saleCataloguesAdd({
                                                                variables: {
                                                                    ...paginationState,
                                                                    id,
                                                                    input: {
                                                                        variants: variants.map(
                                                                            (variant) => variant.id
                                                                        ),
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        products={mapEdgesToItems(
                                                            searchProductsOpts?.data?.search
                                                        )?.filter(
                                                            (suggestedProduct) => suggestedProduct.id
                                                        )}
                                                    />
                                                    <AssignProductDialog
                                                        confirmButtonState={
                                                            saleCataloguesAddOpts.status
                                                        }
                                                        hasMore={
                                                            searchProductsOpts.data?.search.pageInfo
                                                                .hasNextPage
                                                        }
                                                        open={params.action === "assign-product"}
                                                        onFetch={searchProducts}
                                                        onFetchMore={loadMoreProducts}
                                                        loading={searchProductsOpts.loading}
                                                        onClose={closeModal}
                                                        onSubmit={(products) =>
                                                            saleCataloguesAdd({
                                                                variables: {
                                                                    ...paginationState,
                                                                    id,
                                                                    input: {
                                                                        products,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        products={mapEdgesToItems(
                                                            searchProductsOpts?.data?.search
                                                        )?.filter(
                                                            (suggestedProduct) => suggestedProduct.id
                                                        )}
                                                    />
                                                    <AssignCategoriesDialog
                                                        categories={mapEdgesToItems(
                                                            searchCategoriesOpts?.data?.search
                                                        )?.filter(
                                                            (suggestedCategory) => suggestedCategory.id
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesAddOpts.status
                                                        }
                                                        hasMore={
                                                            searchCategoriesOpts.data?.search.pageInfo
                                                                .hasNextPage
                                                        }
                                                        open={params.action === "assign-category"}
                                                        onFetch={searchCategories}
                                                        onFetchMore={loadMoreCategories}
                                                        loading={searchCategoriesOpts.loading}
                                                        onClose={closeModal}
                                                        onSubmit={(categories) =>
                                                            saleCataloguesAdd({
                                                                variables: {
                                                                    ...paginationState,
                                                                    id,
                                                                    input: {
                                                                        categories,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <AssignCollectionDialog
                                                        collections={mapEdgesToItems(
                                                            searchCollectionsOpts?.data?.search
                                                        )?.filter(
                                                            (suggestedCategory) => suggestedCategory.id
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesAddOpts.status
                                                        }
                                                        hasMore={
                                                            searchCollectionsOpts.data?.search.pageInfo
                                                                .hasNextPage
                                                        }
                                                        open={params.action === "assign-collection"}
                                                        onFetch={searchCollections}
                                                        onFetchMore={loadMoreCollections}
                                                        loading={searchCollectionsOpts.loading}
                                                        onClose={closeModal}
                                                        onSubmit={(collections) =>
                                                            saleCataloguesAdd({
                                                                variables: {
                                                                    ...paginationState,
                                                                    id,
                                                                    input: {
                                                                        collections,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <ActionDialog
                                                        open={
                                                            params.action === "unassign-category" &&
                                                            canOpenBulkActionDialog
                                                        }
                                                        title={intl.formatMessage(
                                                            messages.saleDetailsUnassignCategoryDialogHeader
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesRemoveOpts.status
                                                        }
                                                        onClose={closeModal}
                                                        onConfirm={() =>
                                                            handleCategoriesUnassign(params.ids)
                                                        }
                                                    >
                                                        {canOpenBulkActionDialog && (
                                                            <DialogContentText>
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignCategoryDialog}
                                                                    values={{
                                                                        counter: params.ids.length,
                                                                        displayQuantity: (
                                                                            <strong>
                                                                                {params.ids.length}
                                                                            </strong>
                                                                        ),
                                                                    }}
                                                                />
                                                            </DialogContentText>
                                                        )}
                                                    </ActionDialog>
                                                    <ActionDialog
                                                        open={
                                                            params.action === "unassign-collection" &&
                                                            canOpenBulkActionDialog
                                                        }
                                                        title={intl.formatMessage(
                                                            messages.saleDetailsUnassignCollectionDialogHeader
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesRemoveOpts.status
                                                        }
                                                        onClose={closeModal}
                                                        onConfirm={() =>
                                                            handleCollectionsUnassign(params.ids)
                                                        }
                                                    >
                                                        {canOpenBulkActionDialog && (
                                                            <DialogContentText>
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignCollectionDialog}
                                                                    values={{
                                                                        counter: params.ids.length,
                                                                        displayQuantity: (
                                                                            <strong>
                                                                                {params.ids.length}
                                                                            </strong>
                                                                        ),
                                                                    }}
                                                                />
                                                            </DialogContentText>
                                                        )}
                                                    </ActionDialog>
                                                    <ActionDialog
                                                        open={
                                                            params.action === "unassign-product" &&
                                                            canOpenBulkActionDialog
                                                        }
                                                        title={intl.formatMessage(
                                                            messages.saleDetailsUnassignProductDialogHeader
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesRemoveOpts.status
                                                        }
                                                        onClose={closeModal}
                                                        onConfirm={() =>
                                                            handleProductsUnassign(params.ids)
                                                        }
                                                    >
                                                        {canOpenBulkActionDialog && (
                                                            <DialogContentText>
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignCategoryDialog}
                                                                    values={{
                                                                        counter: params.ids.length,
                                                                        displayQuantity: (
                                                                            <strong>
                                                                                {params.ids.length}
                                                                            </strong>
                                                                        ),
                                                                    }}
                                                                />
                                                            </DialogContentText>
                                                        )}
                                                    </ActionDialog>
                                                    <ActionDialog
                                                        open={
                                                            params.action === "unassign-variant" &&
                                                            canOpenBulkActionDialog
                                                        }
                                                        title={intl.formatMessage(
                                                            messages.saleDetailsUnassignVariantDialogHeader
                                                        )}
                                                        confirmButtonState={
                                                            saleCataloguesRemoveOpts.status
                                                        }
                                                        onClose={closeModal}
                                                        onConfirm={() =>
                                                            handleVariantsUnassign(params.ids)
                                                        }
                                                    >
                                                        {canOpenBulkActionDialog && (
                                                            <DialogContentText>
                                                                <FormattedMessage
                                                                    {...messages.saleDetailsUnassignVariantDialog}
                                                                    values={{
                                                                        counter: params.ids.length,
                                                                        displayQuantity: (
                                                                            <strong>
                                                                                {params.ids.length}
                                                                            </strong>
                                                                        ),
                                                                    }}
                                                                />
                                                            </DialogContentText>
                                                        )}
                                                    </ActionDialog>
                                                    <ActionDialog
                                                        open={params.action === "remove"}
                                                        title={intl.formatMessage(
                                                            messages.saleDetailsSaleDeleteDialogHeader
                                                        )}
                                                        confirmButtonState={saleDeleteOpts.status}
                                                        onClose={closeModal}
                                                        variant="delete"
                                                        onConfirm={() =>
                                                            saleDelete({
                                                                variables: { id },
                                                            })
                                                        }
                                                    >
                                                        <DialogContentText>
                                                            <FormattedMessage
                                                                {...messages.saleDetailsUnassignDialogDelete}
                                                                values={{
                                                                    saleName: (
                                                                        <strong>
                                                                            {maybe(
                                                                                () => data.sale.name,
                                                                                "..."
                                                                            )}
                                                                        </strong>
                                                                    ),
                                                                }}
                                                            />
                                                        </DialogContentText>
                                                    </ActionDialog>
                                                </>
                                            );
                                        }}
                                    </TypedSaleDelete>
                                )}
                            </TypedSaleUpdate>
                        )}
                    </TypedSaleCataloguesAdd>
                )}
            </TypedSaleCataloguesRemove>
        </>
    );
};
export default SaleDetails;
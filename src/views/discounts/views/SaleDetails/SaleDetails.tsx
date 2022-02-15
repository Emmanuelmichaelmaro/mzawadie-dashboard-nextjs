// @ts-nocheck
import { Button, DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import AssignCategoriesDialog from "@mzawadie/components/AssignCategoryDialog";
import AssignCollectionDialog from "@mzawadie/components/AssignCollectionDialog";
import AssignProductDialog from "@mzawadie/components/AssignProductDialog";
import ChannelsAvailabilityDialog from "@mzawadie/components/ChannelsAvailabilityDialog";
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
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { categoryUrl } from "@mzawadie/views/categories/urls";
import {
    ChannelSaleData,
    createChannelsDataWithSaleDiscountPrice,
    createSortedChannelsDataFromSale,
} from "@mzawadie/views/channels/utils";
import { collectionUrl } from "@mzawadie/views/collections/urls";
import SaleDetailsPage, {
    SaleDetailsPageTab,
} from "@mzawadie/views/discounts/components/SaleDetailsPage";
import {
    TypedSaleCataloguesAdd,
    TypedSaleCataloguesRemove,
    TypedSaleDelete,
    TypedSaleUpdate,
    useSaleChannelListingUpdate,
} from "@mzawadie/views/discounts/mutations";
import { useSaleDetails } from "@mzawadie/views/discounts/queries";
import { SaleCataloguesAdd } from "@mzawadie/views/discounts/types/SaleCataloguesAdd";
import { SaleCataloguesRemove } from "@mzawadie/views/discounts/types/SaleCataloguesRemove";
import { SaleDelete } from "@mzawadie/views/discounts/types/SaleDelete";
import { SaleUpdate } from "@mzawadie/views/discounts/types/SaleUpdate";
import {
    saleListUrl,
    saleUrl,
    SaleUrlDialog,
    SaleUrlQueryParams,
} from "@mzawadie/views/discounts/urls";
import { productUrl } from "@mzawadie/views/products/urls";
import useCategorySearch from "@mzawadie/views/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/views/searches/useCollectionSearch";
import useProductSearch from "@mzawadie/views/searches/useProductSearch";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createUpdateHandler } from "./handlers";

interface SaleDetailsProps {
    id: string;
    params: SaleUrlQueryParams;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ id, params }) => {
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const navigate = useNavigator();
    const paginate = usePaginator();
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

    const paginationState = createPaginationState(PAGINATE_BY, params);
    const changeTab = (tab: SaleDetailsPageTab) => {
        reset();
        navigate(
            saleUrl(id, {
                activeTab: tab,
            })
        );
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
    const saleChannelsChoices: ChannelSaleData[] = createSortedChannelsDataFromSale(data?.sale);

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
    } = useChannels(saleChannelsChoices, params?.action, {
        closeModal,
        openModal,
    });

    const [updateChannels, updateChannelsOpts] = useSaleChannelListingUpdate({});

    const [selectedChannel] = useLocalStorage("salesListChannel", "");

    const handleSaleDelete = (data: SaleDelete) => {
        if (data.saleDelete.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Removed sale",
                    id: "Z4L2cj",
                }),
            });
            navigate(saleListUrl(), true);
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
                    title={intl.formatMessage({
                        defaultMessage: "Manage Channel Availability",
                        id: "EM730i",
                    })}
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
                                                params.activeTab === SaleDetailsPageTab.categories
                                                    ? maybe(() => data.sale.categories.pageInfo)
                                                    : params.activeTab ===
                                                      SaleDetailsPageTab.collections
                                                    ? maybe(() => data.sale.collections.pageInfo)
                                                    : maybe(() => data.sale.products.pageInfo);

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

                                            const { loadNextPage, loadPreviousPage, pageInfo } =
                                                paginate(tabPageInfo, paginationState, params);

                                            const handleUpdate = createUpdateHandler(
                                                data?.sale,
                                                saleChannelsChoices,
                                                (variables) => saleUpdate({ variables }),
                                                updateChannels
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
                                                            loading ||
                                                            saleCataloguesRemoveOpts.loading ||
                                                            updateChannelsOpts.loading
                                                        }
                                                        errors={[
                                                            ...(saleUpdateOpts.data?.saleUpdate
                                                                .errors || []),
                                                            ...(updateChannelsOpts.data
                                                                ?.saleChannelListingUpdate.errors ||
                                                                []),
                                                        ]}
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
                                                        activeTab={params.activeTab}
                                                        onBack={() => navigate(saleListUrl())}
                                                        onTabClick={changeTab}
                                                        onSubmit={handleSubmit}
                                                        onRemove={() => openModal("remove")}
                                                        saveButtonBarState={saleUpdateOpts.status}
                                                        categoryListToolbar={
                                                            <Button
                                                                color="primary"
                                                                onClick={() =>
                                                                    openModal("unassign-category", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    defaultMessage="Unassign"
                                                                    description="unassign category from sale, button"
                                                                    id="1Iyetv"
                                                                />
                                                            </Button>
                                                        }
                                                        collectionListToolbar={
                                                            <Button
                                                                color="primary"
                                                                onClick={() =>
                                                                    openModal("unassign-collection", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    defaultMessage="Unassign"
                                                                    description="unassign collection from sale, button"
                                                                    id="EeqZKq"
                                                                />
                                                            </Button>
                                                        }
                                                        productListToolbar={
                                                            <Button
                                                                color="primary"
                                                                onClick={() =>
                                                                    openModal("unassign-product", {
                                                                        ids: listElements,
                                                                    })
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    defaultMessage="Unassign"
                                                                    description="unassign product from sale, button"
                                                                    id="JUYx66"
                                                                />
                                                            </Button>
                                                        }
                                                        isChecked={isSelected}
                                                        selected={listElements.length}
                                                        toggle={toggle}
                                                        toggleAll={toggleAll}
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
                                                                        products: products.map(
                                                                            (product) => product.id
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
                                                        title={intl.formatMessage({
                                                            defaultMessage:
                                                                "Unassign Categories From Sale",
                                                            id: "B5yE8S",
                                                            description: "dialog header",
                                                        })}
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
                                                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this category?} other{Are you sure you want to unassign {displayQuantity} categories?}}"
                                                                    id="GiJm1v"
                                                                    description="dialog content"
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
                                                        title={intl.formatMessage({
                                                            defaultMessage:
                                                                "Unassign Collections From Sale",
                                                            id: "OOfi2v",
                                                            description: "dialog header",
                                                        })}
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
                                                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this collection?} other{Are you sure you want to unassign {displayQuantity} collections?}}"
                                                                    id="UjoSZB"
                                                                    description="dialog content"
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
                                                        title={intl.formatMessage({
                                                            defaultMessage:
                                                                "Unassign Products From Sale",
                                                            id: "K1wrLB",
                                                            description: "dialog header",
                                                        })}
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
                                                                    defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
                                                                    id="AHK0K9"
                                                                    description="dialog content"
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
                                                        title={intl.formatMessage({
                                                            defaultMessage: "Delete Sale",
                                                            id: "1/oG76",
                                                            description: "dialog header",
                                                        })}
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
                                                                defaultMessage="Are you sure you want to delete {saleName}?"
                                                                id="rNzkIt"
                                                                description="dialog content"
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

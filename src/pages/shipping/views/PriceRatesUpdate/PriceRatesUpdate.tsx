// @ts-nocheck
import { ChannelsAvailabilityDialog } from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    PAGINATE_BY,
    sectionNames,
    commonMessages,
    MinMax,
} from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useChannels from "@mzawadie/hooks/useChannels";
import useLocalPaginator, { useLocalPaginationState } from "@mzawadie/hooks/useLocalPaginator";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getById, getByUnmatchingId } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import { DeleteShippingRateDialog } from "@mzawadie/pages/shipping/components/DeleteShippingRateDialog";
import { ShippingMethodProductsAddDialog } from "@mzawadie/pages/shipping/components/ShippingMethodProductsAddDialog";
import { ShippingZonePostalCodeRangeDialog } from "@mzawadie/pages/shipping/components/ShippingZonePostalCodeRangeDialog";
import { ShippingZoneRatesPage } from "@mzawadie/pages/shipping/components/ShippingZoneRatesPage";
import { ShippingZoneRateUpdateFormData } from "@mzawadie/pages/shipping/components/ShippingZoneRatesPage/types";
import { UnassignDialog } from "@mzawadie/pages/shipping/components/UnassignDialog";
import {
    getShippingMethodChannelVariables,
    getUpdateShippingPriceRateVariables,
} from "@mzawadie/pages/shipping/handlers";
import {
    useShippingMethodChannelListingUpdate,
    useShippingPriceExcludeProduct,
    useShippingPriceRemoveProductsFromExclude,
    useShippingRateDelete,
    useShippingRateUpdate,
} from "@mzawadie/pages/shipping/mutations";
import { useShippingZone } from "@mzawadie/pages/shipping/queries";
import {
    shippingPriceRatesEditUrl,
    ShippingRateUrlDialog,
    ShippingRateUrlQueryParams,
    shippingZoneUrl,
} from "@mzawadie/pages/shipping/urls";
import postalCodesReducer from "@mzawadie/pages/shipping/views/reducer";
import {
    filterPostalCodes,
    getPostalCodeRuleByMinMax,
    getRuleObject,
} from "@mzawadie/pages/shipping/views/utils";
import useProductSearch from "@mzawadie/searches/useProductSearch";
import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeEnum } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PRICE_RATES_UPDATE_FORM_ID } from "./consts";

export interface PriceRatesUpdateProps {
    id: string;
    rateId: string;
    params: ShippingRateUrlQueryParams;
}

export const PriceRatesUpdate: React.FC<PriceRatesUpdateProps> = ({ id, rateId, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const [paginationState, setPaginationState] = useLocalPaginationState(PAGINATE_BY);
    const paginate = useLocalPaginator(setPaginationState);

    const { data, loading, refetch } = useShippingZone({
        displayLoader: true,
        variables: { id, ...paginationState },
    });

    const channelsData = data?.shippingZone?.channels;

    const rate = data?.shippingZone?.shippingMethods?.find(getById(rateId));

    const {
        loadMore,
        search: productsSearch,
        result: productsSearchOpts,
    } = useProductSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });

    const [openModal, closeModal] = createDialogActionHandlers<
        ShippingRateUrlDialog,
        ShippingRateUrlQueryParams
    >(navigate, (params) => shippingPriceRatesEditUrl(id, rateId, params), params);

    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions([]);

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        rate?.excludedProducts.pageInfo,
        paginationState
    );

    const [updateShippingMethodChannelListing, updateShippingMethodChannelListingOpts] =
        useShippingMethodChannelListingUpdate({});

    const [unassignProduct, unassignProductOpts] = useShippingPriceRemoveProductsFromExclude({
        onCompleted: (data) => {
            if (data.shippingPriceRemoveProductFromExclude.errors.length === 0) {
                handleSuccess();
                refetch();
                closeModal();
            }
        },
    });

    const [assignProduct, assignProductOpts] = useShippingPriceExcludeProduct({
        onCompleted: (data) => {
            if (data.shippingPriceExcludeProducts.errors.length === 0) {
                handleSuccess();
                refetch();
                closeModal();
            }
        },
    });
    const shippingChannels = createShippingChannelsFromRate(rate?.channelListings);
    const allChannels = createSortedShippingChannels(channelsData);

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
        shippingChannels,
        params?.action,
        { closeModal, openModal },
        { formId: PRICE_RATES_UPDATE_FORM_ID }
    );

    const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate({});

    const handleSuccess = () => {
        notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
        });
    };
    const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
        onCompleted: (data) => {
            if (data.shippingPriceDelete.errors.length === 0) {
                handleSuccess();
                navigate(shippingZoneUrl(id));
            }
        },
    });

    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const [state, dispatch] = React.useReducer(postalCodesReducer, {
        codesToDelete: [],
        havePostalCodesChanged: false,
        inclusionType: rate?.postalCodeRules[0]?.inclusionType,
        originalCodes: [],
        postalCodeRules: rate?.postalCodeRules || [],
    });

    const postalCodeRulesLoaded =
        !loading &&
        !state.postalCodeRules?.length &&
        !state.codesToDelete?.length &&
        rate?.postalCodeRules?.length;

    if (postalCodeRulesLoaded) {
        dispatch({ postalCodeRules: rate.postalCodeRules });
    }

    const onPostalCodeInclusionChange = (inclusion: PostalCodeRuleInclusionTypeEnum) => {
        dispatch({
            codesToDelete: rate.postalCodeRules.map((code) => code.id),
            havePostalCodesChanged: true,
            inclusionType: inclusion,
            postalCodeRules: [],
        });
    };

    const updateData = async (formData: ShippingZoneRateUpdateFormData): Promise<unknown[]> => {
        const response = await updateShippingRate({
            variables: getUpdateShippingPriceRateVariables(
                formData,
                id,
                rateId,
                state.postalCodeRules,
                state.codesToDelete
            ),
        });

        dispatch({ codesToDelete: [] });

        const { errors } = response.data.shippingPriceUpdate;

        if (errors.length === 0) {
            handleSuccess();
            dispatch({ havePostalCodesChanged: false });
            updateShippingMethodChannelListing({
                variables: getShippingMethodChannelVariables(
                    rateId,
                    formData.orderValueRestricted,
                    formData.channelListings,
                    shippingChannels
                ),
            });
        }

        return errors;
    };

    const handleSubmit = createMetadataUpdateHandler(
        rate,
        updateData,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    const handleProductAssign = (ids: string[]) =>
        assignProduct({
            variables: { id: rateId, input: { products: ids } },
        });

    const handleProductUnassign = (ids: string[]) => {
        unassignProduct({
            variables: { id: rateId, products: ids },
        });
        reset();
    };

    const onPostalCodeAssign = (rule: MinMax) => {
        if (!state.originalCodes.length) {
            dispatch({ originalCodes: rate.postalCodeRules });
        }

        if (state.postalCodeRules.filter(getPostalCodeRuleByMinMax(rule)).length > 0) {
            closeModal();
            return;
        }

        const newCode = getRuleObject(rule, state.inclusionType);
        dispatch({
            havePostalCodesChanged: true,
            postalCodeRules: [...state.postalCodeRules, newCode],
        });
        closeModal();
    };

    const onPostalCodeUnassign = (code) => {
        if (code.id !== undefined) {
            dispatch({
                codesToDelete: [...state.codesToDelete, code.id],
                havePostalCodesChanged: true,
                postalCodeRules: state.postalCodeRules.filter(getByUnmatchingId(code.id)),
            });
        } else {
            dispatch({
                havePostalCodesChanged: true,
                postalCodeRules: filterPostalCodes(state.postalCodeRules, code),
            });
        }
    };

    const handleBack = () => navigate(shippingZoneUrl(id));

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
            {!!allChannels?.length && (
                <ChannelsAvailabilityDialog
                    isSelected={isChannelSelected}
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
            <DeleteShippingRateDialog
                confirmButtonState={deleteShippingRateOpts.status}
                onClose={closeModal}
                handleConfirm={() =>
                    deleteShippingRate({
                        variables: {
                            id: rateId,
                        },
                    })
                }
                open={params.action === "remove"}
                name={rate?.name}
            />
            <UnassignDialog
                open={params.action === "unassign-product" && !!listElements.length}
                idsLength={listElements.length}
                confirmButtonState={unassignProductOpts.status}
                closeModal={closeModal}
                onConfirm={() => handleProductUnassign(listElements)}
            />
            <ShippingMethodProductsAddDialog
                confirmButtonState={assignProductOpts.status}
                loading={productsSearchOpts.loading}
                open={params.action === "assign-product"}
                hasMore={productsSearchOpts.data?.search?.pageInfo.hasNextPage}
                products={mapEdgesToItems(productsSearchOpts?.data?.search)?.filter(
                    (suggestedProduct) => suggestedProduct.id
                )}
                onClose={closeModal}
                onFetch={productsSearch}
                onFetchMore={loadMore}
                onSubmit={handleProductAssign}
            />
            <ShippingZoneRatesPage
                formId={PRICE_RATES_UPDATE_FORM_ID}
                allChannelsCount={allChannels?.length}
                shippingChannels={currentChannels}
                disabled={
                    loading ||
                    updateShippingRateOpts?.status === "loading" ||
                    updateShippingMethodChannelListingOpts?.status === "loading" ||
                    unassignProductOpts?.status === "loading" ||
                    assignProductOpts?.status === "loading"
                }
                hasChannelChanged={shippingChannels?.length !== currentChannels?.length}
                havePostalCodesChanged={state.havePostalCodesChanged}
                saveButtonBarState={updateShippingRateOpts.status}
                onDelete={() => openModal("remove")}
                onSubmit={handleSubmit}
                onBack={handleBack}
                rate={rate}
                errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
                channelErrors={
                    updateShippingMethodChannelListingOpts?.data?.shippingMethodChannelListingUpdate
                        ?.errors || []
                }
                openChannelsModal={handleChannelsModalOpen}
                onChannelsChange={setCurrentChannels}
                onProductUnassign={handleProductUnassign}
                onProductAssign={() => openModal("assign-product")}
                variant={ShippingMethodTypeEnum.PRICE}
                isChecked={isSelected}
                selected={listElements.length}
                toggle={toggle}
                toggleAll={toggleAll}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
                toolbar={
                    <Button onClick={() => openModal("unassign-product")}>
                        <FormattedMessage
                            defaultMessage="Unassign"
                            id="YdeHZX"
                            description="unassign products from shipping method, button"
                        />
                    </Button>
                }
                onPostalCodeInclusionChange={onPostalCodeInclusionChange}
                onPostalCodeAssign={() => openModal("add-range")}
                onPostalCodeUnassign={onPostalCodeUnassign}
                postalCodeRules={state.postalCodeRules}
            />
            <ShippingZonePostalCodeRangeDialog
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={(code) => onPostalCodeAssign(code)}
                open={params.action === "add-range"}
            />
        </>
    );
};

export default PriceRatesUpdate;

// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import NotFoundPage from "@mzawadie/components/NotFoundPage";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    PAGINATE_BY,
    commonMessages,
    findValueInEnum,
    getStringOrPlaceholder,
} from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { createPaginationState } from "@mzawadie/hooks/usePaginator";
import useShop from "@mzawadie/hooks/useShop";
import { CountryCode } from "@mzawadie/types/globalTypes";
import { arrayDiff } from "@mzawadie/utils/arrays";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { getById } from "@mzawadie/views/orders/components/OrderReturnPage/utils";
import useWarehouseSearch from "@mzawadie/views/searches/useWarehouseSearch";
import DeleteShippingRateDialog from "@mzawadie/views/shipping/components/DeleteShippingRateDialog";
import ShippingZoneAddWarehouseDialog from "@mzawadie/views/shipping/components/ShippingZoneAddWarehouseDialog";
import ShippingZoneCountriesAssignDialog from "@mzawadie/views/shipping/components/ShippingZoneCountriesAssignDialog";
import {
    useShippingRateDelete,
    useShippingZoneDelete,
    useShippingZoneUpdate,
} from "@mzawadie/views/shipping/mutations";
import { useWarehouseCreate } from "@mzawadie/views/warehouses/mutations";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZoneDetailsPage from "../../components/ShippingZoneDetailsPage";
import { FormData } from "../../components/ShippingZoneDetailsPage/types";
import { useShippingZone } from "../../queries";
import {
    shippingPriceRatesEditUrl,
    shippingPriceRatesUrl,
    shippingWeightRatesEditUrl,
    shippingWeightRatesUrl,
    shippingZonesListUrl,
    shippingZoneUrl,
    ShippingZoneUrlDialog,
    ShippingZoneUrlQueryParams,
} from "../../urls";

export interface ShippingZoneDetailsProps {
    id: string;
    params: ShippingZoneUrlQueryParams;
}

const ShippingZoneDetails: React.FC<ShippingZoneDetailsProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    const paginationState = createPaginationState(PAGINATE_BY, params);

    const {
        result: searchWarehousesOpts,
        loadMore,
        search,
    } = useWarehouseSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const { data, loading } = useShippingZone({
        displayLoader: true,
        variables: { id, ...paginationState },
    });
    const { availableChannels, channel } = useAppChannel(false);

    const [openModal, closeModal] = createDialogActionHandlers<
        ShippingZoneUrlDialog,
        ShippingZoneUrlQueryParams
    >(navigate, (params) => shippingZoneUrl(id, params), params);
    const rate = data?.shippingZone?.shippingMethods?.find(getById(params.id));

    const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
        onCompleted: (data) => {
            if (data.shippingPriceDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
            }
        },
    });

    const [deleteShippingZone, deleteShippingZoneOpts] = useShippingZoneDelete({
        onCompleted: (data) => {
            if (data.shippingZoneDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                navigate(shippingZonesListUrl(), true);
            }
        },
    });

    const [updateShippingZone, updateShippingZoneOpts] = useShippingZoneUpdate({
        onCompleted: (data) => {
            if (data.shippingZoneUpdate.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
            }
        },
    });

    const [createWarehouse, createWarehouseOpts] = useWarehouseCreate({
        onCompleted: (data) => {
            if (data.createWarehouse.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
            }
        },
    });

    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const updateData = async (submitData: FormData) => {
        const warehouseDiff = arrayDiff(
            data.shippingZone.warehouses.map((warehouse) => warehouse.id),
            submitData.warehouses
        );

        const channelsDiff = arrayDiff(
            data.shippingZone.channels.map((channel) => channel.id),
            submitData.channels
        );

        const result = await updateShippingZone({
            variables: {
                id,
                input: {
                    addWarehouses: warehouseDiff.added,
                    addChannels: channelsDiff.added,
                    removeChannels: channelsDiff.removed,
                    description: submitData.description,
                    name: submitData.name,
                    removeWarehouses: warehouseDiff.removed,
                },
            },
        });

        return result.data.shippingZoneUpdate.errors;
    };

    const handleSubmit = createMetadataUpdateHandler(
        data?.shippingZone,
        updateData,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    if (data?.shippingZone === null) {
        return <NotFoundPage onBack={() => navigate(shippingZonesListUrl())} />;
    }

    return (
        <>
            <ShippingZoneDetailsPage
                disabled={loading}
                errors={updateShippingZoneOpts.data?.shippingZoneUpdate.errors || []}
                onBack={() => navigate(shippingZonesListUrl())}
                onCountryAdd={() => openModal("assign-country")}
                onCountryRemove={(code) =>
                    openModal("unassign-country", {
                        id: code,
                    })
                }
                onDelete={() => openModal("remove")}
                onPriceRateAdd={() => navigate(shippingPriceRatesUrl(id))}
                onPriceRateEdit={(rateId) => navigate(shippingPriceRatesEditUrl(id, rateId))}
                onRateRemove={(rateId) =>
                    openModal("remove-rate", {
                        id: rateId,
                    })
                }
                onSubmit={handleSubmit}
                allChannels={availableChannels}
                onWarehouseAdd={() => openModal("add-warehouse")}
                onWeightRateAdd={() => navigate(shippingWeightRatesUrl(id))}
                onWeightRateEdit={(rateId) => navigate(shippingWeightRatesEditUrl(id, rateId))}
                saveButtonBarState={updateShippingZoneOpts.status}
                shippingZone={data?.shippingZone}
                warehouses={mapEdgesToItems(searchWarehousesOpts?.data?.search) || []}
                hasMore={searchWarehousesOpts.data?.search?.pageInfo?.hasNextPage}
                loading={searchWarehousesOpts.loading}
                onFetchMore={loadMore}
                onSearchChange={search}
                selectedChannelId={channel?.id}
            />
            <DeleteShippingRateDialog
                confirmButtonState={deleteShippingRateOpts.status}
                onClose={closeModal}
                handleConfirm={() =>
                    deleteShippingRate({
                        variables: {
                            id: params.id,
                        },
                    })
                }
                name={rate?.name}
                open={params.action === "remove-rate"}
            />
            <ActionDialog
                confirmButtonState={deleteShippingZoneOpts.status}
                onClose={closeModal}
                onConfirm={() =>
                    deleteShippingZone({
                        variables: {
                            id,
                        },
                    })
                }
                open={params.action === "remove"}
                title={intl.formatMessage({
                    defaultMessage: "Delete Shipping Zone",
                    id: "k3EI/U",
                    description: "dialog header",
                })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {name}?"
                        description="delete shipping zone"
                        id="LsgHmZ"
                        values={{
                            name: <strong>{getStringOrPlaceholder(data?.shippingZone.name)}</strong>,
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
            <ShippingZoneCountriesAssignDialog
                confirmButtonState={updateShippingZoneOpts.status}
                countries={shop?.countries || []}
                initial={data?.shippingZone?.countries.map((country) => country.code) || []}
                isDefault={data?.shippingZone?.default}
                onClose={closeModal}
                onConfirm={(formData) =>
                    updateShippingZone({
                        variables: {
                            id,
                            input: {
                                countries: formData.countries,
                                default: formData.restOfTheWorld,
                            },
                        },
                    })
                }
                open={params.action === "assign-country"}
            />
            <ActionDialog
                confirmButtonState={updateShippingZoneOpts.status}
                onClose={closeModal}
                onConfirm={() =>
                    updateShippingZone({
                        variables: {
                            id,
                            input: {
                                countries: data.shippingZone.countries
                                    .filter((country) => country.code !== params.id)
                                    .map((country) => country.code),
                            },
                        },
                    })
                }
                open={params.action === "unassign-country"}
                title={intl.formatMessage({
                    defaultMessage: "Delete from Shipping Zone",
                    id: "PNE6Jk",
                    description: "unassign country, dialog header",
                })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {countryName} from this shipping zone?"
                        id="3iznRW"
                        description="unassign country"
                        values={{
                            countryName: (
                                <strong>
                                    {getStringOrPlaceholder(
                                        data?.shippingZone?.countries.find(
                                            (country) => country.code === params.id
                                        )?.country
                                    )}
                                </strong>
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
            <ShippingZoneAddWarehouseDialog
                countries={shop?.countries || []}
                disabled={createWarehouseOpts.loading}
                open={params.action === "add-warehouse"}
                confirmButtonState={createWarehouseOpts.status}
                errors={createWarehouseOpts.data?.createWarehouse.errors || []}
                onClose={closeModal}
                onSubmit={(data) =>
                    createWarehouse({
                        variables: {
                            input: {
                                address: {
                                    companyName: data.companyName,
                                    city: data.city,
                                    cityArea: data.cityArea,
                                    country: findValueInEnum(data.country, CountryCode),
                                    countryArea: data.countryArea,
                                    phone: data.phone,
                                    postalCode: data.postalCode,
                                    streetAddress1: data.streetAddress1,
                                    streetAddress2: data.streetAddress2,
                                },
                                name: data.name,
                            },
                        },
                    })
                }
            />
        </>
    );
};
export default ShippingZoneDetails;

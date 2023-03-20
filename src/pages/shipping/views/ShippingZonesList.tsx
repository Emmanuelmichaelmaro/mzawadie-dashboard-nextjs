// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import {
    commonMessages,
    extractMutationErrors,
    getStringOrPlaceholder,
    maybe,
    ListViews,
} from "@mzawadie/core";
import {
    useBulkDeleteShippingZoneMutation,
    useDeleteShippingZoneMutation,
    useShippingZonesQuery,
    useUpdateDefaultWeightUnitMutation,
} from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import useShop from "@mzawadie/hooks/useShop";
import { useUser } from "@mzawadie/pages/auth";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ShippingZonesListPage } from "../components/ShippingZonesListPage";
import {
    shippingZoneAddUrl,
    shippingZonesListUrl,
    ShippingZonesListUrlDialog,
    ShippingZonesListUrlQueryParams,
    shippingZoneUrl,
} from "../urls";

interface ShippingZonesListProps {
    params: ShippingZonesListUrlQueryParams;
}

export const ShippingZonesList: React.FC<ShippingZonesListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const shop = useShop();
    const { user } = useUser();

    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

    const { updateListSettings, settings } = useListSettings(ListViews.SHIPPING_METHODS_LIST);

    usePaginationReset(shippingZonesListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const paginationState = createPaginationState(settings.rowNumber, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
        }),
        [params, settings.rowNumber]
    );

    const [openModal, closeModal] = createDialogActionHandlers<
        ShippingZonesListUrlDialog,
        ShippingZonesListUrlQueryParams
    >(navigate, shippingZonesListUrl, params);

    const { data, loading, refetch } = useShippingZonesQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const [deleteShippingZone, deleteShippingZoneOpts] = useDeleteShippingZoneMutation({
        onCompleted: (data) => {
            if (data.shippingZoneDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
                refetch();
            }
        },
    });

    const [updateDefaultWeightUnit, updateDefaultWeightUnitOpts] = useUpdateDefaultWeightUnitMutation({
        onCompleted: (data) => {
            if (data.shopSettingsUpdate.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const [bulkDeleteShippingZone, bulkDeleteShippingZoneOpts] = useBulkDeleteShippingZoneMutation({
        onCompleted: (data) => {
            if (data.shippingZoneBulkDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
                reset();
                refetch();
            }
        },
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.shippingZones.pageInfo),
        paginationState,
        params
    );

    return (
        <>
            <ShippingZonesListPage
                defaultWeightUnit={shop?.defaultWeightUnit}
                settings={settings}
                disabled={
                    loading || deleteShippingZoneOpts.loading || updateDefaultWeightUnitOpts.loading
                }
                shippingZones={mapEdgesToItems(data?.shippingZones)}
                pageInfo={pageInfo}
                onAdd={() => navigate(shippingZoneAddUrl)}
                onBack={() => navigate(configurationMenuUrl)}
                onUpdateListSettings={updateListSettings}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRemove={(id) =>
                    openModal("remove", {
                        id,
                    })
                }
                onRowClick={(id) => () => navigate(shippingZoneUrl(id))}
                onSubmit={(unit) =>
                    extractMutationErrors(
                        updateDefaultWeightUnit({
                            variables: { unit },
                        })
                    )
                }
                isChecked={isSelected}
                selected={listElements.length}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                    <IconButton
                        data-test-id="delete-selected-elements-icon"
                        variant="secondary"
                        color="primary"
                        onClick={() =>
                            openModal("remove-many", {
                                ids: listElements,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
                userPermissions={user?.userPermissions || []}
            />

            <ActionDialog
                open={params.action === "remove"}
                confirmButtonState={deleteShippingZoneOpts.status}
                variant="delete"
                title={intl.formatMessage({
                    defaultMessage: "Delete Shipping Zone",
                    id: "k3EI/U",
                    description: "dialog header",
                })}
                onClose={closeModal}
                onConfirm={() =>
                    deleteShippingZone({
                        variables: { id: params.id },
                    })
                }
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {shippingZoneName} shipping zone?"
                        id="qf/m5l"
                        values={{
                            shippingZoneName: (
                                <strong>
                                    {getStringOrPlaceholder(
                                        mapEdgesToItems(data?.shippingZones)?.find(getById(params.id))
                                            ?.name
                                    )}
                                </strong>
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>

            <ActionDialog
                open={params.action === "remove-many"}
                confirmButtonState={bulkDeleteShippingZoneOpts.status}
                variant="delete"
                title={intl.formatMessage({
                    defaultMessage: "Delete Shipping Zones",
                    id: "cpZLRH",
                    description: "dialog header",
                })}
                onClose={closeModal}
                onConfirm={() =>
                    bulkDeleteShippingZone({
                        variables: { ids: params.ids },
                    })
                }
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this shipping zone?} other{Are you sure you want to delete {displayQuantity} shipping zones?}}"
                        id="C9pcQx"
                        description="dialog content"
                        values={{
                            counter: params.ids?.length,
                            displayQuantity: (
                                <strong>{getStringOrPlaceholder(params.ids?.length.toString())}</strong>
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};

ShippingZonesList.displayName = "ShippingZonesList";

export default ShippingZonesList;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import NotFoundPage from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    commonMessages,
    findValueInEnum,
    getMutationStatus,
    getStringOrPlaceholder,
} from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { CountryCode } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import { shippingZoneUrl } from "@mzawadie/views/shipping/urls";
import WarehouseDeleteDialog from "@mzawadie/views/warehouses/components/WarehouseDeleteDialog";
import WarehouseDetailsPage, {
    WarehouseDetailsPageFormData,
} from "@mzawadie/views/warehouses/components/WarehouseDetailsPage";
import { useWarehouseDelete, useWarehouseUpdate } from "@mzawadie/views/warehouses/mutations";
import { useWarehouseDetails } from "@mzawadie/views/warehouses/queries";
import {
    warehouseListUrl,
    warehouseUrl,
    WarehouseUrlQueryParams,
} from "@mzawadie/views/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

export interface WarehouseDetailsProps {
    id: string;
    params: WarehouseUrlQueryParams;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({ id, params }) => {
    const intl = useIntl();
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const { data, loading } = useWarehouseDetails({
        displayLoader: true,
        variables: { id },
    });
    const [updateWarehouse, updateWarehouseOpts] = useWarehouseUpdate({
        onCompleted: (data) => {
            if (data.updateWarehouse.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });
    const updateWarehouseTransitionState = getMutationStatus(updateWarehouseOpts);

    const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDelete({
        onCompleted: (data) => {
            if (data.deleteWarehouse.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                navigate(warehouseListUrl());
            }
        },
    });
    const deleteWarehouseTransitionState = getMutationStatus(deleteWarehouseOpts);

    const [openModal, closeModal] = createDialogActionHandlers(
        navigate,
        (params) => warehouseUrl(id, params),
        params
    );

    if (data?.warehouse === null) {
        return <NotFoundPage onBack={() => navigate(warehouseListUrl())} />;
    }

    const handleSubmit = async (data: WarehouseDetailsPageFormData) => {
        const result = await updateWarehouse({
            variables: {
                id,
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
        });

        return result.data.updateWarehouse.errors;
    };
    return (
        <>
            <WindowTitle title={data?.warehouse?.name} />
            <WarehouseDetailsPage
                countries={shop?.countries || []}
                disabled={loading || updateWarehouseOpts.loading}
                errors={updateWarehouseOpts.data?.updateWarehouse.errors || []}
                saveButtonBarState={updateWarehouseTransitionState}
                warehouse={data?.warehouse}
                onBack={() => navigate(warehouseListUrl())}
                onDelete={() => openModal("delete")}
                onShippingZoneClick={(id) => navigate(shippingZoneUrl(id))}
                onSubmit={handleSubmit}
            />
            <WarehouseDeleteDialog
                confirmButtonState={deleteWarehouseTransitionState}
                name={getStringOrPlaceholder(data?.warehouse?.name)}
                onClose={closeModal}
                onConfirm={() =>
                    deleteWarehouse({
                        variables: { id },
                    })
                }
                open={params.action === "delete"}
            />
        </>
    );
};

WarehouseDetails.displayName = "WarehouseDetails";
export default WarehouseDetails;

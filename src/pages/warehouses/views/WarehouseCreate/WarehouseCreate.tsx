// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages } from "@mzawadie/core";
import { extractMutationErrors, findValueInEnum, getMutationStatus } from "@mzawadie/core";
import { CountryCode, useWarehouseCreateMutation } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import {
    WarehouseCreatePage,
    WarehouseCreatePageFormData,
} from "@mzawadie/pages/warehouses/components/WarehouseCreatePage";
import { warehouseUrl } from "@mzawadie/pages/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

const WarehouseCreate: React.FC = () => {
    const intl = useIntl();
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();

    const [createWarehouse, createWarehouseOpts] = useWarehouseCreateMutation({
        onCompleted: (data) => {
            if (data.createWarehouse?.errors.length === 0) {
                navigate(warehouseUrl(data.createWarehouse?.warehouse?.id));
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const createWarehouseTransitionState = getMutationStatus(createWarehouseOpts);

    const handleSubmit = (data: WarehouseCreatePageFormData) =>
        extractMutationErrors(
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
        );

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    id: "GhcypC",
                    defaultMessage: "Create Warehouse",
                    description: "header",
                })}
            />

            <WarehouseCreatePage
                countries={shop?.countries || []}
                disabled={createWarehouseOpts.loading}
                errors={createWarehouseOpts.data?.createWarehouse?.errors || []}
                saveButtonBarState={createWarehouseTransitionState}
                onSubmit={handleSubmit}
            />
        </>
    );
};

WarehouseCreate.displayName = "WarehouseCreate";

export default WarehouseCreate;

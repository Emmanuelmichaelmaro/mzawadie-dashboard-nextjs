// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, findValueInEnum, getMutationStatus } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { CountryCode } from "@mzawadie/types/globalTypes";
import WarehouseCreatePage from "@mzawadie/views/warehouses/components/WarehouseCreatePage";
import { useWarehouseCreate } from "@mzawadie/views/warehouses/mutations";
import { warehouseListUrl, warehouseUrl } from "@mzawadie/views/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

const WarehouseCreate: React.FC = () => {
    const intl = useIntl();
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const [createWarehouse, createWarehouseOpts] = useWarehouseCreate({
        onCompleted: (data) => {
            if (data.createWarehouse.errors.length === 0) {
                navigate(warehouseUrl(data.createWarehouse.warehouse.id));
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });
    const createWarehouseTransitionState = getMutationStatus(createWarehouseOpts);

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create Warehouse",
                    id: "GhcypC",
                    description: "header",
                })}
            />
            <WarehouseCreatePage
                countries={shop?.countries || []}
                disabled={createWarehouseOpts.loading}
                errors={createWarehouseOpts.data?.createWarehouse.errors || []}
                saveButtonBarState={createWarehouseTransitionState}
                onBack={() => navigate(warehouseListUrl())}
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

WarehouseCreate.displayName = "WarehouseCreate";
export default WarehouseCreate;

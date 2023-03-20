// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages } from "@mzawadie/core";
import {
    useCreateCustomerAddressMutation,
    useCustomerAddressesQuery,
    useRemoveCustomerAddressMutation,
    useSetCustomerDefaultAddressMutation,
    useUpdateCustomerAddressMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerAddressDialog } from "../components/CustomerAddressDialog";
import { CustomerAddressListPage } from "../components/CustomerAddressListPage";
import {
    customerAddressesUrl,
    CustomerAddressesUrlDialog,
    CustomerAddressesUrlQueryParams,
    customerUrl,
} from "../urls";

interface CustomerAddressesProps {
    id: string;
    params: CustomerAddressesUrlQueryParams;
}

const CustomerAddresses: React.FC<CustomerAddressesProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const [openModal, closeModal] = createDialogActionHandlers<
        CustomerAddressesUrlDialog,
        CustomerAddressesUrlQueryParams
    >(navigate, (params) => customerAddressesUrl(id, params), params);

    const [setCustomerDefaultAddress] = useSetCustomerDefaultAddressMutation({
        onCompleted: (data) => {
            if (data.addressSetDefault.errors.length === 0) {
                closeModal();
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const [createCustomerAddress, createCustomerAddressOpts] = useCreateCustomerAddressMutation({
        onCompleted: (data) => {
            if (data.addressCreate.errors.length === 0) {
                closeModal();
            }
        },
    });

    const [updateCustomerAddress, updateCustomerAddressOpts] = useUpdateCustomerAddressMutation({
        onCompleted: (data) => {
            if (data.addressUpdate.errors.length === 0) {
                closeModal();
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const [removeCustomerAddress, removeCustomerAddressOpts] = useRemoveCustomerAddressMutation({
        onCompleted: (data) => {
            if (data.addressDelete.errors.length === 0) {
                closeModal();
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const customerData = useCustomerAddressesQuery({
        displayLoader: true,
        variables: {
            id,
        },
    });

    const countryChoices = shop?.countries || [];

    return (
        <>
            <WindowTitle title={customerData?.data?.user.email} />

            <CustomerAddressListPage
                customer={customerData?.data?.user}
                disabled={customerData?.loading}
                onAdd={() => openModal("add")}
                onBack={() => navigate(customerUrl(id))}
                onEdit={(id) =>
                    openModal("edit", {
                        id,
                    })
                }
                onRemove={(id) =>
                    openModal("remove", {
                        id,
                    })
                }
                onSetAsDefault={(addressId, type) =>
                    setCustomerDefaultAddress({
                        variables: { addressId, type, userId: id },
                    })
                }
            />

            <CustomerAddressDialog
                address={undefined}
                confirmButtonState={createCustomerAddressOpts.status}
                countries={countryChoices}
                errors={createCustomerAddressOpts?.data?.addressCreate.errors || []}
                open={params.action === "add"}
                variant="create"
                onClose={closeModal}
                onConfirm={(input) =>
                    createCustomerAddress({
                        variables: {
                            id,
                            input,
                        },
                    })
                }
            />

            <CustomerAddressDialog
                address={customerData?.data?.user.addresses.find((addr) => addr.id === params.id)}
                confirmButtonState={updateCustomerAddressOpts.status}
                countries={countryChoices}
                errors={updateCustomerAddressOpts?.data?.addressUpdate.errors || []}
                open={params.action === "edit"}
                variant="edit"
                onClose={closeModal}
                onConfirm={(input) =>
                    updateCustomerAddress({
                        variables: {
                            id: params.id,
                            input,
                        },
                    })
                }
            />

            <ActionDialog
                open={params.action === "remove"}
                variant="delete"
                title={intl.formatMessage({
                    defaultMessage: "Delete Address",
                    id: "qLOBff",
                    description: "dialog header",
                })}
                confirmButtonState={removeCustomerAddressOpts.status}
                onClose={closeModal}
                onConfirm={() =>
                    removeCustomerAddress({
                        variables: {
                            id: params.id,
                        },
                    })
                }
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete this address from users address book?"
                        id="/kWzY1"
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};

export default CustomerAddresses;

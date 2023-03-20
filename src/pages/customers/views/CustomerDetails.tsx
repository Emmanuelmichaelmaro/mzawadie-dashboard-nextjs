// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, extractMutationErrors, getStringOrPlaceholder } from "@mzawadie/core";
import {
    useRemoveCustomerMutation,
    useUpdateCustomerMutation,
    useUpdateMetadataMutation,
    useUpdatePrivateMetadataMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { orderListUrl, orderUrl } from "@mzawadie/pages/orders/urls";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerDetailsPage, CustomerDetailsPageFormData } from "../components/CustomerDetailsPage";
import { useCustomerDetails } from "../hooks/useCustomerDetails";
import { CustomerDetailsProvider } from "../providers/CustomerDetailsProvider";
import { customerAddressesUrl, customerListUrl, customerUrl, CustomerUrlQueryParams } from "../urls";

interface CustomerDetailsViewProps {
    id: string;
    params: CustomerUrlQueryParams;
}

const CustomerDetailsViewInner: React.FC<CustomerDetailsViewProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const customerDetails = useCustomerDetails();
    const user = customerDetails?.customer?.user;
    const customerDetailsLoading = customerDetails?.loading;

    const [removeCustomer, removeCustomerOpts] = useRemoveCustomerMutation({
        onCompleted: (data) => {
            if (data.customerDelete?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Customer Removed",
                        id: "PXatmC",
                    }),
                });
                navigate(customerListUrl());
            }
        },
    });

    const [updateCustomer, updateCustomerOpts] = useUpdateCustomerMutation({
        onCompleted: (data) => {
            if (data.customerUpdate?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const [updateMetadata] = useUpdateMetadataMutation({});
    const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

    const handleBack = () => navigate(customerListUrl());

    if (user === null) {
        return <NotFoundPage onBack={handleBack} />;
    }

    const updateData = async (data: CustomerDetailsPageFormData) =>
        extractMutationErrors(
            updateCustomer({
                variables: {
                    id,
                    input: {
                        email: data.email,
                        firstName: data.firstName,
                        isActive: data.isActive,
                        lastName: data.lastName,
                        note: data.note,
                    },
                },
            })
        );

    const handleSubmit = createMetadataUpdateHandler(
        user,
        updateData,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    return (
        <>
            <WindowTitle title={user?.email} />
            <CustomerDetailsPage
                customer={user}
                disabled={
                    customerDetailsLoading || updateCustomerOpts.loading || removeCustomerOpts.loading
                }
                errors={updateCustomerOpts.data?.customerUpdate?.errors || []}
                saveButtonBar={updateCustomerOpts.status}
                onAddressManageClick={() => navigate(customerAddressesUrl(id))}
                onBack={handleBack}
                onRowClick={(id) => navigate(orderUrl(id))}
                onSubmit={handleSubmit}
                onDelete={() =>
                    navigate(
                        customerUrl(id, {
                            action: "remove",
                        })
                    )
                }
                onViewAllOrdersClick={() =>
                    navigate(
                        orderListUrl({
                            customer: user?.email,
                        })
                    )
                }
            />
            <ActionDialog
                confirmButtonState={removeCustomerOpts.status}
                onClose={() => navigate(customerUrl(id), { replace: true })}
                onConfirm={() => removeCustomer()}
                title={intl.formatMessage({
                    defaultMessage: "Delete Customer",
                    id: "ey0lZj",
                    description: "dialog header",
                })}
                variant="delete"
                open={params.action === "remove"}
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {email}?"
                        id="2p0tZx"
                        description="delete customer, dialog content"
                        values={{
                            email: <strong>{getStringOrPlaceholder(user?.email)}</strong>,
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};

export const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({ id, params }) => (
    <CustomerDetailsProvider id={id}>
        <CustomerDetailsViewInner id={id} params={params} />
    </CustomerDetailsProvider>
);

export default CustomerDetailsView;

// @ts-nocheck
import { MutationFunction, MutationResult } from "@apollo/client";
import { DialogContentText } from "@material-ui/core";
import { ActionDialog, NotFoundPage, WindowTitle } from "@mzawadie/components";
import {
    extractMutationErrors,
    getStringOrPlaceholder,
    MutationResultAdditionalProps,
} from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks";
import { orderListUrl, orderUrl } from "@mzawadie/pages/orders/urls";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerDetailsPage, CustomerDetailsPageFormData } from "../../components/CustomerDetailsPage";
import { CustomerDetailsContext } from "../../providers/CustomerDetailsProvider";
import { RemoveCustomer, RemoveCustomerVariables } from "../../types/RemoveCustomer";
import { UpdateCustomer, UpdateCustomerVariables } from "../../types/UpdateCustomer";
import { customerAddressesUrl, customerUrl, CustomerUrlQueryParams } from "../../urls";

export interface CustomerDetailsContentProps {
    handleBack: () => void;
    updateCustomer: MutationFunction<UpdateCustomer, UpdateCustomerVariables>;
    removeCustomer: MutationFunction<RemoveCustomer, RemoveCustomerVariables>;
    id: string;
    updateCustomerOpts: MutationResult<UpdateCustomer> & MutationResultAdditionalProps;
    removeCustomerOpts: MutationResult<RemoveCustomer> & MutationResultAdditionalProps;
    navigate: UseNavigatorResult;
    params: CustomerUrlQueryParams;
}

export const CustomerDetailsContent: React.FC<CustomerDetailsContentProps> = ({
    handleBack,
    updateCustomer,
    id,
    updateCustomerOpts,
    removeCustomerOpts,
    navigate,
    removeCustomer,
    params,
}) => {
    const customerDetails = useContext(CustomerDetailsContext);
    const user = customerDetails?.customer?.user;
    const customerDetailsLoading = customerDetails?.loading;

    const intl = useIntl();

    if (user === null) {
        return <NotFoundPage onBack={handleBack} />;
    }

    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

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
                errors={updateCustomerOpts.data?.customerUpdate.errors || []}
                saveButtonBar={updateCustomerOpts.status}
                onAddressManageClick={() => navigate(customerAddressesUrl(id))}
                onBack={handleBack}
                onRowClick={(id) => navigate(orderUrl(id))}
                onSubmit={handleSubmit}
                onDelete={() =>
                    navigate(
                        customerUrl(id, {
                          action: "remove"
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

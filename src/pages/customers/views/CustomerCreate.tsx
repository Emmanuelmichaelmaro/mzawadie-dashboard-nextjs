// @ts-nocheck
import { WindowTitle } from "@mzawadie/components";
import { extractMutationErrors, maybe } from "@mzawadie/core";
import { useNavigator, useNotifier } from "@mzawadie/hooks";
import {
    CustomerCreatePage,
    CustomerCreatePageSubmitData,
} from "@mzawadie/pages/customers/components/CustomerCreatePage";
import { CreateCustomer } from "@mzawadie/pages/customers/types/CreateCustomer";
import React from "react";
import { useIntl } from "react-intl";

import { TypedCreateCustomerMutation } from "../mutations";
import { TypedCustomerCreateDataQuery } from "../queries";
import { customerListUrl, customerUrl } from "../urls";

export const CustomerCreate: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const handleCreateCustomerSuccess = (data: CreateCustomer) => {
        if (data.customerCreate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Customer created",
                    id: "ftcHpD",
                }),
            });
            navigate(customerUrl(data.customerCreate.user?.id));
        }
    };

    const handleSubmit = (createCustomer: CustomerCreatePageSubmitData) => (formData) =>
        extractMutationErrors(
            createCustomer({
                variables: {
                    input: {
                        defaultBillingAddress: formData.address,
                        defaultShippingAddress: formData.address,
                        email: formData.email,
                        firstName: formData.customerFirstName,
                        lastName: formData.customerLastName,
                        note: formData.note,
                    },
                },
            })
        );

    return (
        <TypedCustomerCreateDataQuery displayLoader>
            {({ data, loading }) => (
                <TypedCreateCustomerMutation onCompleted={handleCreateCustomerSuccess}>
                    {(createCustomer, createCustomerOpts) => (
                        <>
                            <WindowTitle
                                title={intl.formatMessage({
                                    defaultMessage: "Create customer",
                                    id: "nX2pCU",
                                    description: "window title",
                                })}
                            />

                            <CustomerCreatePage
                                countries={maybe(() => data.shop.countries, [])}
                                disabled={loading || createCustomerOpts.loading}
                                errors={createCustomerOpts.data?.customerCreate.errors || []}
                                saveButtonBar={createCustomerOpts.status}
                                onBack={() => navigate(customerListUrl())}
                                onSubmit={(createCustomer) => handleSubmit(createCustomer)}
                            />
                        </>
                    )}
                </TypedCreateCustomerMutation>
            )}
        </TypedCustomerCreateDataQuery>
    );
};

export default CustomerCreate;

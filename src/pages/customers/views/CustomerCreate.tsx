// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { extractMutationErrors, maybe } from "@mzawadie/core";
import { useCreateCustomerMutation, useCustomerCreateDataQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerCreatePage, CustomerCreatePageSubmitData } from "../components/CustomerCreatePage";
import { customerListUrl, customerUrl } from "../urls";

export const CustomerCreate: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data, loading } = useCustomerCreateDataQuery({
        displayLoader: true,
    });

    const [createCustomer, createCustomerOpts] = useCreateCustomerMutation({
        onCompleted: (data) => {
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
        },
    });

    const handleSubmit = (formData: CustomerCreatePageSubmitData) =>
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
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create customer",
                    id: "nX2pCU",
                    description: "window title",
                })}
            />
            <CustomerCreatePage
                countries={maybe(() => data?.shop.countries, [])}
                disabled={loading || createCustomerOpts.loading}
                errors={createCustomerOpts.data?.customerCreate?.errors || []}
                saveButtonBar={createCustomerOpts.status}
                onBack={() => navigate(customerListUrl())}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default CustomerCreate;

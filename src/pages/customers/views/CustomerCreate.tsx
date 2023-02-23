// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { extractMutationErrors, maybe } from "@mzawadie/core";
import { useNavigator, useNotifier } from "@mzawadie/hooks";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerCreatePage, CustomerCreatePageSubmitData } from "../components/CustomerCreatePage";
import { useCreateCustomerMutation } from "../mutations";
import { useCustomerCreateDataQuery } from "../queries";
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
                        id: "ftcHpD",
                        defaultMessage: "Customer created",
                    }),
                });
                navigate(customerUrl(data.customerCreate?.user?.id));
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
                    id: "nX2pCU",
                    defaultMessage: "Create customer",
                    description: "window title",
                })}
            />
            <CustomerCreatePage
                countries={maybe(() => data?.shop.countries, [])}
                disabled={loading || createCustomerOpts.loading}
                errors={createCustomerOpts.data?.customerCreate?.errors || []}
                saveButtonBar={createCustomerOpts.status}
                onSubmit={handleSubmit}
                onBack={() => navigate(customerListUrl())}
            />
        </>
    );
};

export default CustomerCreate;

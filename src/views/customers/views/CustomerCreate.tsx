/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import CustomerCreatePage from "../components/CustomerCreatePage";
import { TypedCreateCustomerMutation } from "../mutations";
import { TypedCustomerCreateDataQuery } from "../queries";
import { CreateCustomer } from "../types/CreateCustomer";
import { customerListUrl, customerUrl } from "../urls";

export const CustomerCreate: React.FC<{}> = () => {
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
            navigate(customerUrl(data.customerCreate?.user.id));
        }
    };

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
                                onSubmit={(formData) => {
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
                                    });
                                }}
                            />
                        </>
                    )}
                </TypedCreateCustomerMutation>
            )}
        </TypedCustomerCreateDataQuery>
    );
};

export default CustomerCreate;

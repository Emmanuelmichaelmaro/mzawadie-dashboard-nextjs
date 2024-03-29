// @ts-nocheck
import { CustomerDetailsQuery, useCustomerDetailsQuery } from "@mzawadie/graphql";
import React, { createContext } from "react";

export interface CustomerDetailsProviderProps {
    id: string;
}

export interface CustomerDetailsConsumerProps {
    customer: CustomerDetailsQuery | null;
    loading: boolean | null;
}

export const CustomerDetailsContext = createContext<CustomerDetailsConsumerProps>(null);

export const CustomerDetailsProvider: React.FC<CustomerDetailsProviderProps> = ({ children, id }) => {
    const { data, loading } = useCustomerDetailsQuery({
        displayLoader: true,
        variables: {
            id,
        },
    });

    const providerValues: CustomerDetailsConsumerProps = {
        customer: data,
        loading,
    };

    return (
        <CustomerDetailsContext.Provider value={providerValues}>
            {children}
        </CustomerDetailsContext.Provider>
    );
};

// @ts-nocheck
import {
    CardSpacer,
    Container,
    Form,
    Grid,
    Metadata,
    MetadataFormData,
    PageHeader,
    Savebar,
} from "@mzawadie/components";
import { sectionNames, getUserName } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerDetails_user } from "../../types/CustomerDetails";
import { UpdateCustomer_customerUpdate_errors } from "../../types/UpdateCustomer";
import { CustomerAddresses } from "../CustomerAddresses";
import { CustomerDetails } from "../CustomerDetails";
import { CustomerInfo } from "../CustomerInfo";
import { CustomerOrders } from "../CustomerOrders";
import { CustomerStats } from "../CustomerStats";

export interface CustomerDetailsPageFormData extends MetadataFormData {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    note: string;
}

export interface CustomerDetailsPageProps {
    customer: CustomerDetails_user;
    disabled: boolean;
    errors: AccountErrorFragment[];
    saveButtonBar: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (
        data: CustomerDetailsPageFormData
    ) => SubmitPromise<UpdateCustomer_customerUpdate_errors[]>;
    onViewAllOrdersClick: () => void;
    onRowClick: (id: string) => void;
    onAddressManageClick: () => void;
    onDelete: () => void;
}

const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({
    customer,
    disabled,
    errors,
    saveButtonBar,
    onBack,
    onSubmit,
    onViewAllOrdersClick,
    onRowClick,
    onAddressManageClick,
    onDelete,
}: CustomerDetailsPageProps) => {
    const intl = useIntl();

    const initialForm: CustomerDetailsPageFormData = {
        email: customer?.email || "",
        firstName: customer?.firstName || "",
        isActive: customer?.isActive || false,
        lastName: customer?.lastName || "",
        metadata: customer?.metadata.map(mapMetadataItemToInput),
        note: customer?.note || "",
        privateMetadata: customer?.privateMetadata.map(mapMetadataItemToInput),
    };

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit }) => {
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.customers)}
                        </Backlink>

                        <PageHeader title={getUserName(customer, true)} />

                        <Grid>
                            <div>
                                <CustomerDetails
                                    customer={customer}
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <CustomerInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <CustomerOrders
                                    orders={mapEdgesToItems(customer?.orders)}
                                    onViewAllOrdersClick={onViewAllOrdersClick}
                                    onRowClick={onRowClick}
                                />
                                <CardSpacer />
                                <Metadata data={data} onChange={changeMetadata} />
                            </div>

                            <div>
                                <CustomerAddresses
                                    customer={customer}
                                    disabled={disabled}
                                    onAddressManageClick={onAddressManageClick}
                                />
                                <CardSpacer />
                                <CustomerStats customer={customer} />
                                <CardSpacer />
                            </div>
                        </Grid>

                        <Savebar
                            disabled={disabled || !hasChanged}
                            state={saveButtonBar}
                            onSubmit={submit}
                            onCancel={onBack}
                            onDelete={onDelete}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

CustomerDetailsPage.displayName = "CustomerDetailsPage";

export default CustomerDetailsPage;

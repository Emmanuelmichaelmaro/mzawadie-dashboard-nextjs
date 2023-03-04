// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    PartialMutationProviderOutput,
    extractMutationErrors,
    getStringOrPlaceholder,
} from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useUser } from "@mzawadie/pages/auth";
import { useCustomerAddressesQuery } from "@mzawadie/pages/customers/queries";
import { customerUrl } from "@mzawadie/pages/customers/urls";
import { CustomerEditData } from "@mzawadie/pages/orders/components/OrderCustomer";
import { OrderCustomerAddressesEditDialogOutput } from "@mzawadie/pages/orders/components/OrderCustomerAddressesEditDialog/types";
import OrderCustomerChangeDialog from "@mzawadie/pages/orders/components/OrderCustomerChangeDialog/OrderCustomerChangeDialog";
import {
    CustomerChangeActionEnum,
    OrderCustomerChangeData,
} from "@mzawadie/pages/orders/components/OrderCustomerChangeDialog/form";
import { useOrderVariantSearch } from "@mzawadie/pages/orders/queries";
import { OrderDetails } from "@mzawadie/pages/orders/types/OrderDetails";
import {
    OrderDraftUpdate,
    OrderDraftUpdateVariables,
} from "@mzawadie/pages/orders/types/OrderDraftUpdate";
import { OrderUrlDialog, OrderUrlQueryParams, orderDraftListUrl } from "@mzawadie/pages/orders/urls";
import { getVariantSearchAddress } from "@mzawadie/pages/orders/utils/data";
import { OrderDiscountProvider } from "@mzawadie/pages/products/components/OrderDiscountProviders/OrderDiscountProviders";
import { OrderLineDiscountProvider } from "@mzawadie/pages/products/components/OrderDiscountProviders/OrderLineDiscountProviders";
import { productUrl } from "@mzawadie/pages/products/urls";
import useCustomerSearch from "@mzawadie/searches/useCustomerSearch";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { OrderAddressFields } from "../../../components/OrderAddressFields";
import { OrderDraftCancelDialog } from "../../../components/OrderDraftCancelDialog";
import { OrderDraftPage } from "../../../components/OrderDraftPage";
import { OrderProductAddDialog } from "../../../components/OrderProductAddDialog";
import { OrderShippingMethodEditDialog } from "../../../components/OrderShippingMethodEditDialog";

interface OrderDraftDetailsProps {
    id: string;
    params: OrderUrlQueryParams;
    loading: any;
    data: OrderDetails;
    orderAddNote: any;
    orderLineUpdate: any;
    orderLineDelete: any;
    orderShippingMethodUpdate: any;
    orderLinesAdd: any;
    orderDraftUpdate: PartialMutationProviderOutput<OrderDraftUpdate, OrderDraftUpdateVariables>;
    orderDraftCancel: any;
    orderDraftFinalize: any;
    openModal: (action: OrderUrlDialog, newParams?: OrderUrlQueryParams) => void;
    closeModal: any;
}

export const isAnyAddressEditModalOpen = (uri: string | undefined): boolean =>
    ["edit-customer-addresses", "edit-shipping-address", "edit-billing-address"].includes(uri);

export const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
    id,
    params,
    loading,
    data,
    orderAddNote,
    orderLineUpdate,
    orderLineDelete,
    orderShippingMethodUpdate,
    orderLinesAdd,
    orderDraftUpdate,
    orderDraftCancel,
    orderDraftFinalize,
    openModal,
    closeModal,
}) => {
    const { order } = data;
    const navigate = useNavigator();
    const { user } = useUser();

    const {
        loadMore,
        search: variantSearch,
        result: variantSearchOpts,
    } = useOrderVariantSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            channel: order?.channel.slug,
            address: getVariantSearchAddress(order),
        },
    });

    const {
        loadMore: loadMoreCustomers,
        search: searchUsers,
        result: users,
    } = useCustomerSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const { data: customerAddresses, loading: customerAddressesLoading } = useCustomerAddressesQuery({
        variables: {
            id: order?.user?.id,
        },
        skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
    });

    const intl = useIntl();

    const handleCustomerChange = async ({
        user,
        userEmail,
        prevUser,
        prevUserEmail,
    }: CustomerEditData) => {
        const sameUser = user && user === prevUser;
        const sameUserEmail = userEmail && userEmail === prevUserEmail;

        if (sameUser || sameUserEmail) {
            return;
        }

        const result = await orderDraftUpdate.mutate({
            id,
            input: {
                user,
                userEmail,
            },
        });

        if (result?.data?.draftOrderUpdate?.errors?.length) {
            return;
        }

        const modalUri = prevUser ? "customer-change" : "edit-customer-addresses";

        openModal(modalUri);
    };

    const handleCustomerChangeAction = (data: OrderCustomerChangeData) => {
        if (data.changeActionOption === CustomerChangeActionEnum.CHANGE_ADDRESS) {
            openModal("edit-customer-addresses");
        } else {
            closeModal();
        }
    };

    const handleCustomerChangeAddresses = async (
        data: Partial<OrderCustomerAddressesEditDialogOutput>
    ): Promise<any> =>
        orderDraftUpdate.mutate({
            id,
            input: data,
        });

    return (
        <>
            <WindowTitle
                title={intl.formatMessage(
                    {
                        defaultMessage: "Draft Order #{orderNumber}",
                        id: "TLNf6K",
                        description: "window title",
                    },
                    {
                        orderNumber: getStringOrPlaceholder(data?.order?.number),
                    }
                )}
            />

            <OrderDiscountProvider order={order}>
                <OrderLineDiscountProvider order={order}>
                    <OrderDraftPage
                        disabled={loading}
                        onNoteAdd={(variables) =>
                            extractMutationErrors(
                                orderAddNote.mutate({
                                    input: variables,
                                    order: id,
                                })
                            )
                        }
                        users={mapEdgesToItems(users?.data?.search)}
                        hasMore={users?.data?.search?.pageInfo?.hasNextPage || false}
                        onFetchMore={loadMoreCustomers}
                        fetchUsers={searchUsers}
                        loading={users.loading}
                        usersLoading={users.loading}
                        onCustomerEdit={handleCustomerChange}
                        onDraftFinalize={() => orderDraftFinalize.mutate({ id })}
                        onDraftRemove={() => openModal("cancel")}
                        onOrderLineAdd={() => openModal("add-order-line")}
                        onBack={() => navigate(orderDraftListUrl())}
                        order={order}
                        onProductClick={(id) => () => navigate(productUrl(encodeURIComponent(id)))}
                        onBillingAddressEdit={() => openModal("edit-billing-address")}
                        onShippingAddressEdit={() => openModal("edit-shipping-address")}
                        onShippingMethodEdit={() => openModal("edit-shipping")}
                        onOrderLineRemove={(id) => orderLineDelete.mutate({ id })}
                        onOrderLineChange={(id, data) =>
                            orderLineUpdate.mutate({
                                id,
                                input: data,
                            })
                        }
                        saveButtonBarState="default"
                        onProfileView={() => navigate(customerUrl(order.user.id))}
                        userPermissions={user?.userPermissions || []}
                    />
                </OrderLineDiscountProvider>
            </OrderDiscountProvider>

            <OrderDraftCancelDialog
                confirmButtonState={orderDraftCancel.opts.status}
                errors={orderDraftCancel.opts.data?.draftOrderDelete.errors || []}
                onClose={closeModal}
                onConfirm={() => orderDraftCancel.mutate({ id })}
                open={params.action === "cancel"}
                orderNumber={getStringOrPlaceholder(order?.number)}
            />

            <OrderShippingMethodEditDialog
                confirmButtonState={orderShippingMethodUpdate.opts.status}
                errors={orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []}
                open={params.action === "edit-shipping"}
                shippingMethod={order?.shippingMethod?.id}
                shippingMethods={order?.shippingMethods}
                onClose={closeModal}
                onSubmit={(variables) =>
                    orderShippingMethodUpdate.mutate({
                        id,
                        input: {
                            shippingMethod: variables.shippingMethod,
                        },
                    })
                }
            />

            <OrderProductAddDialog
                confirmButtonState={orderLinesAdd.opts.status}
                errors={orderLinesAdd.opts.data?.orderLinesCreate.errors || []}
                loading={variantSearchOpts.loading}
                open={params.action === "add-order-line"}
                hasMore={variantSearchOpts.data?.search.pageInfo.hasNextPage}
                products={mapEdgesToItems(variantSearchOpts?.data?.search)}
                selectedChannelId={order?.channel?.id}
                onClose={closeModal}
                onFetch={variantSearch}
                onFetchMore={loadMore}
                onSubmit={(variants) =>
                    extractMutationErrors(
                        orderLinesAdd.mutate({
                            id,
                            input: variants.map((variant) => ({
                                quantity: 1,
                                variantId: variant.id,
                            })),
                        })
                    )
                }
            />

            <OrderCustomerChangeDialog
                open={params.action === "customer-change"}
                onClose={closeModal}
                onConfirm={handleCustomerChangeAction}
            />

            <OrderAddressFields
                action={params?.action}
                orderShippingAddress={order?.shippingAddress}
                orderBillingAddress={order?.billingAddress}
                customerAddressesLoading={customerAddressesLoading}
                isDraft
                countries={data?.shop?.countries}
                customer={customerAddresses?.user}
                onClose={closeModal}
                onConfirm={handleCustomerChangeAddresses}
                confirmButtonState={orderDraftUpdate.opts.status}
                errors={orderDraftUpdate.opts.data?.draftOrderUpdate.errors}
            />
        </>
    );
};

export default OrderDraftDetails;

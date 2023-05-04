// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { CardMenu } from "@mzawadie/components/CardMenu";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { Container } from "@mzawadie/components/Container";
import { DateTime } from "@mzawadie/components/Date";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import Skeleton from "@mzawadie/components/Skeleton";
import { sectionNames } from "@mzawadie/core";
import { FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import {
    ChannelUsabilityDataQuery,
    OrderDetailsFragment,
    OrderErrorFragment,
    OrderLineInput,
    SearchCustomersQuery,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { OrderChannelSectionCard } from "@mzawadie/pages/orders/components/OrderChannelSectionCard";
import { orderDraftListUrl } from "@mzawadie/pages/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerEditData, OrderCustomer } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as HistoryFormData, OrderHistory } from "../OrderHistory";
import OrderDraftAlert from "./OrderDraftAlert";
import { usePageStyles } from "./styles";

export interface OrderDraftPageProps extends FetchMoreProps {
    disabled: boolean;
    order?: OrderDetailsFragment;
    channelUsabilityData?: ChannelUsabilityDataQuery;
    users: RelayToFlat<SearchCustomersQuery["search"]>;
    usersLoading: boolean;
    errors: OrderErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    fetchUsers: (query: string) => void;
    onBillingAddressEdit: () => void;
    onCustomerEdit: (data: CustomerEditData) => void;
    onDraftFinalize: () => void;
    onDraftRemove: () => void;
    onNoteAdd: (data: HistoryFormData) => SubmitPromise<any[]>;
    onOrderLineAdd: () => void;
    onOrderLineChange: (id: string, data: OrderLineInput) => void;
    onOrderLineRemove: (id: string) => void;
    onProductClick: (id: string) => void;
    onShippingAddressEdit: () => void;
    onShippingMethodEdit: () => void;
    onProfileView: () => void;
}

const OrderDraftPage: React.FC<OrderDraftPageProps> = (props) => {
    const {
        disabled,
        fetchUsers,
        hasMore,
        saveButtonBarState,
        onBillingAddressEdit,
        onCustomerEdit,
        onDraftFinalize,
        onDraftRemove,
        onFetchMore,
        onNoteAdd,
        onOrderLineAdd,
        onOrderLineChange,
        onOrderLineRemove,
        onShippingAddressEdit,
        onShippingMethodEdit,
        onProfileView,
        order,
        channelUsabilityData,
        users,
        usersLoading,
        errors,
    } = props;

    const classes = usePageStyles(props);

    const navigate = useNavigator();

    const intl = useIntl();

    return (
        <Container>
            <Backlink href={orderDraftListUrl()}>
                {intl.formatMessage(sectionNames.draftOrders)}
            </Backlink>

            <PageHeader
                className={classes.header}
                inline
                title={order?.number ? "#" + order?.number : undefined}
            >
                <CardMenu
                    menuItems={[
                        {
                            label: intl.formatMessage({
                                id: "PAqicb",
                                defaultMessage: "Cancel order",
                                description: "button",
                            }),
                            onSelect: onDraftRemove,
                        },
                    ]}
                />
            </PageHeader>

            <div className={classes.date}>
                {order && order.created ? (
                    <Typography variant="body2">
                        <DateTime date={order.created} />
                    </Typography>
                ) : (
                    <Skeleton style={{ width: "10em" }} />
                )}
            </div>

            <Grid>
                <div>
                    <OrderDraftAlert order={order} channelUsabilityData={channelUsabilityData} />

                    <OrderDraftDetails
                        order={order}
                        channelUsabilityData={channelUsabilityData}
                        errors={errors}
                        onOrderLineAdd={onOrderLineAdd}
                        onOrderLineChange={onOrderLineChange}
                        onOrderLineRemove={onOrderLineRemove}
                        onShippingMethodEdit={onShippingMethodEdit}
                    />

                    <OrderHistory
                        history={order?.events}
                        orderCurrency={order?.total?.gross.currency}
                        onNoteAdd={onNoteAdd}
                    />
                </div>

                <div>
                    <OrderChannelSectionCard channel={order?.channel} />
                    <CardSpacer />
                    <OrderCustomer
                        canEditAddresses={!!order?.user}
                        canEditCustomer={true}
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        loading={usersLoading}
                        errors={errors}
                        order={order}
                        users={users}
                        onBillingAddressEdit={onBillingAddressEdit}
                        onCustomerEdit={onCustomerEdit}
                        onFetchMore={onFetchMore}
                        onProfileView={onProfileView}
                        onShippingAddressEdit={onShippingAddressEdit}
                    />
                </div>
            </Grid>

            <Savebar
                state={saveButtonBarState}
                disabled={disabled}
                onCancel={() => navigate(orderDraftListUrl())}
                onSubmit={onDraftFinalize}
                labels={{
                    confirm: intl.formatMessage({
                        id: "4Z14xW",
                        defaultMessage: "Finalize",
                        description: "button",
                    }),
                }}
            />
        </Container>
    );
};

OrderDraftPage.displayName = "OrderDraftPage";

export default OrderDraftPage;

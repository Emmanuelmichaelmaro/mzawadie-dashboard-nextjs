// @ts-nocheck
import { Typography } from "@material-ui/core";
import { CardMenu } from "@mzawadie/components/CardMenu";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { Container } from "@mzawadie/components/Container";
import { DateTime } from "@mzawadie/components/Date";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import Skeleton from "@mzawadie/components/Skeleton";
import { sectionNames, FetchMoreProps, UserPermissionProps, RelayToFlat } from "@mzawadie/core";
import { OrderDetailsFragment, SearchCustomersQuery } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks";
import { ConfirmButtonTransitionState, Backlink, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DraftOrderChannelSectionCard } from "../DraftOrderChannelSectionCard";
import { CustomerEditData, OrderCustomer } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import { FormData as HistoryFormData, OrderHistory } from "../OrderHistory";

const useStyles = makeStyles(
    (theme) => ({
        date: {
            marginBottom: theme.spacing(3),
        },
        header: {
            display: "flex",
            marginBottom: 0,
        },
    }),
    { name: "OrderDraftPage" }
);

export interface OrderDraftPageProps extends FetchMoreProps, UserPermissionProps {
    disabled: boolean;
    order: OrderDetailsFragment;
    users: RelayToFlat<SearchCustomersQuery["search"]>;
    usersLoading: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    fetchUsers: (query: string) => void;
    onBack: () => void;
    onBillingAddressEdit: () => void;
    onCustomerEdit: (data: CustomerEditData) => void;
    onDraftFinalize: () => void;
    onDraftRemove: () => void;
    onNoteAdd: (data: HistoryFormData) => SubmitPromise<any[]>;
    onOrderLineAdd: () => void;
    onOrderLineChange: (id: string, data: OrderDraftDetailsProductsFormData) => void;
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
        onBack,
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
        users,
        usersLoading,
        userPermissions,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.draftOrders)}</Backlink>

            <PageHeader
                className={classes.header}
                inline
                title={order?.number ? `#${order?.number}` : undefined}
            >
                <CardMenu
                    menuItems={[
                        {
                            label: intl.formatMessage({
                                defaultMessage: "Cancel order",
                                id: "PAqicb",
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
                    <OrderDraftDetails
                        order={order}
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
                    <OrderCustomer
                        canEditAddresses={!!order?.user}
                        canEditCustomer
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        loading={usersLoading}
                        order={order}
                        users={users}
                        userPermissions={userPermissions}
                        onBillingAddressEdit={onBillingAddressEdit}
                        onCustomerEdit={onCustomerEdit}
                        onFetchMore={onFetchMore}
                        onProfileView={onProfileView}
                        onShippingAddressEdit={onShippingAddressEdit}
                    />
                    <CardSpacer />
                    <DraftOrderChannelSectionCard channelName={order?.channel?.name} />
                </div>
            </Grid>

            <Savebar
                state={saveButtonBarState}
                disabled={disabled || !order?.canFinalize}
                onCancel={onBack}
                onSubmit={onDraftFinalize}
                labels={{
                    confirm: intl.formatMessage({
                        defaultMessage: "Finalize",
                        id: "4Z14xW",
                        description: "button",
                    }),
                }}
            />
        </Container>
    );
};

OrderDraftPage.displayName = "OrderDraftPage";

export default OrderDraftPage;

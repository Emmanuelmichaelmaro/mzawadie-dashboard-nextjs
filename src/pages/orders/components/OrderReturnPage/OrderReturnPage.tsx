// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { renderCollection } from "@mzawadie/core";
import { OrderDetailsFragment, OrderErrorFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderAmount } from "../OrderRefundReturnAmount";
import { getReturnProductsAmountValues } from "../OrderRefundReturnAmount/utils";
import ItemsCard from "./OrderReturnRefundItemsCard/ReturnItemsCard";
import OrderRefundForm, { OrderRefundSubmitData } from "./form";
import {
    getFulfilledFulfillemnts,
    getParsedLines,
    getUnfulfilledLines,
    getWaitingFulfillments,
} from "./utils";

const messages = defineMessages({
    appTitle: {
        defaultMessage: "Order #{orderNumber}",
        id: "rVIlBs",
        description: "page header with order number",
    },
    pageTitle: {
        defaultMessage: "Order no. {orderNumber} - Replace/Return",
        id: "BBIQxQ",
        description: "page header",
    },
});

export interface OrderReturnPageProps {
    order: OrderDetailsFragment;
    loading: boolean;
    errors?: OrderErrorFragment[];
    onBack: () => void;
    onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderReturnPageProps> = (props) => {
    const { order, loading, errors = [], onBack, onSubmit } = props;

    const intl = useIntl();

    return (
        <OrderRefundForm order={order} onSubmit={onSubmit}>
            {({ data, handlers, change, submit }) => {
                const { fulfilledItemsQuantities, waitingItemsQuantities, unfulfilledItemsQuantities } =
                    data;

                const hasAnyItemsSelected =
                    fulfilledItemsQuantities.some(({ value }) => !!value) ||
                    waitingItemsQuantities.some(({ value }) => !!value) ||
                    unfulfilledItemsQuantities.some(({ value }) => !!value);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(messages.appTitle, {
                                orderNumber: order?.number,
                            })}
                        </Backlink>

                        <PageHeader
                            title={intl.formatMessage(messages.pageTitle, {
                                orderNumber: order?.number,
                            })}
                        />

                        <Grid>
                            <div>
                                {!!data.unfulfilledItemsQuantities.length && (
                                    <>
                                        <ItemsCard
                                            errors={errors}
                                            order={order}
                                            lines={getUnfulfilledLines(order)}
                                            itemsQuantities={data.unfulfilledItemsQuantities}
                                            itemsSelections={data.itemsToBeReplaced}
                                            onChangeQuantity={handlers.changeUnfulfiledItemsQuantity}
                                            onSetMaxQuantity={
                                                handlers.handleSetMaximalUnfulfiledItemsQuantities
                                            }
                                            onChangeSelected={handlers.changeItemsToBeReplaced}
                                        />
                                        <CardSpacer />
                                    </>
                                )}

                                {renderCollection(getWaitingFulfillments(order), ({ id, lines }) => (
                                    <React.Fragment key={id}>
                                        <ItemsCard
                                            errors={errors}
                                            order={order}
                                            fulfilmentId={id}
                                            lines={getParsedLines(lines)}
                                            itemsQuantities={data.waitingItemsQuantities}
                                            itemsSelections={data.itemsToBeReplaced}
                                            onChangeQuantity={handlers.changeWaitingItemsQuantity}
                                            onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                                                id
                                            )}
                                            onChangeSelected={handlers.changeItemsToBeReplaced}
                                        />
                                        <CardSpacer />
                                    </React.Fragment>
                                ))}

                                {renderCollection(getFulfilledFulfillemnts(order), ({ id, lines }) => (
                                    <React.Fragment key={id}>
                                        <ItemsCard
                                            errors={errors}
                                            order={order}
                                            fulfilmentId={id}
                                            lines={getParsedLines(lines)}
                                            itemsQuantities={data.fulfilledItemsQuantities}
                                            itemsSelections={data.itemsToBeReplaced}
                                            onChangeQuantity={handlers.changeFulfiledItemsQuantity}
                                            onSetMaxQuantity={handlers.handleSetMaximalItemsQuantities(
                                                id
                                            )}
                                            onChangeSelected={handlers.changeItemsToBeReplaced}
                                        />
                                        <CardSpacer />
                                    </React.Fragment>
                                ))}
                            </div>

                            <div>
                                <OrderAmount
                                    allowNoRefund
                                    isReturn
                                    amountData={getReturnProductsAmountValues(order, data)}
                                    data={data}
                                    order={order}
                                    disableSubmitButton={!hasAnyItemsSelected}
                                    disabled={loading}
                                    errors={errors}
                                    onChange={change}
                                    onRefund={submit}
                                />
                            </div>
                        </Grid>
                    </Container>
                );
            }}
        </OrderRefundForm>
    );
};

export default OrderRefundPage;

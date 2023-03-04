// @ts-nocheck
import { Card, CardContent, FormControlLabel, Radio, RadioGroup, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import Hr from "@mzawadie/components/Hr";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { OrderDetails_order } from "@mzawadie/pages/orders/types/OrderDetails";
import { OrderRefundData_order } from "@mzawadie/pages/orders/types/OrderRefundData";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
    OrderRefundAmountCalculationMode,
    OrderRefundFormData,
    OrderRefundType,
} from "../OrderRefundPage/form";
import { OrderReturnFormData } from "../OrderReturnPage/form";
import OrderRefundAmountValues, { OrderRefundAmountValuesProps } from "./OrderRefundReturnAmountValues";
import RefundAmountInput from "./RefundAmountInput";

const useStyles = makeStyles(
    (theme) => ({
        content: {
            paddingTop: theme.spacing(1.5),
        },
        hr: {
            margin: theme.spacing(1, 0),
        },
        maxRefundRow: {
            fontWeight: 600,
        },
        priceField: {
            marginTop: theme.spacing(2),
        },
        refundButton: {
            marginTop: theme.spacing(2),
        },
        refundCaution: {
            marginTop: theme.spacing(1),
        },
        root: {
            ...theme.typography.body1,
            lineHeight: 1.9,
            width: "100%",
        },
        textRight: {
            textAlign: "right",
        },
    }),
    { name: "OrderRefundAmount" }
);

const messages = defineMessages({
    refundButton: {
        defaultMessage: "Refund",
        id: "QkFeOa",
        description: "order refund amount button",
    },
    refundCannotBeFulfilled: {
        defaultMessage: "Refunded items can't be fulfilled",
        id: "AKv2BI",
        description: "order refund subtitle",
    },
    returnButton: {
        defaultMessage: "Return & Replace products",
        id: "bgO+7G",
        description: "order return amount button",
    },
    returnCannotBeFulfilled: {
        defaultMessage: "Returned items can't be fulfilled",
        id: "Uo5/Ov",
        description: "order return subtitle",
    },
});

interface OrderRefundAmountProps {
    data: OrderRefundFormData | OrderReturnFormData;
    order: OrderRefundData_order | OrderDetails_order;
    disabled: boolean;
    disableSubmitButton?: boolean;
    isReturn?: boolean;
    errors: OrderErrorFragment[];
    amountData: OrderRefundAmountValuesProps;
    allowNoRefund?: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
    onRefund: () => void;
}

const OrderRefundAmount: React.FC<OrderRefundAmountProps> = (props) => {
    const {
        data,
        order,
        disabled,
        errors,
        onChange,
        onRefund,
        isReturn = false,
        amountData,
        disableSubmitButton,
        allowNoRefund = false,
    } = props;
    const classes = useStyles(props);
    const intl = useIntl();

    const { type = OrderRefundType.PRODUCTS } = data as OrderRefundFormData;

    const amountCurrency = order?.total?.gross?.currency;

    const {
        authorizedAmount,
        maxRefund,
        previouslyRefunded,
        proposedRefundAmount,
        refundTotalAmount,
        selectedProductsValue,
        shipmentCost,
        replacedProductsValue,
    } = amountData;

    const isRefundAutomatic =
        type === OrderRefundType.PRODUCTS &&
        data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC;

    const selectedRefundAmount = isRefundAutomatic ? refundTotalAmount?.amount : data.amount;

    const isAmountTooSmall = selectedRefundAmount && selectedRefundAmount <= 0;
    const isAmountTooBig = selectedRefundAmount > maxRefund?.amount;

    const parsedRefundTotalAmount = isAmountTooBig ? maxRefund : refundTotalAmount;

    const shouldRefundButtonBeDisabled = () => {
        if (isAmountTooSmall) {
            return true;
        }

        if (
            data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL ||
            type === OrderRefundType.MISCELLANEOUS
        ) {
            if (isAmountTooBig) {
                return true;
            }
        }

        if (isReturn) {
            return disableSubmitButton;
        }
        return !selectedRefundAmount;
    };

    const disableRefundButton = shouldRefundButtonBeDisabled();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Refunded Amount",
                    id: "0oo+BT",
                    description: "section header",
                })}
            />
            <CardContent className={classes.content}>
                {type === OrderRefundType.PRODUCTS && (
                    <RadioGroup
                        value={data.amountCalculationMode}
                        onChange={onChange}
                        name="amountCalculationMode"
                    >
                        {allowNoRefund && (
                            <FormControlLabel
                                disabled={disabled}
                                value={OrderRefundAmountCalculationMode.NONE}
                                control={<Radio color="primary" />}
                                label={intl.formatMessage({
                                    defaultMessage: "No refund",
                                    id: "zzfj8H",
                                    description: "label",
                                })}
                            />
                        )}
                        <FormControlLabel
                            disabled={disabled}
                            value={OrderRefundAmountCalculationMode.AUTOMATIC}
                            control={<Radio color="primary" />}
                            label={intl.formatMessage({
                                defaultMessage: "Automatic Amount",
                                id: "JEIN47",
                                description: "label",
                            })}
                        />
                        {data.amountCalculationMode === OrderRefundAmountCalculationMode.NONE && (
                            <>
                                <CardSpacer />
                                <OrderRefundAmountValues
                                    authorizedAmount={authorizedAmount}
                                    previouslyRefunded={previouslyRefunded}
                                    maxRefund={maxRefund}
                                    shipmentCost={data.refundShipmentCosts && shipmentCost}
                                />
                            </>
                        )}
                        {data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC && (
                            <>
                                <ControlledCheckbox
                                    checked={data.refundShipmentCosts}
                                    label={intl.formatMessage({
                                        defaultMessage: "Refund shipment costs",
                                        id: "EP+jcU",
                                        description: "checkbox",
                                    })}
                                    name="refundShipmentCosts"
                                    onChange={onChange}
                                />
                                <CardSpacer />
                                <OrderRefundAmountValues
                                    authorizedAmount={authorizedAmount}
                                    previouslyRefunded={previouslyRefunded}
                                    maxRefund={maxRefund}
                                    selectedProductsValue={selectedProductsValue}
                                    refundTotalAmount={parsedRefundTotalAmount}
                                    shipmentCost={data.refundShipmentCosts && shipmentCost}
                                    replacedProductsValue={replacedProductsValue}
                                />
                            </>
                        )}
                        <Hr className={classes.hr} />
                        <FormControlLabel
                            disabled={disabled}
                            value={OrderRefundAmountCalculationMode.MANUAL}
                            control={<Radio color="primary" />}
                            label={intl.formatMessage({
                                defaultMessage: "Manual Amount",
                                id: "FOehC/",
                                description: "label",
                            })}
                        />
                        {data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL && (
                            <>
                                <ControlledCheckbox
                                    disabled={disabled}
                                    checked={data.refundShipmentCosts}
                                    label={intl.formatMessage({
                                        defaultMessage: "Refund shipment costs",
                                        id: "EP+jcU",
                                        description: "checkbox",
                                    })}
                                    name="refundShipmentCosts"
                                    onChange={onChange}
                                />
                                <OrderRefundAmountValues
                                    authorizedAmount={authorizedAmount}
                                    previouslyRefunded={previouslyRefunded}
                                    maxRefund={maxRefund}
                                    selectedProductsValue={selectedProductsValue}
                                    proposedRefundAmount={proposedRefundAmount}
                                    shipmentCost={data.refundShipmentCosts && shipmentCost}
                                    replacedProductsValue={replacedProductsValue}
                                />
                                <RefundAmountInput
                                    data={data as OrderRefundFormData}
                                    maxRefund={maxRefund}
                                    amountTooSmall={isAmountTooSmall}
                                    amountTooBig={isAmountTooBig}
                                    currencySymbol={amountCurrency}
                                    disabled={disabled}
                                    onChange={onChange}
                                    errors={errors}
                                />
                            </>
                        )}
                    </RadioGroup>
                )}
                {type === OrderRefundType.MISCELLANEOUS && (
                    <>
                        <OrderRefundAmountValues
                            authorizedAmount={authorizedAmount}
                            previouslyRefunded={previouslyRefunded}
                            maxRefund={maxRefund}
                        />
                        <RefundAmountInput
                            data={data as OrderRefundFormData}
                            maxRefund={maxRefund}
                            amountTooSmall={isAmountTooSmall}
                            amountTooBig={isAmountTooBig}
                            currencySymbol={amountCurrency}
                            disabled={disabled}
                            onChange={onChange}
                            errors={errors}
                        />
                    </>
                )}
                <Button
                    variant="primary"
                    fullWidth
                    onClick={onRefund}
                    className={classes.refundButton}
                    disabled={disableRefundButton}
                    data-test-id="submit"
                >
                    {!disableRefundButton && !isReturn ? (
                        <FormattedMessage
                            defaultMessage="Refund {currency} {amount}"
                            id="8F2D1H"
                            description="order refund amount, input button"
                            values={{
                                amount: isRefundAutomatic
                                    ? parsedRefundTotalAmount.amount.toFixed(2)
                                    : Number(selectedRefundAmount).toFixed(2),
                                currency: amountCurrency,
                            }}
                        />
                    ) : (
                        intl.formatMessage(isReturn ? messages.returnButton : messages.refundButton)
                    )}
                </Button>
                <Typography variant="caption" color="textSecondary" className={classes.refundCaution}>
                    {intl.formatMessage(
                        isReturn ? messages.returnCannotBeFulfilled : messages.refundCannotBeFulfilled
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};

OrderRefundAmount.displayName = "OrderRefundAmount";

export default OrderRefundAmount;

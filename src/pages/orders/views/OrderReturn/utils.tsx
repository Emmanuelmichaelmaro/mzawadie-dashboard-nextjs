/* eslint-disable @typescript-eslint/member-ordering */
// @ts-nocheck
import {
    OrderDetailsFragment,
    OrderReturnFulfillmentLineInput,
    OrderReturnLineInput,
    OrderReturnProductsInput,
} from "@mzawadie/graphql";
import { OrderRefundAmountCalculationMode } from "@mzawadie/pages/orders/components/OrderRefundPage/form";
import {
    FormsetQuantityData,
    OrderReturnFormData,
} from "@mzawadie/pages/orders/components/OrderReturnPage/form";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";

class ReturnFormDataParser {
    private order: OrderDetailsFragment;

    private formData: OrderReturnFormData;

    constructor(order: OrderDetailsFragment, formData: OrderReturnFormData) {
        this.order = order;
        this.formData = formData;
    }

    public getParsedData = (): OrderReturnProductsInput => {
        const {
            fulfilledItemsQuantities,
            waitingItemsQuantities,
            unfulfilledItemsQuantities,
            refundShipmentCosts,
        } = this.formData;

        const fulfillmentLines = this.getParsedLineData<OrderReturnFulfillmentLineInput>(
            fulfilledItemsQuantities,
            "fulfillmentLineId"
        );

        const waitingLines = this.getParsedLineData<OrderReturnFulfillmentLineInput>(
            waitingItemsQuantities,
            "fulfillmentLineId"
        );

        const orderLines = this.getParsedLineData<OrderReturnLineInput>(
            unfulfilledItemsQuantities,
            "orderLineId"
        );

        return {
            amountToRefund: this.getAmountToRefund(),
            fulfillmentLines: fulfillmentLines.concat(waitingLines),
            includeShippingCosts: refundShipmentCosts,
            orderLines,
            refund: this.getShouldRefund(orderLines, fulfillmentLines),
        };
    };

    private getAmountToRefund = (): number | undefined =>
        this.formData.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL
            ? this.formData.amount
            : undefined;

    private getParsedLineData = function <
        T extends OrderReturnFulfillmentLineInput | OrderReturnLineInput
    >(itemsQuantities: FormsetQuantityData, idKey: "fulfillmentLineId" | "orderLineId"): T[] {
        const { itemsToBeReplaced } = this.formData;

        return itemsQuantities.reduce((result, { value: quantity, id }) => {
            if (!quantity) {
                return result;
            }

            const shouldReplace = !!itemsToBeReplaced.find(getById(id))?.value;

            return [...result, { [idKey]: id, quantity, replace: shouldReplace } as unknown as T];
        }, []);
    };

    private getShouldRefund = (
        orderLines: OrderReturnLineInput[],
        fulfillmentLines: OrderReturnFulfillmentLineInput[]
    ) => {
        if (
            !this.order.totalCaptured?.amount ||
            this.formData.amountCalculationMode === OrderRefundAmountCalculationMode.NONE
        ) {
            return false;
        }

        if (!!this.getAmountToRefund()) {
            return true;
        }

        return (
            orderLines.some(ReturnFormDataParser.isLineRefundable) ||
            fulfillmentLines.some(ReturnFormDataParser.isLineRefundable)
        );
    };

    private static isLineRefundable = function <
        T extends OrderReturnLineInput | OrderReturnFulfillmentLineInput
    >({ replace }: T) {
        return !replace;
    };
}

export default ReturnFormDataParser;

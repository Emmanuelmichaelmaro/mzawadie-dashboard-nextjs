// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";

import { Weight } from "../Weight";

export interface WeightRangeProps {
    from?: typeof Weight;
    to?: typeof Weight;
}

const WeightRange: React.FC<WeightRangeProps> = ({ from, to }) =>
    from && to ? (
        <FormattedMessage
            defaultMessage="{fromValue} {fromUnit} - {toValue} {toUnit}"
            id="5x6yT9"
            description="weight"
            values={{
                fromUnit: from.unit,
                fromValue: from.value,
                toUnit: to.unit,
                toValue: to.value,
            }}
        />
    ) : from && !to ? (
        <FormattedMessage
            defaultMessage="from {value} {unit}"
            id="LICZeR"
            description="weight"
            values={from}
        />
    ) : !from && to ? (
        <FormattedMessage
            defaultMessage="to {value} {unit}"
            id="qMB6d2"
            description="weight"
            values={to}
        />
    ) : (
        <span>-</span>
    );

WeightRange.displayName = "WeightRange";

export default WeightRange;

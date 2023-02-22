/* eslint-disable @typescript-eslint/no-redeclare, no-redeclare */
// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";

export interface WeightInterface {
    unit: string;
    value: number;
}

export interface WeightProps {
    weight: WeightInterface;
}

const Weight: React.FC<WeightProps> = ({ weight }) => (
    <FormattedMessage
        defaultMessage="{value} {unit}"
        id="NtFVFS"
        description="weight"
        values={weight}
    />
);

Weight.displayName = "Weight";

export default Weight;

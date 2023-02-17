// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";

export interface Weight {
    unit: string;
    value: number;
}
export interface WeightProps {
    weight: Weight;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
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

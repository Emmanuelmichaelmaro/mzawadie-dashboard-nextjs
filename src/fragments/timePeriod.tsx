/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const fragmentTimePeriod = gql`
    fragment TimePeriod on TimePeriod {
        amount
        type
    }
`;

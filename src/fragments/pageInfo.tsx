/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const pageInfoFragment = gql`
    fragment PageInfoFragment on PageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
    }
`;

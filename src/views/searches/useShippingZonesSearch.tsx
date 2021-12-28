// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import makeTopLevelSearch from "@mzawadie/hooks/makeTopLevelSearch";

import { SearchShippingZones, SearchShippingZonesVariables } from "./types/SearchShippingZones";

const searchShippingZones = gql`
    ${pageInfoFragment}
    query SearchShippingZones(
        $query: String!
        $first: Int!
        $after: String
        $last: Int
        $before: String
    ) {
        search: shippingZones(
            filter: { search: $query }
            first: $first
            after: $after
            last: $last
            before: $before
        ) {
            totalCount
            edges {
                node {
                    id
                    name
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

export default makeTopLevelSearch<SearchShippingZones, SearchShippingZonesVariables>(
    searchShippingZones
);

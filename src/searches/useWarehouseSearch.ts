import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchWarehouses, SearchWarehousesVariables } from "./types/SearchWarehouses";

export const searchWarehouses = gql`
    ${pageInfoFragment}
    query SearchWarehouses($after: String, $first: Int!, $query: String!) {
        search: warehouses(after: $after, first: $first, filter: { search: $query }) {
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

// @ts-ignore
export default makeTopLevelSearch<SearchWarehouses, SearchWarehousesVariables>(searchWarehouses);

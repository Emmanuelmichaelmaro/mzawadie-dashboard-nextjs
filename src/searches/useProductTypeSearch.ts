import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchProductTypes, SearchProductTypesVariables } from "./types/SearchProductTypes";

export const searchProductTypes = gql`
    ${pageInfoFragment}
    query SearchProductTypes($after: String, $first: Int!, $query: String!) {
        search: productTypes(after: $after, first: $first, filter: { search: $query }) {
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
export default makeTopLevelSearch<SearchProductTypes, SearchProductTypesVariables>(searchProductTypes);

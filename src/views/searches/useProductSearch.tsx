// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import makeTopLevelSearch from "@mzawadie/hooks/makeTopLevelSearch";

import { SearchProducts, SearchProductsVariables } from "./types/SearchProducts";

export const searchProducts = gql`
    ${pageInfoFragment}
    query SearchProducts($after: String, $first: Int!, $query: String!) {
        search: products(after: $after, first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    name
                    thumbnail {
                        url
                    }
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

export default makeTopLevelSearch<SearchProducts, SearchProductsVariables>(searchProducts);

import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

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
                    variants {
                        id
                        name
                        sku
                        channelListings {
                            channel {
                                id
                                isActive
                                name
                                currencyCode
                            }
                            price {
                                amount
                                currency
                            }
                        }
                    }
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

// @ts-ignore
export default makeTopLevelSearch<SearchProducts, SearchProductsVariables>(searchProducts);

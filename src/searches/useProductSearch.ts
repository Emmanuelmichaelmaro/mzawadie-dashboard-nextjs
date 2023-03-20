// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchProductsDocument,
    SearchProductsQuery,
    SearchProductsQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchProducts = gql`
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
                ...PageInfo
            }
        }
    }
`;

export default makeTopLevelSearch<SearchProductsQuery, SearchProductsQueryVariables>(
    SearchProductsDocument
);

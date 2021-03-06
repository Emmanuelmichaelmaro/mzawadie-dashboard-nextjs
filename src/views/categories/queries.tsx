/* eslint-disable import/extensions */

/* eslint-disable @typescript-eslint/ban-types */
import { gql } from "@apollo/client";
import { categoryDetailsFragment, categoryFragment } from "@mzawadie/fragments/categories";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { channelListingProductFragment } from "@mzawadie/fragments/products";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { CategoryDetails, CategoryDetailsVariables } from "./types/CategoryDetails";
import { RootCategories } from "./types/RootCategories";

export const rootCategories = gql`
    ${categoryFragment}
    ${pageInfoFragment}
    query RootCategories(
        $first: Int
        $after: String
        $last: Int
        $before: String
        $filter: CategoryFilterInput
        $sort: CategorySortingInput
    ) {
        categories(
            level: 0
            first: $first
            after: $after
            last: $last
            before: $before
            filter: $filter
            sortBy: $sort
        ) {
            edges {
                node {
                    ...CategoryFragment
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

export const useRootCategoriesQuery = makeQuery<RootCategories, {}>(rootCategories);

export const categoryDetails = gql`
    ${channelListingProductFragment}
    ${categoryFragment}
    ${categoryDetailsFragment}
    ${pageInfoFragment}
    query CategoryDetails($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
        category(id: $id) {
            ...CategoryDetailsFragment
            children(first: $first, after: $after, last: $last, before: $before) {
                edges {
                    node {
                        ...CategoryFragment
                    }
                }
                pageInfo {
                    ...PageInfoFragment
                }
            }
            products(first: $first, after: $after, last: $last, before: $before) {
                pageInfo {
                    ...PageInfoFragment
                }
                edges {
                    cursor
                    node {
                        id
                        name
                        thumbnail {
                            url
                        }
                        productType {
                            id
                            name
                        }
                        channelListings {
                            ...ChannelListingProductFragment
                        }
                    }
                }
            }
        }
    }
`;

export const useCategoryDetailsQuery = makeQuery<CategoryDetails, CategoryDetailsVariables>(
    categoryDetails
);

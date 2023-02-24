// @ts-nocheck
import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks/makeTopLevelSearch";

import { SearchGiftCardTags, SearchGiftCardTagsVariables } from "./types/SearchGiftCardTags";

const searchGiftCardTags = gql`
    ${pageInfoFragment}
    query SearchGiftCardTags(
        $query: String!
        $first: Int!
        $after: String
        $last: Int
        $before: String
    ) {
        search: giftCardTags(
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

export default makeTopLevelSearch<SearchGiftCardTags, SearchGiftCardTagsVariables>(searchGiftCardTags);
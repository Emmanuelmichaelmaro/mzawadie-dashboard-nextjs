// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchGiftCardTagsDocument,
    SearchGiftCardTagsQuery,
    SearchGiftCardTagsQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchGiftCardTags = gql`
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
                ...PageInfo
            }
        }
    }
`;

export default makeTopLevelSearch<SearchGiftCardTagsQuery, SearchGiftCardTagsQueryVariables>(
    SearchGiftCardTagsDocument
);

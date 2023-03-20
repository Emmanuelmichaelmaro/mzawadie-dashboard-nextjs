// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchCollectionsDocument,
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchCollections = gql`
    query SearchCollections($after: String, $first: Int!, $query: String!) {
        search: collections(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchCollectionsQuery, SearchCollectionsQueryVariables>(
    SearchCollectionsDocument
);

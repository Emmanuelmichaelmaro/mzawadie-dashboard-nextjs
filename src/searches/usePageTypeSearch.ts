// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchPageTypesDocument,
    SearchPageTypesQuery,
    SearchPageTypesQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchPageTypes = gql`
    query SearchPageTypes($after: String, $first: Int!, $query: String!) {
        search: pageTypes(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchPageTypesQuery, SearchPageTypesQueryVariables>(
    SearchPageTypesDocument
);

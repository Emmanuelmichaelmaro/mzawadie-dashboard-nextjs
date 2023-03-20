// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchProductTypesDocument,
    SearchProductTypesQuery,
    SearchProductTypesQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchProductTypes = gql`
    query SearchProductTypes($after: String, $first: Int!, $query: String!) {
        search: productTypes(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchProductTypesQuery, SearchProductTypesQueryVariables>(
    SearchProductTypesDocument
);

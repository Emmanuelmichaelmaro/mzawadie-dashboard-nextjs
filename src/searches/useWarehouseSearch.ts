// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchWarehousesDocument,
    SearchWarehousesQuery,
    SearchWarehousesQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchWarehouses = gql`
    query SearchWarehouses($after: String, $first: Int!, $query: String!) {
        search: warehouses(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchWarehousesQuery, SearchWarehousesQueryVariables>(
    SearchWarehousesDocument
);

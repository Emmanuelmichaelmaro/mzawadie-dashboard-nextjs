import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import {
    warehouseDetailsFragment,
    warehouseWithShippingFragment,
} from "@mzawadie/fragments/warehouses";
import makeQuery from "@mzawadie/hooks/graphql/makeQuery";

import { WarehouseDetails, WarehouseDetailsVariables } from "./types/WarehouseDetails";
import { WarehouseList, WarehouseListVariables } from "./types/WarehouseList";

const warehouseList = gql`
    ${warehouseWithShippingFragment}
    ${pageInfoFragment}
    query WarehouseList(
        $first: Int
        $after: String
        $last: Int
        $before: String
        $filter: WarehouseFilterInput
        $sort: WarehouseSortingInput
    ) {
        warehouses(
            before: $before
            after: $after
            first: $first
            last: $last
            filter: $filter
            sortBy: $sort
        ) {
            edges {
                node {
                    ...WarehouseWithShippingFragment
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;
export const useWarehouseList = makeQuery<WarehouseList, WarehouseListVariables>(warehouseList);

const warehouseDetails = gql`
    ${warehouseDetailsFragment}
    query WarehouseDetails($id: ID!) {
        warehouse(id: $id) {
            ...WarehouseDetailsFragment
        }
    }
`;
export const useWarehouseDetails = makeQuery<WarehouseDetails, WarehouseDetailsVariables>(
    warehouseDetails
);

import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchCustomers, SearchCustomersVariables } from "./types/SearchCustomers";

export const searchCustomers = gql`
    ${pageInfoFragment}
    query SearchCustomers($after: String, $first: Int!, $query: String!) {
        search: customers(after: $after, first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    email
                    firstName
                    lastName
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

// @ts-ignore
export default makeTopLevelSearch<SearchCustomers, SearchCustomersVariables>(searchCustomers);

// @ts-nocheck
import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchPageTypes, SearchPageTypesVariables } from "./types/SearchPageTypes";

export const searchPageTypes = gql`
    ${pageInfoFragment}
    query SearchPageTypes($after: String, $first: Int!, $query: String!) {
        search: pageTypes(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchPageTypes, SearchPageTypesVariables>(searchPageTypes);

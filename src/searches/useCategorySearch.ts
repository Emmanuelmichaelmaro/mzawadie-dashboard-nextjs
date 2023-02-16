import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchCategories, SearchCategoriesVariables } from "./types/SearchCategories";

export const searchCategories = gql`
    ${pageInfoFragment}
    query SearchCategories($after: String, $first: Int!, $query: String!) {
        search: categories(after: $after, first: $first, filter: { search: $query }) {
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

// @ts-ignore
export default makeTopLevelSearch<SearchCategories, SearchCategoriesVariables>(searchCategories);

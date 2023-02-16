import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchPages, SearchPagesVariables } from "./types/SearchPages";

export const searchPages = gql`
    ${pageInfoFragment}
    query SearchPages($after: String, $first: Int!, $query: String!) {
        search: pages(after: $after, first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    title
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

// @ts-ignore
export default makeTopLevelSearch<SearchPages, SearchPagesVariables>(searchPages);

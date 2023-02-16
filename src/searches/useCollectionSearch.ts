import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchCollections, SearchCollectionsVariables } from "./types/SearchCollections";

export const searchCollections = gql`
    ${pageInfoFragment}
    query SearchCollections($after: String, $first: Int!, $query: String!) {
        search: collections(after: $after, first: $first, filter: { search: $query }) {
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
export default makeTopLevelSearch<SearchCollections, SearchCollectionsVariables>(searchCollections);

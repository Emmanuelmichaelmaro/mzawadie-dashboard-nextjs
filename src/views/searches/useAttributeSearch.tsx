import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import makeTopLevelSearch from "@mzawadie/hooks/makeTopLevelSearch";

import { SearchAttributes, SearchAttributesVariables } from "./types/SearchAttributes";

export const searchAttributes = gql`
    ${pageInfoFragment}
    query SearchAttributes($after: String, $first: Int!, $query: String!) {
        search: attributes(after: $after, first: $first, filter: { search: $query }) {
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default makeTopLevelSearch<SearchAttributes, SearchAttributesVariables>(searchAttributes);

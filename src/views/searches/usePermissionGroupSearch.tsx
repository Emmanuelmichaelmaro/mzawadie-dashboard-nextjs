// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import makeTopLevelSearch from "@mzawadie/hooks/makeTopLevelSearch";

import {
    SearchPermissionGroups,
    SearchPermissionGroupsVariables,
} from "./types/SearchPermissionGroups";

export const searchPermissionGroups = gql`
    ${pageInfoFragment}
    query SearchPermissionGroups($after: String, $first: Int!, $query: String!) {
        search: permissionGroups(after: $after, first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    name
                    userCanManage
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

export default makeTopLevelSearch<SearchPermissionGroups, SearchPermissionGroupsVariables>(
    searchPermissionGroups
);

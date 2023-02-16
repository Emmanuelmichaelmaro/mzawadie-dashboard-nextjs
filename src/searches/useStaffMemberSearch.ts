import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { makeTopLevelSearch } from "@mzawadie/hooks";

import { SearchStaffMembers, SearchStaffMembersVariables } from "./types/SearchStaffMembers";

export const searchStaffMembers = gql`
    ${pageInfoFragment}
    query SearchStaffMembers($after: String, $first: Int!, $query: String!) {
        search: staffUsers(after: $after, first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    email
                    firstName
                    lastName
                    isActive
                    avatar {
                        alt
                        url
                    }
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;

// @ts-ignore
export default makeTopLevelSearch<SearchStaffMembers, SearchStaffMembersVariables>(searchStaffMembers);

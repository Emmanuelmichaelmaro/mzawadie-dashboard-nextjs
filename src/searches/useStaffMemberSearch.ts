// @ts-nocheck
import { gql } from "@apollo/client";
import {
    SearchStaffMembersDocument,
    SearchStaffMembersQuery,
    SearchStaffMembersQueryVariables,
} from "@mzawadie/graphql";
import { makeTopLevelSearch } from "@mzawadie/hooks";

export const searchStaffMembers = gql`
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
                ...PageInfo
            }
        }
    }
`;

export default makeTopLevelSearch<SearchStaffMembersQuery, SearchStaffMembersQueryVariables>(
    SearchStaffMembersDocument
);

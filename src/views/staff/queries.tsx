import { gql } from "@apollo/client";
import { TypedQuery } from "@mzawadie/core";
import { staffMemberDetailsFragment, staffMemberFragment } from "@mzawadie/fragments/staff";
import makeQuery from "@mzawadie/hooks/makeQuery";
import { StaffList, StaffListVariables } from "@mzawadie/views/staff/types/StaffList";
import {
    StaffMemberDetails,
    StaffMemberDetailsVariables,
} from "@mzawadie/views/staff/types/StaffMemberDetails";

const staffList = gql`
    ${staffMemberFragment}
    query StaffList(
        $first: Int
        $after: String
        $last: Int
        $before: String
        $filter: StaffUserInput
        $sort: UserSortingInput
    ) {
        staffUsers(
            before: $before
            after: $after
            first: $first
            last: $last
            filter: $filter
            sortBy: $sort
        ) {
            edges {
                cursor
                node {
                    ...StaffMemberFragment
                    avatar(size: 48) {
                        url
                    }
                }
            }
            pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
            }
        }
    }
`;
export const useStaffListQuery = makeQuery<StaffList, StaffListVariables>(staffList);

export const staffMemberDetails = gql`
    ${staffMemberDetailsFragment}
    query StaffMemberDetails($id: ID!) {
        user(id: $id) {
            ...StaffMemberDetailsFragment
        }
    }
`;
export const TypedStaffMemberDetailsQuery = TypedQuery<StaffMemberDetails, StaffMemberDetailsVariables>(
    staffMemberDetails
);

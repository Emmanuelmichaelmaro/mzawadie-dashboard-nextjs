/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const staffMemberFragment = gql`
    fragment StaffMemberFragment on User {
        id
        email
        firstName
        isActive
        lastName
    }
`;
export const staffMemberDetailsFragment = gql`
    ${staffMemberFragment}
    fragment StaffMemberDetailsFragment on User {
        ...StaffMemberFragment
        permissionGroups {
            id
            name
            userCanManage
        }
        userPermissions {
            code
            name
        }
        avatar(size: 120) {
            url
        }
    }
`;

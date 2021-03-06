import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { accountErrorFragment, staffErrorFragment } from "@mzawadie/fragments/errors";
import { staffMemberDetailsFragment } from "@mzawadie/fragments/staff";
import makeMutation from "@mzawadie/hooks/makeMutation";
import {
    ChangeStaffPassword,
    ChangeStaffPasswordVariables,
} from "@mzawadie/views/staff/types/ChangeStaffPassword";
import { StaffAvatarDelete } from "@mzawadie/views/staff/types/StaffAvatarDelete";
import {
    StaffAvatarUpdate,
    StaffAvatarUpdateVariables,
} from "@mzawadie/views/staff/types/StaffAvatarUpdate";
import { StaffMemberAdd, StaffMemberAddVariables } from "@mzawadie/views/staff/types/StaffMemberAdd";
import {
    StaffMemberDelete,
    StaffMemberDeleteVariables,
} from "@mzawadie/views/staff/types/StaffMemberDelete";
import {
    StaffMemberUpdate,
    StaffMemberUpdateVariables,
} from "@mzawadie/views/staff/types/StaffMemberUpdate";

const staffMemberAddMutation = gql`
    ${staffErrorFragment}
    ${staffMemberDetailsFragment}
    mutation StaffMemberAdd($input: StaffCreateInput!) {
        staffCreate(input: $input) {
            errors {
                ...StaffErrorFragment
            }
            user {
                ...StaffMemberDetailsFragment
            }
        }
    }
`;
export const useStaffMemberAddMutation = makeMutation<StaffMemberAdd, StaffMemberAddVariables>(
    staffMemberAddMutation
);

const staffMemberUpdateMutation = gql`
    ${staffErrorFragment}
    ${staffMemberDetailsFragment}
    mutation StaffMemberUpdate($id: ID!, $input: StaffUpdateInput!) {
        staffUpdate(id: $id, input: $input) {
            errors {
                ...StaffErrorFragment
            }
            user {
                ...StaffMemberDetailsFragment
            }
        }
    }
`;
export const TypedStaffMemberUpdateMutation = TypedMutation<
    StaffMemberUpdate,
    StaffMemberUpdateVariables
>(staffMemberUpdateMutation);

const staffMemberDeleteMutation = gql`
    ${staffErrorFragment}
    mutation StaffMemberDelete($id: ID!) {
        staffDelete(id: $id) {
            errors {
                ...StaffErrorFragment
            }
        }
    }
`;
export const TypedStaffMemberDeleteMutation = TypedMutation<
    StaffMemberDelete,
    StaffMemberDeleteVariables
>(staffMemberDeleteMutation);

const staffAvatarUpdateMutation = gql`
    ${accountErrorFragment}
    mutation StaffAvatarUpdate($image: Upload!) {
        userAvatarUpdate(image: $image) {
            errors {
                ...AccountErrorFragment
            }
            user {
                id
                avatar {
                    url
                }
            }
        }
    }
`;
export const TypedStaffAvatarUpdateMutation = TypedMutation<
    StaffAvatarUpdate,
    StaffAvatarUpdateVariables
>(staffAvatarUpdateMutation);

const staffAvatarDeleteMutation = gql`
    ${accountErrorFragment}
    mutation StaffAvatarDelete {
        userAvatarDelete {
            errors {
                ...AccountErrorFragment
            }
            user {
                id
                avatar {
                    url
                }
            }
        }
    }
`;
export const TypedStaffAvatarDeleteMutation = TypedMutation<
    StaffAvatarDelete,
    StaffMemberDeleteVariables
>(staffAvatarDeleteMutation);

const changeStaffPassword = gql`
    ${accountErrorFragment}
    mutation ChangeStaffPassword($newPassword: String!, $oldPassword: String!) {
        passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
            errors {
                ...AccountErrorFragment
            }
        }
    }
`;
export const useChangeStaffPassword = makeMutation<ChangeStaffPassword, ChangeStaffPasswordVariables>(
    changeStaffPassword
);

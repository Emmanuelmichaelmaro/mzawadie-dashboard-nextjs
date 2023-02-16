import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { accountErrorFragment, staffErrorFragment } from "@mzawadie/fragments/errors";
import { staffMemberDetailsFragment } from "@mzawadie/fragments/staff";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { ChangeStaffPassword, ChangeStaffPasswordVariables } from "./types/ChangeStaffPassword";
import { StaffAvatarDelete } from "./types/StaffAvatarDelete";
import { StaffAvatarUpdate, StaffAvatarUpdateVariables } from "./types/StaffAvatarUpdate";
import { StaffMemberAdd, StaffMemberAddVariables } from "./types/StaffMemberAdd";
import { StaffMemberDelete, StaffMemberDeleteVariables } from "./types/StaffMemberDelete";
import { StaffMemberUpdate, StaffMemberUpdateVariables } from "./types/StaffMemberUpdate";

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
export const useStaffMemberUpdateMutation = makeMutation<StaffMemberUpdate, StaffMemberUpdateVariables>(
    staffMemberUpdateMutation
);

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

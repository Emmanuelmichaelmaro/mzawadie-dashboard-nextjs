import { gql } from "@apollo/client";
import { permissionGroupErrorFragment } from "@mzawadie/fragments/errors";
import { permissionGroupDetailsFragment } from "@mzawadie/fragments/permissionGroups";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { PermissionGroupCreate, PermissionGroupCreateVariables } from "./types/PermissionGroupCreate";
import { PermissionGroupDelete, PermissionGroupDeleteVariables } from "./types/PermissionGroupDelete";
import { PermissionGroupUpdate, PermissionGroupUpdateVariables } from "./types/PermissionGroupUpdate";

export const permissionGroupDelete = gql`
    ${permissionGroupErrorFragment}
    mutation PermissionGroupDelete($id: ID!) {
        permissionGroupDelete(id: $id) {
            errors {
                ...PermissionGroupErrorFragment
            }
        }
    }
`;
export const usePermissionGroupDelete = makeMutation<
    PermissionGroupDelete,
    PermissionGroupDeleteVariables
>(permissionGroupDelete);

export const permissionGroupCreate = gql`
    ${permissionGroupDetailsFragment}
    ${permissionGroupErrorFragment}

    mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
        permissionGroupCreate(input: $input) {
            errors {
                ...PermissionGroupErrorFragment
            }
            group {
                ...PermissionGroupDetailsFragment
            }
        }
    }
`;

export const usePermissionGroupCreate = makeMutation<
    PermissionGroupCreate,
    PermissionGroupCreateVariables
>(permissionGroupCreate);

export const permissionGroupUpdate = gql`
    ${permissionGroupDetailsFragment}
    ${permissionGroupErrorFragment}

    mutation PermissionGroupUpdate($id: ID!, $input: PermissionGroupUpdateInput!) {
        permissionGroupUpdate(id: $id, input: $input) {
            errors {
                ...PermissionGroupErrorFragment
            }
            group {
                ...PermissionGroupDetailsFragment
            }
        }
    }
`;

export const usePermissionGroupUpdate = makeMutation<
    PermissionGroupUpdate,
    PermissionGroupUpdateVariables
>(permissionGroupUpdate);

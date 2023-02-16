import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { accountErrorFragment } from "@mzawadie/fragments/errors";

import { RequestPasswordReset, RequestPasswordResetVariables } from "./types/RequestPasswordReset";

export const requestPasswordReset = gql`
    ${accountErrorFragment}
    mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
        requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
            errors {
                ...AccountErrorFragment
            }
        }
    }
`;

export const RequestPasswordResetMutation = TypedMutation<
    RequestPasswordReset,
    RequestPasswordResetVariables
>(requestPasswordReset);

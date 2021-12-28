import { gql } from "@apollo/client";

export const availableExternalAuthentications = gql`
    query AvailableExternalAuthentications {
        shop {
            availableExternalAuthentications {
                id
                name
            }
        }
    }
`;

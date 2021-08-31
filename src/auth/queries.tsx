import gql from "graphql-tag"

export const availableExternalAuthentications = /* GraphQL */ `
    query AvailableExternalAuthentications {
        shop {
            availableExternalAuthentications {
                id
                name
            }
        }
    }
`

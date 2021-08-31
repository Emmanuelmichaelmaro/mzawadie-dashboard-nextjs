export const fragmentUser = /* GraphQL */ `
    fragment User on User {
        id
        email
        firstName
        lastName
        isStaff
        userPermissions {
            code
            name
        }
        avatar {
            url
        }
    }
`

export const fragmentUserBase = /* GraphQL */ `
    fragment UserBase on User {
        id
        firstName
        lastName
    }
`

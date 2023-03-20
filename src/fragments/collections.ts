import { gql } from "@apollo/client";

export const collectionFragment = gql`
    fragment Collection on Collection {
        id
        name
        channelListings {
            isPublished
            publicationDate
            channel {
                id
                name
            }
        }
    }
`;

export const collectionDetailsFragment = gql`
    fragment CollectionDetails on Collection {
        ...Collection
        ...Metadata
        backgroundImage {
            alt
            url
        }
        slug
        description
        seoDescription
        seoTitle
    }
`;

// This fragment is used to make sure that product's fields that are returned
// are always the same - fixes apollo cache
// https://github.com/apollographql/apollo-client/issues/2496
// https://github.com/apollographql/apollo-client/issues/3468
export const collectionProductFragment = gql`
    fragment CollectionProduct on Product {
        id
        name
        productType {
            id
            name
        }
        thumbnail {
            url
        }
        channelListings {
            ...ChannelListingProductWithoutPricing
        }
    }
`;

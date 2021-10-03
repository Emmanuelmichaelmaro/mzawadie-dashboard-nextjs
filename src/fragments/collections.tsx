/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

import { metadataFragment } from "./metadata";
import { channelListingProductWithoutPricingFragment } from "./products";

export const collectionFragment = gql`
    fragment CollectionFragment on Collection {
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
    ${collectionFragment}
    ${metadataFragment}
    fragment CollectionDetailsFragment on Collection {
        ...CollectionFragment
        ...MetadataFragment
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
    ${channelListingProductWithoutPricingFragment}
    fragment CollectionProductFragment on Product {
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
            ...ChannelListingProductWithoutPricingFragment
        }
    }
`;

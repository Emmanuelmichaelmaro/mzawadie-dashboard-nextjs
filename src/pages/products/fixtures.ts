// @ts-nocheck
import { ProductList_products_edges_node } from "./types/ProductList";

export const products = (placeholderImage: string): ProductList_products_edges_node[] => [
    {
        __typename: "Product",
        attributes: [],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDo2MQ==",
        name: "Nebula Night Sky Paint",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6Nw==",
            name: "Paint",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo2NA==",
        name: "Light Speed Yellow Paint",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6Nw==",
            name: "Paint",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo2NQ==",
        name: "Hyperspace Turquoise Paint",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6Nw==",
            name: "Paint",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6MQ==",
                        name: "Pineapple",
                        reference: null,
                        slug: "pineapple",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3NQ==",
        name: "Pineapple Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6Mg==",
                        name: "Coconut",
                        reference: null,
                        slug: "coconut",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3Ng==",
        name: "Coconut Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6Mw==",
                        name: "Apple",
                        reference: null,
                        slug: "apple",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },

            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3Mg==",
        name: "Apple Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NDk=",
                        name: "Orange",
                        reference: null,
                        slug: "orange",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3MQ==",
        name: "Orange Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NTA=",
                        name: "Banana",
                        reference: null,
                        slug: "banana",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3NA==",
        name: "Banana Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NTE=",
                        name: "Bean",
                        reference: null,
                        slug: "bean",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDo3OQ==",
        name: "Bean Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NTI=",
                        name: "Carrot",
                        reference: null,
                        slug: "carrot",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDo3Mw==",
        name: "Carrot Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjE2",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NTM=",
                        name: "Sprouty",
                        reference: null,
                        slug: "sprouty",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDo3OA==",
        name: "Green Juice",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6OQ==",
            name: "Juice",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDo4OQ==",
        name: "Code Division T-shirt",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDoxMDc=",
        name: "Polo Shirt",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDoxMDg=",
        name: "Polo Shirt",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDoxMDk=",
        name: "Polo Shirt",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDoxMTA=",
        name: "Polo Shirt",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: false,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: false,
            },
        ],
        id: "UHJvZHVjdDoxMTU=",
        name: "Black Hoodie",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDoxMTY=",
        name: "Blue Hoodie",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjI1",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6ODI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDoxMTc=",
        name: "Mustard Hoodie",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTQ=",
            name: "Top (clothing)",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
    {
        __typename: "Product",
        attributes: [
            {
                __typename: "SelectedAttribute",
                attribute: {
                    __typename: "Attribute",
                    id: "QXR0cmlidXRlOjIz",
                },
                values: [
                    {
                        __typename: "AttributeValue",
                        file: null,
                        id: "QXR0cmlidXRlVmFsdWU6NzI=",
                        name: "Cotton",
                        reference: null,
                        slug: "cotton",
                        richText: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                    },
                ],
            },
        ],
        channelListings: [
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "123",
                    name: "Channel1",
                },
                isAvailableForPurchase: false,
                isPublished: true,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-14",
                visibleInListings: true,
            },
            {
                __typename: "ProductChannelListing",
                availableForPurchase: null,
                channel: {
                    __typename: "Channel",
                    currencyCode: "USD",
                    id: "124",
                    name: "Channel2",
                },
                isAvailableForPurchase: false,
                isPublished: false,
                pricing: {
                    __typename: "ProductPricingInfo",
                    priceRange: {
                        __typename: "TaxedMoneyRange",
                        start: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 1.2,
                                currency: "USD",
                            },
                        },
                        stop: {
                            __typename: "TaxedMoney",
                            net: {
                                __typename: "Money",
                                amount: 3.5,
                                currency: "USD",
                            },
                        },
                    },
                },
                publicationDate: "2020-07-30",
                visibleInListings: true,
            },
        ],
        id: "UHJvZHVjdDo4NQ==",
        name: "Colored Parrot Cushion",
        productType: {
            __typename: "ProductType",
            hasVariants: true,
            id: "UHJvZHVjdFR5cGU6MTI=",
            name: "Cushion",
        },
        thumbnail: {
            __typename: "Image",
            url: placeholderImage,
        },
    },
];

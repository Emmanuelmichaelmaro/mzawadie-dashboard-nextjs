// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fetchMoreProps, searchPageProps } from "@mzawadie/fixtures";
import { StockAvailability } from "@mzawadie/types/globalTypes";
import { mapEdgesToItems, mapSlugNodeToChoice } from "@mzawadie/utils/maps";
import { attributes } from "@mzawadie/views/attributes/fixtures";
import { categories } from "@mzawadie/views/categories/fixtures";
import { collections } from "@mzawadie/views/collections/fixtures";
import { productTypes } from "@mzawadie/views/productTypes/fixtures";
import { ProductListFilterOpts } from "@mzawadie/views/products/components/ProductListPage";

export const productListFilterOpts: ProductListFilterOpts = {
    attributes: attributes.map((attr) => ({
        id: attr.id,
        active: false,
        inputType: attr.inputType,
        name: attr.name,
        slug: attr.slug,
        value: [
            attr.choices.edges[0].node.slug,
            attr.choices.edges.length > 2 && attr.choices.edges[2].node.slug,
        ],
    })),
    attributeChoices: {
        ...fetchMoreProps,
        ...searchPageProps,
        active: false,
        value: null,
        choices: mapSlugNodeToChoice(mapEdgesToItems(attributes[0].choices)),
        displayValues: mapSlugNodeToChoice(mapEdgesToItems(attributes[0].choices)),
    },
    categories: {
        ...fetchMoreProps,
        ...searchPageProps,
        active: false,
        choices: categories.slice(5).map((category) => ({
            label: category.name,
            value: category.id,
        })),
        displayValues: [
            {
                label: categories[5].name,
                value: categories[5].id,
            },
        ],
        value: [categories[5].id],
    },
    channel: {
        active: false,
        value: "default-channel",
        choices: [
            {
                value: "default-channel",
                label: "Default channel",
            },
        ],
    },
    collections: {
        ...fetchMoreProps,
        ...searchPageProps,
        active: false,
        choices: collections.slice(5).map((category) => ({
            label: category.name,
            value: category.id,
        })),
        displayValues: [
            {
                label: collections[5].name,
                value: collections[5].id,
            },
        ],
        value: [collections[5].id],
    },
    price: {
        active: false,
        value: {
            max: "20",
            min: "10",
        },
    },
    productType: {
        ...fetchMoreProps,
        ...searchPageProps,
        active: false,
        choices: productTypes.slice(3).map((category) => ({
            label: category.name,
            value: category.id,
        })),
        displayValues: [
            {
                label: productTypes[3].name,
                value: productTypes[3].id,
            },
        ],
        value: [productTypes[4].id],
    },
    stockStatus: {
        active: false,
        value: StockAvailability.IN_STOCK,
    },
};

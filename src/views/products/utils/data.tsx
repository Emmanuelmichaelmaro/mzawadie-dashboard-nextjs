// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AttributeInput, VariantAttributeScope } from "@mzawadie/components/Attributes";
import { MetadataFormData } from "@mzawadie/components/Metadata/types";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { maybe } from "@mzawadie/core";
import { ProductVariant } from "@mzawadie/fragments/types/ProductVariant";
import { SelectedVariantAttributeFragment } from "@mzawadie/fragments/types/SelectedVariantAttributeFragment";
import { VariantAttributeFragment } from "@mzawadie/fragments/types/VariantAttributeFragment";
import { FormsetAtomicData } from "@mzawadie/hooks/useFormset";
import { StockInput } from "@mzawadie/types/globalTypes";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import {
    getSelectedAttributeValues,
    mergeChoicesWithValues,
} from "@mzawadie/views/attributes/utils/data";
import { ChannelData } from "@mzawadie/views/channels/utils";
import {
    ProductDetails_product,
    ProductDetails_product_collections,
    ProductDetails_product_variants,
} from "@mzawadie/views/products/types/ProductDetails";

import { ProductStockInput } from "../components/ProductStocks";
import { ProductType_productType_productAttributes } from "../types/ProductType";
import { ProductVariantCreateData_product } from "../types/ProductVariantCreateData";
import { ChannelsWithVariantsData } from "../views/ProductUpdate/types";

export interface Collection {
    id: string;
    label: string;
}

interface Node {
    id: string;
    name: string;
}

export interface ProductType {
    hasVariants: boolean;
    id: string;
    name: string;
    productAttributes: ProductType_productType_productAttributes[];
}

export function getAttributeInputFromProduct(product: ProductDetails_product): AttributeInput[] {
    return (
        product?.attributes?.map((attribute) => ({
            data: {
                entityType: attribute.attribute.entityType,
                inputType: attribute.attribute.inputType,
                isRequired: attribute.attribute.valueRequired,
                selectedValues: attribute.values,
                values: mergeChoicesWithValues(attribute),
                unit: attribute.attribute.unit,
            },
            id: attribute.attribute.id,
            label: attribute.attribute.name,
            value: getSelectedAttributeValues(attribute),
        })) ?? []
    );
}

export function getAttributeInputFromProductType(productType: ProductType): AttributeInput[] {
    return productType.productAttributes.map((attribute) => ({
        data: {
            entityType: attribute.entityType,
            inputType: attribute.inputType,
            isRequired: attribute.valueRequired,
            values: mapEdgesToItems(attribute.choices) || [],
            unit: attribute.unit,
        },
        id: attribute.id,
        label: attribute.name,
        value: [],
    }));
}

export function getAttributeInputFromAttributes(
    variantAttributes: VariantAttributeFragment[],
    variantAttributeScope: VariantAttributeScope
): AttributeInput[] {
    return variantAttributes?.map((attribute) => ({
        data: {
            entityType: attribute.entityType,
            inputType: attribute.inputType,
            isRequired: attribute.valueRequired,
            values: mapEdgesToItems(attribute.choices) || [],
            unit: attribute.unit,
            variantAttributeScope,
        },
        id: attribute.id,
        label: attribute.name,
        value: [],
    }));
}

export function getAttributeInputFromSelectedAttributes(
    variantAttributes: SelectedVariantAttributeFragment[],
    variantAttributeScope: VariantAttributeScope
): AttributeInput[] {
    return variantAttributes?.map((attribute) => ({
        data: {
            entityType: attribute.attribute.entityType,
            inputType: attribute.attribute.inputType,
            isRequired: attribute.attribute.valueRequired,
            selectedValues: attribute.values,
            values: mergeChoicesWithValues(attribute),
            unit: attribute.attribute.unit,
            variantAttributeScope,
        },
        id: attribute.attribute.id,
        label: attribute.attribute.name,
        value: getSelectedAttributeValues(attribute),
    }));
}

export function getAttributeInputFromVariant(variant: ProductVariant): AttributeInput[] {
    const selectionAttributeInput = getAttributeInputFromSelectedAttributes(
        variant?.selectionAttributes,
        VariantAttributeScope.VARIANT_SELECTION
    );
    const nonSelectionAttributeInput = getAttributeInputFromSelectedAttributes(
        variant?.nonSelectionAttributes,
        VariantAttributeScope.NOT_VARIANT_SELECTION
    );

    return selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? [];
}

export function getVariantAttributeInputFromProduct(
    product: ProductVariantCreateData_product
): AttributeInput[] {
    const selectionAttributeInput = getAttributeInputFromAttributes(
        product?.productType?.selectionVariantAttributes,
        VariantAttributeScope.VARIANT_SELECTION
    );

    const nonSelectionAttributeInput = getAttributeInputFromAttributes(
        product?.productType?.nonSelectionVariantAttributes,
        VariantAttributeScope.NOT_VARIANT_SELECTION
    );

    return selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? [];
}

export function getStockInputFromVariant(variant: ProductVariant): ProductStockInput[] {
    return (
        variant?.stocks.map((stock) => ({
            data: {
                quantityAllocated: stock.quantityAllocated,
            },
            id: stock.warehouse.id,
            label: stock.warehouse.name,
            value: stock.quantity.toString(),
        })) || []
    );
}

export function getStockInputFromProduct(product: ProductDetails_product): ProductStockInput[] {
    return product?.variants[0]?.stocks.map((stock) => ({
        data: {
            quantityAllocated: stock?.quantityAllocated,
        },
        id: stock.warehouse.id,
        label: stock.warehouse.name,
        value: stock.quantity.toString(),
    }));
}

export function getCollectionInput(
    productCollections: ProductDetails_product_collections[]
): Collection[] {
    return maybe(
        () =>
            productCollections.map((collection) => ({
                id: collection.id,
                label: collection.name,
            })),
        []
    );
}

export function getChoices(nodes: Node[]): SingleAutocompleteChoiceType[] {
    return maybe(
        () =>
            nodes.map((node) => ({
                label: node.name,
                value: node.id,
            })),
        []
    );
}

export interface ProductUpdatePageFormData extends MetadataFormData {
    category: string | null;
    changeTaxCode: boolean;
    channelsWithVariants: ChannelsWithVariantsData;
    channelListings: ChannelData[];
    channelsData: ChannelData[];
    chargeTaxes: boolean;
    collections: string[];
    isAvailable: boolean;
    name: string;
    slug: string;
    rating: number;
    seoDescription: string;
    seoTitle: string;
    sku: string;
    taxCode: string;
    trackInventory: boolean;
    weight: string;
}

export function getProductUpdatePageFormData(
    product: ProductDetails_product,
    variants: ProductDetails_product_variants[],
    currentChannels: ChannelData[],
    channelsData: ChannelData[],
    channelsWithVariants: ChannelsWithVariantsData
): ProductUpdatePageFormData {
    return {
        channelsWithVariants,
        channelsData,
        category: maybe(() => product.category.id, ""),
        changeTaxCode: !!product?.taxType.taxCode,
        chargeTaxes: maybe(() => product.chargeTaxes, false),
        collections: maybe(() => product.collections.map((collection) => collection.id), []),
        channelListings: currentChannels,
        isAvailable: !!product?.isAvailable,
        metadata: product?.metadata?.map(mapMetadataItemToInput),
        name: maybe(() => product.name, ""),
        privateMetadata: product?.privateMetadata?.map(mapMetadataItemToInput),
        rating: maybe(() => product.rating, null),
        seoDescription: maybe(() => product.seoDescription, ""),
        seoTitle: maybe(() => product.seoTitle, ""),
        sku: maybe(
            () =>
                product.productType.hasVariants
                    ? undefined
                    : variants && variants[0]
                    ? variants[0].sku
                    : undefined,
            ""
        ),
        slug: product?.slug || "",
        taxCode: product?.taxType.taxCode,
        trackInventory: !!product?.variants[0]?.trackInventory,
        weight: product?.weight?.value.toString() || "",
    };
}

export function mapFormsetStockToStockInput(stock: FormsetAtomicData<null, string>): StockInput {
    return {
        quantity: parseInt(stock.value, 10) || 0,
        warehouse: stock.id,
    };
}

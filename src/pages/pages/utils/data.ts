// @ts-nocheck
import { AttributeInput } from "@mzawadie/components/Attributes";
import { PageDetailsFragment } from "@mzawadie/graphql";
import {
    getSelectedAttributeValues,
    mergeChoicesWithValues,
} from "@mzawadie/pages/attributes/utils/data";
import { mapEdgesToItems } from "@mzawadie/utils/maps";

export function getAttributeInputFromPage(page: PageDetailsFragment): AttributeInput[] {
    return page?.attributes.map((attribute) => ({
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
    }));
}

export function getAttributeInputFromPageType(
    pageType: PageDetailsFragment["pageType"]
): AttributeInput[] {
    return pageType?.attributes.map((attribute) => ({
        data: {
            entityType: attribute.entityType,
            inputType: attribute.inputType,
            isRequired: attribute.valueRequired,
            values: mapEdgesToItems(attribute.choices) || [],
        },
        id: attribute.id,
        label: attribute.name,
        value: [],
    }));
}

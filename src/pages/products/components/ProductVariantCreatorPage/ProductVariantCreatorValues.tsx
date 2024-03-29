// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { getMultiChoices } from "@mzawadie/components/Attributes/utils";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { MultiAutocompleteSelectField } from "@mzawadie/components/MultiAutocompleteSelectField";
import Skeleton from "@mzawadie/components/Skeleton";
import { commonMessages, FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import {
    AttributeInputTypeEnum,
    AttributeValueFragment,
    ProductVariantAttributesFragment,
    SearchAttributeValuesQuery,
} from "@mzawadie/graphql";
import { getMeasurementUnitMessage } from "@mzawadie/pages/attributes/components/AttributeDetails/utils";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import {
    getBasicAttributeValue,
    getBooleanAttributeValue,
} from "@mzawadie/pages/products/components/ProductVariantCreatorPage/utils";
import React from "react";
import { defineMessages, FormattedMessage, IntlShape, useIntl } from "react-intl";

import { Attribute, AttributeValue, ProductVariantCreateFormData } from "./form";

const messages = defineMessages({
    multipleValueLabel: {
        defaultMessage: "Values",
        id: "j8PV7E",
        description: "attribute values",
    },
});

export function getVariantsNumber(data: ProductVariantCreateFormData): number {
    return data.attributes.reduce((variants, attribute) => variants * attribute.values.length, 1);
}

export function getMultiValues(
    attributes: Attribute[],
    attribute: ProductVariantAttributesFragment["productType"]["variantAttributes"][0]
) {
    return attributes.find(getById(attribute.id))?.values?.map((value) => value.slug);
}

export function getMultiDisplayValues(
    attributes: Attribute[],
    attribute: ProductVariantAttributesFragment["productType"]["variantAttributes"][0]
) {
    return attributes.find(getById(attribute.id))?.values.map((value) => ({
        label: value.value?.name,
        value: value.slug,
    }));
}

const getBooleanDisplayValues = (
    intl: IntlShape,
    values: Array<AttributeValue<Partial<AttributeValueFragment>>>
) => {
    if (!values.length) {
        return [];
    }

    const choices = getBooleanChoices(intl);
    return values.map(({ value: { boolean } }) => choices.find(({ value }) => value === boolean));
};

const getBooleanChoices = (
    intl: IntlShape,
    values?: Array<AttributeValue<Partial<AttributeValueFragment>>>
) => {
    const selectedValues = values?.map(({ value }) => value.boolean) ?? [];
    const choices = [
        { label: intl.formatMessage(commonMessages.yes), value: true },
        { label: intl.formatMessage(commonMessages.no), value: false },
    ];

    return choices.filter(({ value }) => !selectedValues.includes(value));
};

export interface ProductVariantCreatorValuesProps {
    attributes: ProductVariantAttributesFragment["productType"]["variantAttributes"];
    attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    fetchMoreAttributeValues?: FetchMoreProps;
    data: ProductVariantCreateFormData;
    variantsLeft: number | null;
    onValueClick: (attributeId: string, value: AttributeValue<Partial<AttributeValueFragment>>) => void;
    onValueBlur: () => void;
}

const ProductVariantCreatorValues: React.FC<ProductVariantCreatorValuesProps> = (props) => {
    const {
        attributes,
        attributeValues,
        fetchAttributeValues,
        fetchMoreAttributeValues,
        data,
        variantsLeft,
        onValueClick,
        onValueBlur,
    } = props;
    const intl = useIntl();
    const variantsNumber = getVariantsNumber(data);

    const handleValueClick = (
        attributeId: string,
        attributeName: string,
        attributeValue: string | boolean
    ) =>
        onValueClick(
            attributeId,
            typeof attributeValue === "boolean"
                ? getBooleanAttributeValue(attributeName, attributeValue)
                : getBasicAttributeValue(attributeId, attributeValue, attributeValues, data)
        );

    return (
        <>
            {variantsLeft !== null && variantsNumber > variantsLeft && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        defaultMessage: "SKU limit reached",
                        id: "FwHWUm",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You choices will add {variantsNumber} SKUs to your catalog which will exceed your limit by {aboveLimitVariantsNumber}. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="Xr5zxu"
                        values={{
                            variantsNumber,
                            aboveLimitVariantsNumber: variantsNumber - variantsLeft,
                        }}
                    />
                </LimitReachedAlert>
            )}
            {attributes.map((attribute) => (
                <React.Fragment key={attribute.id}>
                    <Card>
                        <CardTitle title={attribute?.name || <Skeleton />} />
                        <CardContent data-test-id="value-container">
                            {attribute.inputType === AttributeInputTypeEnum.BOOLEAN ? (
                                <MultiAutocompleteSelectField
                                    displayValues={getBooleanDisplayValues(
                                        intl,
                                        data.attributes.find(({ id }) => id === attribute.id).values
                                    )}
                                    name={`attribute:${attribute.name}`}
                                    label={intl.formatMessage(messages.multipleValueLabel)}
                                    value={getMultiValues(data.attributes, attribute)}
                                    onChange={(event) =>
                                        handleValueClick(
                                            attribute.id,
                                            attribute.name,
                                            event.target.value
                                        )
                                    }
                                    allowCustomValues={false}
                                    choices={getBooleanChoices(
                                        intl,
                                        data.attributes.find(({ id }) => id === attribute.id).values
                                    )}
                                />
                            ) : (
                                <MultiAutocompleteSelectField
                                    choices={getMultiChoices(attributeValues)}
                                    displayValues={getMultiDisplayValues(data.attributes, attribute)}
                                    name={`attribute:${attribute.name}`}
                                    label={intl.formatMessage(messages.multipleValueLabel)}
                                    value={getMultiValues(data.attributes, attribute)}
                                    onChange={(event) =>
                                        handleValueClick(
                                            attribute.id,
                                            attribute.name,
                                            event.target.value
                                        )
                                    }
                                    endAdornment={
                                        attribute.unit &&
                                        getMeasurementUnitMessage(attribute.unit, intl.formatMessage)
                                    }
                                    fetchOnFocus
                                    allowCustomValues
                                    fetchChoices={(value) => fetchAttributeValues(value, attribute.id)}
                                    onBlur={onValueBlur}
                                    {...fetchMoreAttributeValues}
                                />
                            )}
                        </CardContent>
                    </Card>
                    <CardSpacer />
                </React.Fragment>
            ))}
        </>
    );
};

ProductVariantCreatorValues.displayName = "ProductVariantCreatorValues";
export default ProductVariantCreatorValues;

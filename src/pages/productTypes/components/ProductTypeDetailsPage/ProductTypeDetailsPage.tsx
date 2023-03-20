// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import ControlledSwitch from "@mzawadie/components/ControlledSwitch";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { MetadataFormData } from "@mzawadie/components/Metadata/types";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames, maybe, ListActions, ReorderEvent, UserError } from "@mzawadie/core";
import {
    ProductAttributeType,
    ProductTypeDetailsQuery,
    ProductTypeKindEnum,
    WeightUnitsEnum,
} from "@mzawadie/graphql";
import { ChangeEvent, FormChange, SubmitPromise } from "@mzawadie/hooks";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";
import ProductTypeVariantAttributes from "../ProductTypeVariantAttributes/ProductTypeVariantAttributes";

interface ChoiceType {
    label: string;
    value: string;
}

export interface ProductTypeForm extends MetadataFormData {
    name: string;
    kind: ProductTypeKindEnum;
    hasVariants: boolean;
    isShippingRequired: boolean;
    taxType: string;
    productAttributes: ChoiceType[];
    variantAttributes: ChoiceType[];
    weight: number;
}

export interface ProductTypeDetailsPageProps {
    errors: UserError[];
    productType: ProductTypeDetailsQuery["productType"];
    defaultWeightUnit: WeightUnitsEnum;
    disabled: boolean;
    pageTitle: string;
    productAttributeList: ListActions;
    saveButtonBarState: ConfirmButtonTransitionState;
    taxTypes: ProductTypeDetailsQuery["taxTypes"];
    variantAttributeList: ListActions;
    onAttributeAdd: (type: ProductAttributeType) => void;
    onAttributeClick: (id: string) => void;
    onAttributeReorder: (event: ReorderEvent, type: ProductAttributeType) => void;
    onAttributeUnassign: (id: string) => void;
    onBack: () => void;
    onDelete: () => void;
    onHasVariantsToggle: (hasVariants: boolean) => void;
    onSubmit: (data: ProductTypeForm) => SubmitPromise;
    setSelectedVariantAttributes: (data: string[]) => void;
    selectedVariantAttributes: string[];
}

function handleTaxTypeChange(
    event: ChangeEvent,
    taxTypes: ProductTypeDetailsQuery["taxTypes"],
    formChange: FormChange,
    displayChange: (name: string) => void
) {
    formChange(event);
    displayChange(taxTypes.find((taxType) => taxType.taxCode === event.target.value).description);
}

const ProductTypeDetailsPage: React.FC<ProductTypeDetailsPageProps> = ({
    defaultWeightUnit,
    disabled,
    errors,
    pageTitle,
    productType,
    productAttributeList,
    saveButtonBarState,
    taxTypes,
    variantAttributeList,
    onAttributeAdd,
    onAttributeUnassign,
    onAttributeReorder,
    onAttributeClick,
    onBack,
    onDelete,
    onHasVariantsToggle,
    onSubmit,
    setSelectedVariantAttributes,
    selectedVariantAttributes,
}) => {
    const intl = useIntl();

    const {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler: makeMetadataChangeHandler,
    } = useMetadataChangeTrigger();

    const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps(
        maybe(() => productType.taxType.description, "")
    );
    const formInitialData: ProductTypeForm = {
        hasVariants:
            maybe(() => productType.hasVariants) !== undefined ? productType.hasVariants : false,
        isShippingRequired:
            maybe(() => productType.isShippingRequired) !== undefined
                ? productType.isShippingRequired
                : false,
        metadata: productType?.metadata?.map(mapMetadataItemToInput),
        name: maybe(() => productType.name) !== undefined ? productType.name : "",
        kind: productType?.kind || ProductTypeKindEnum.NORMAL,
        privateMetadata: productType?.privateMetadata?.map(mapMetadataItemToInput),
        productAttributes:
            maybe(() => productType.productAttributes) !== undefined
                ? productType.productAttributes.map((attribute) => ({
                      label: attribute.name,
                      value: attribute.id,
                  }))
                : [],
        taxType: maybe(() => productType.taxType.taxCode, ""),
        variantAttributes:
            maybe(() => productType.variantAttributes) !== undefined
                ? productType.variantAttributes.map((attribute) => ({
                      label: attribute.name,
                      value: attribute.id,
                  }))
                : [],
        weight: maybe(() => productType.weight.value),
    };

    const handleSubmit = (data: ProductTypeForm) => {
        const metadata = isMetadataModified ? data.metadata : undefined;
        const privateMetadata = isPrivateMetadataModified ? data.privateMetadata : undefined;

        return onSubmit({
            ...data,
            metadata,
            privateMetadata,
        });
    };

    return (
        <Form initial={formInitialData} onSubmit={handleSubmit} confirmLeave>
            {({ change, data, hasChanged, submit, setChanged }) => {
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.productTypes)}
                        </Backlink>
                        <PageHeader title={pageTitle} />
                        <Grid>
                            <div>
                                <ProductTypeDetails
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                    onKindChange={change}
                                />
                                <CardSpacer />
                                <ProductTypeTaxes
                                    disabled={disabled}
                                    data={data}
                                    taxTypes={taxTypes}
                                    taxTypeDisplayName={taxTypeDisplayName}
                                    onChange={(event) =>
                                        handleTaxTypeChange(
                                            event,
                                            taxTypes,
                                            change,
                                            setTaxTypeDisplayName
                                        )
                                    }
                                />
                                <CardSpacer />
                                <ProductTypeAttributes
                                    testId="assign-products-attributes"
                                    attributes={maybe(() => productType.productAttributes)}
                                    disabled={disabled}
                                    type={ProductAttributeType.PRODUCT}
                                    onAttributeAssign={onAttributeAdd}
                                    onAttributeClick={onAttributeClick}
                                    onAttributeReorder={(event: ReorderEvent) =>
                                        onAttributeReorder(event, ProductAttributeType.PRODUCT)
                                    }
                                    onAttributeUnassign={onAttributeUnassign}
                                    {...productAttributeList}
                                />
                                <CardSpacer />
                                <ControlledSwitch
                                    checked={data.hasVariants}
                                    disabled={disabled}
                                    label={intl.formatMessage({
                                        defaultMessage: "Product type uses Variant Attributes",
                                        id: "5pHBSU",
                                        description: "switch button",
                                    })}
                                    name="hasVariants"
                                    onChange={(event) => onHasVariantsToggle(event.target.value)}
                                />
                                {data.hasVariants && (
                                    <>
                                        <CardSpacer />
                                        <ProductTypeVariantAttributes
                                            testId="assign-variants-attributes"
                                            assignedVariantAttributes={
                                                productType?.assignedVariantAttributes
                                            }
                                            disabled={disabled}
                                            type={ProductAttributeType.VARIANT}
                                            onAttributeAssign={onAttributeAdd}
                                            onAttributeClick={onAttributeClick}
                                            onAttributeReorder={(event: ReorderEvent) =>
                                                onAttributeReorder(event, ProductAttributeType.VARIANT)
                                            }
                                            onAttributeUnassign={onAttributeUnassign}
                                            onAttributeVariantSelection={setChanged}
                                            setSelectedVariantAttributes={setSelectedVariantAttributes}
                                            selectedVariantAttributes={selectedVariantAttributes}
                                            {...variantAttributeList}
                                        />
                                    </>
                                )}
                                <CardSpacer />
                                <Metadata data={data} onChange={changeMetadata} />
                            </div>
                            <div>
                                <ProductTypeShipping
                                    disabled={disabled}
                                    data={data}
                                    weightUnit={productType?.weight?.unit || defaultWeightUnit}
                                    onChange={change}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            onCancel={onBack}
                            onDelete={onDelete}
                            onSubmit={submit}
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

ProductTypeDetailsPage.displayName = "ProductTypeDetailsPage";

export default ProductTypeDetailsPage;

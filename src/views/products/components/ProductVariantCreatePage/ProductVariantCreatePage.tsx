// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import AssignAttributeValueDialog from "@mzawadie/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput, VariantAttributeScope } from "@mzawadie/components/Attributes";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Grid from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { FetchMoreProps, ReorderAction } from "@mzawadie/core";
import { ProductErrorWithAttributesFragment } from "@mzawadie/fragments/types/ProductErrorWithAttributesFragment";
import {
    getAttributeValuesFromReferences,
    mergeAttributeValues,
} from "@mzawadie/views/attributes/utils/data";
import { ChannelPriceData } from "@mzawadie/views/channels/utils";
import { SearchAttributeValues_attribute_choices_edges_node } from "@mzawadie/views/searches/types/SearchAttributeValues";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/views/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@mzawadie/views/searches/types/SearchWarehouses";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantCreateForm, {
    ProductVariantCreateData,
    ProductVariantCreateHandlers,
} from "./form";

const messages = defineMessages({
    attributesHeader: {
        defaultMessage: "Variant Attributes",
        id: "f3B4tc",
        description: "attributes, section header",
    },
    attributesSelectionHeader: {
        defaultMessage: "Variant Selection Attributes",
        id: "o6260f",
        description: "attributes, section header",
    },
    deleteVariant: {
        defaultMessage: "Delete Variant",
        id: "7hNjaI",
        description: "button",
    },
    saveVariant: {
        defaultMessage: "Save variant",
        id: "U9CIo7",
        description: "button",
    },
    pricingCardSubtitle: {
        defaultMessage:
            "There is no channel to define prices for. You need to first add variant to channels to define prices.",
        id: "sw8Wl2",
        description: "variant pricing section subtitle",
    },
});

interface ProductVariantCreatePageProps {
    channels: ChannelPriceData[];
    disabled: boolean;
    errors: ProductErrorWithAttributesFragment[];
    header: string;
    product: ProductVariantCreateData_product;
    saveButtonBarState: ConfirmButtonTransitionState;
    warehouses: SearchWarehouses_search_edges_node[];
    weightUnit: string;
    referencePages?: SearchPages_search_edges_node[];
    referenceProducts?: SearchProducts_search_edges_node[];
    attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
    onBack: () => void;
    onSubmit: (data: ProductVariantCreateData) => void;
    onVariantClick: (variantId: string) => void;
    onVariantReorder: ReorderAction;
    onWarehouseConfigure: () => void;
    assignReferencesAttributeId?: string;
    onAssignReferencesClick: (attribute: AttributeInput) => void;
    fetchReferencePages?: (data: string) => void;
    fetchReferenceProducts?: (data: string) => void;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchMoreReferenceProducts?: FetchMoreProps;
    fetchMoreAttributeValues?: FetchMoreProps;
    onCloseDialog: () => void;
    onAttributeSelectBlur: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
    channels,
    disabled,
    errors,
    header,
    product,
    saveButtonBarState,
    warehouses,
    weightUnit,
    referencePages = [],
    referenceProducts = [],
    attributeValues,
    onBack,
    onSubmit,
    onVariantClick,
    onVariantReorder,
    onWarehouseConfigure,
    assignReferencesAttributeId,
    onAssignReferencesClick,
    fetchReferencePages,
    fetchReferenceProducts,
    fetchAttributeValues,
    fetchMoreReferencePages,
    fetchMoreReferenceProducts,
    fetchMoreAttributeValues,
    onCloseDialog,
    onAttributeSelectBlur,
}) => {
    const intl = useIntl();

    const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

    const handleAssignReferenceAttribute = (
        attributeValues: string[],
        data: ProductVariantCreateData,
        handlers: ProductVariantCreateHandlers
    ) => {
        handlers.selectAttributeReference(
            assignReferencesAttributeId,
            mergeAttributeValues(assignReferencesAttributeId, attributeValues, data.attributes)
        );
        onCloseDialog();
    };

    return (
        <ProductVariantCreateForm
            product={product}
            onSubmit={onSubmit}
            warehouses={warehouses}
            currentChannels={channels}
            referencePages={referencePages}
            referenceProducts={referenceProducts}
            fetchReferencePages={fetchReferencePages}
            fetchMoreReferencePages={fetchMoreReferencePages}
            fetchReferenceProducts={fetchReferenceProducts}
            fetchMoreReferenceProducts={fetchMoreReferenceProducts}
            assignReferencesAttributeId={assignReferencesAttributeId}
        >
            {({ change, data, disabled: formDisabled, handlers, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{product?.name}</Backlink>

                    <PageHeader title={header} />

                    <Grid variant="inverted">
                        <div>
                            <ProductVariantNavigation
                                fallbackThumbnail={product?.thumbnail?.url}
                                variants={product?.variants}
                                onRowClick={(variantId: string) => {
                                    if (product && product.variants) {
                                        return onVariantClick(variantId);
                                    }
                                }}
                                onReorder={onVariantReorder}
                            />
                        </div>

                        <div>
                            <Attributes
                                title={intl.formatMessage(messages.attributesHeader)}
                                attributes={data.attributes.filter(
                                    (attribute) =>
                                        attribute.data.variantAttributeScope ===
                                        VariantAttributeScope.NOT_VARIANT_SELECTION
                                )}
                                attributeValues={attributeValues}
                                loading={disabled}
                                disabled={disabled}
                                errors={errors}
                                onChange={handlers.selectAttribute}
                                onMultiChange={handlers.selectAttributeMultiple}
                                onFileChange={handlers.selectAttributeFile}
                                onReferencesRemove={handlers.selectAttributeReference}
                                onReferencesAddClick={onAssignReferencesClick}
                                onReferencesReorder={handlers.reorderAttributeValue}
                                fetchAttributeValues={fetchAttributeValues}
                                fetchMoreAttributeValues={fetchMoreAttributeValues}
                                onAttributeSelectBlur={onAttributeSelectBlur}
                            />

                            <CardSpacer />

                            <Attributes
                                title={intl.formatMessage(messages.attributesSelectionHeader)}
                                attributes={data.attributes.filter(
                                    (attribute) =>
                                        attribute.data.variantAttributeScope ===
                                        VariantAttributeScope.VARIANT_SELECTION
                                )}
                                attributeValues={attributeValues}
                                loading={disabled}
                                disabled={disabled}
                                errors={errors}
                                onChange={handlers.selectAttribute}
                                onMultiChange={handlers.selectAttributeMultiple}
                                onFileChange={handlers.selectAttributeFile}
                                onReferencesRemove={handlers.selectAttributeReference}
                                onReferencesAddClick={onAssignReferencesClick}
                                onReferencesReorder={handlers.reorderAttributeValue}
                                fetchAttributeValues={fetchAttributeValues}
                                fetchMoreAttributeValues={fetchMoreAttributeValues}
                                onAttributeSelectBlur={onAttributeSelectBlur}
                            />

                            <CardSpacer />

                            <ProductShipping
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                weightUnit={weightUnit}
                                onChange={change}
                            />

                            <CardSpacer />

                            <ProductVariantPrice disabledMessage={messages.pricingCardSubtitle} />

                            <CardSpacer />

                            <ProductStocks
                                data={data}
                                disabled={disabled}
                                hasVariants
                                onFormDataChange={change}
                                errors={errors}
                                stocks={data.stocks}
                                warehouses={warehouses}
                                onChange={handlers.changeStock}
                                onWarehouseStockAdd={handlers.addStock}
                                onWarehouseStockDelete={handlers.deleteStock}
                                onWarehouseConfigure={onWarehouseConfigure}
                            />

                            <CardSpacer />

                            <Metadata data={data} onChange={handlers.changeMetadata} />
                        </div>
                    </Grid>

                    <Savebar
                        disabled={disabled || formDisabled || !onSubmit || !hasChanged}
                        labels={{
                            confirm: intl.formatMessage(messages.saveVariant),
                            delete: intl.formatMessage(messages.deleteVariant),
                        }}
                        state={saveButtonBarState}
                        onCancel={onBack}
                        onSubmit={submit}
                    />

                    {canOpenAssignReferencesAttributeDialog && (
                        <AssignAttributeValueDialog
                            attributeValues={getAttributeValuesFromReferences(
                                assignReferencesAttributeId,
                                data.attributes,
                                referencePages,
                                referenceProducts
                            )}
                            hasMore={handlers.fetchMoreReferences?.hasMore}
                            open={canOpenAssignReferencesAttributeDialog}
                            onFetch={handlers.fetchReferences}
                            onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                            loading={handlers.fetchMoreReferences?.loading}
                            onClose={onCloseDialog}
                            onSubmit={(attributeValues) =>
                                handleAssignReferenceAttribute(attributeValues, data, handlers)
                            }
                        />
                    )}
                </Container>
            )}
        </ProductVariantCreateForm>
    );
};

ProductVariantCreatePage.displayName = "ProductVariantCreatePage";

export default ProductVariantCreatePage;

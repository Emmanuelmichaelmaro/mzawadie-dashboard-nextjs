// @ts-nocheck
import { AssignAttributeValueDialog } from "@mzawadie/components/AssignAttributeValueDialog";
import { Attributes, AttributeInput, VariantAttributeScope } from "@mzawadie/components/Attributes";
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { FetchMoreProps, ReorderAction, maybe } from "@mzawadie/core";
import { ProductChannelListingErrorFragment } from "@mzawadie/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@mzawadie/fragments/types/ProductErrorWithAttributesFragment";
import { ProductVariant } from "@mzawadie/fragments/types/ProductVariant";
import { WarehouseFragment } from "@mzawadie/fragments/types/WarehouseFragment";
import {
    getAttributeValuesFromReferences,
    mergeAttributeValues,
} from "@mzawadie/pages/attributes/utils/data";
import { ChannelPriceData } from "@mzawadie/pages/channels/utils";
import { VariantUpdate_productVariantUpdate_errors } from "@mzawadie/pages/products/types/VariantUpdate";
import { SearchAttributeValues_attribute_choices_edges_node } from "@mzawadie/searches/types/SearchAttributeValues";
import { SearchPages_search_edges_node } from "@mzawadie/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/searches/types/SearchProducts";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ProductShipping } from "../ProductShipping";
import { ProductStocks, ProductStockInput } from "../ProductStocks";
import { ProductVariantCheckoutSettings } from "../ProductVariantCheckoutSettings";
import { ProductVariantEndPreorderDialog } from "../ProductVariantEndPreorderDialog";
import { ProductVariantMediaSelectDialog } from "../ProductVariantImageSelectDialog";
import { ProductVariantMedia } from "../ProductVariantMedia";
import { ProductVariantNavigation } from "../ProductVariantNavigation";
import { ProductVariantPrice } from "../ProductVariantPrice";
import { ProductVariantSetDefault } from "../ProductVariantSetDefault";
import VariantDetailsChannelsAvailabilityCard from "./VariantDetailsChannelsAvailabilityCard";
import ProductVariantUpdateForm, {
    ProductVariantUpdateData,
    ProductVariantUpdateHandlers,
    ProductVariantUpdateSubmitData,
} from "./form";

const messages = defineMessages({
    nonSelectionAttributes: {
        defaultMessage: "Variant Attributes",
        id: "f3B4tc",
        description: "attributes, section header",
    },
    selectionAttributesHeader: {
        defaultMessage: "Variant Selection Attributes",
        id: "o6260f",
        description: "attributes, section header",
    },
});

export interface ProductVariantPageFormData extends MetadataFormData {
    costPrice: string;
    price: string;
    sku: string;
    trackInventory: boolean;
    weight: string;
}

export interface ProductVariantPageSubmitData extends ProductVariantPageFormData {
    attributes: AttributeInput[];
    addStocks: ProductStockInput[];
    updateStocks: ProductStockInput[];
    removeStocks: string[];
}

interface ProductVariantPageProps {
    assignReferencesAttributeId?: string;
    defaultVariantId?: string;
    defaultWeightUnit: string;
    errors: ProductErrorWithAttributesFragment[] | VariantUpdate_productVariantUpdate_errors[];
    header: string;
    channels: ChannelPriceData[];
    channelErrors: ProductChannelListingErrorFragment[];
    loading?: boolean;
    placeholderImage?: string;
    saveButtonBarState: ConfirmButtonTransitionState;
    variant?: ProductVariant;
    warehouses: WarehouseFragment[];
    referencePages?: SearchPages_search_edges_node[];
    referenceProducts?: SearchProducts_search_edges_node[];
    attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
    fetchMoreReferencePages?: FetchMoreProps;
    fetchMoreReferenceProducts?: FetchMoreProps;
    fetchMoreAttributeValues?: FetchMoreProps;
    fetchReferencePages?: (data: string) => void;
    fetchReferenceProducts?: (data: string) => void;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    onAssignReferencesClick: (attribute: AttributeInput) => void;
    onCloseDialog: () => void;
    onVariantPreorderDeactivate: (id: string) => void;
    variantDeactivatePreoderButtonState: ConfirmButtonTransitionState;
    onVariantReorder: ReorderAction;
    onAttributeSelectBlur: () => void;
    onAdd();
    onBack();
    onDelete();
    onSubmit(data: ProductVariantUpdateSubmitData);
    onMediaSelect(id: string);
    onVariantClick(variantId: string);
    onSetDefaultVariant();
    onWarehouseConfigure();
}

const ProductVariantPage: React.FC<ProductVariantPageProps> = ({
    channels,
    channelErrors,
    defaultVariantId,
    defaultWeightUnit,
    errors,
    header,
    loading,
    placeholderImage,
    saveButtonBarState,
    variant,
    warehouses,
    referencePages = [],
    referenceProducts = [],
    attributeValues,
    onAdd,
    onBack,
    onDelete,
    onMediaSelect,
    onSubmit,
    onVariantClick,
    onVariantPreorderDeactivate,
    variantDeactivatePreoderButtonState,
    onVariantReorder,
    onSetDefaultVariant,
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

    const [isModalOpened, setModalStatus] = React.useState(false);

    const toggleModal = () => setModalStatus(!isModalOpened);

    const [isEndPreorderModalOpened, setIsEndPreorderModalOpened] = React.useState(false);

    const variantMedia = variant?.media?.map((image) => image.id);
    const productMedia = variant?.product?.media?.sort((prev, next) =>
        prev.sortOrder > next.sortOrder ? 1 : -1
    );

    const media = productMedia
        ?.filter((image) => variantMedia.indexOf(image.id) !== -1)
        .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1));

    const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

    const handleDeactivatePreorder = async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await onVariantPreorderDeactivate(variant.id);
        setIsEndPreorderModalOpened(false);
    };

    const handleAssignReferenceAttribute = (
        attributeValues: string[],
        data: ProductVariantUpdateData,
        handlers: ProductVariantUpdateHandlers
    ) => {
        handlers.selectAttributeReference(
            assignReferencesAttributeId,
            mergeAttributeValues(assignReferencesAttributeId, attributeValues, data.attributes)
        );
        onCloseDialog();
    };

    return (
        <>
            <Container>
                <Backlink onClick={onBack}>{variant?.product?.name}</Backlink>

                <PageHeader title={header}>
                    {variant?.product?.defaultVariant?.id !== variant?.id && (
                        <ProductVariantSetDefault onSetDefaultVariant={onSetDefaultVariant} />
                    )}
                </PageHeader>

                <ProductVariantUpdateForm
                    variant={variant}
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
                    {({
                        change,
                        data,
                        formErrors,
                        disabled: formDisabled,
                        handlers,
                        hasChanged,
                        submit,
                    }) => (
                        <>
                            <Grid variant="inverted">
                                <div>
                                    <ProductVariantNavigation
                                        current={variant ? variant.id : undefined}
                                        defaultVariantId={defaultVariantId}
                                        fallbackThumbnail={maybe(() => variant.product.thumbnail.url)}
                                        variants={maybe(() => variant.product.variants)}
                                        onAdd={onAdd}
                                        onRowClick={(variantId: string) => {
                                            if (variant) {
                                                return onVariantClick(variantId);
                                            }
                                        }}
                                        onReorder={onVariantReorder}
                                    />
                                </div>

                                <div>
                                    <VariantDetailsChannelsAvailabilityCard variant={variant} />

                                    <Attributes
                                        entityId={variant?.id}
                                        title={intl.formatMessage(messages.nonSelectionAttributes)}
                                        attributes={data.attributes.filter(
                                            (attribute) =>
                                                attribute.data.variantAttributeScope ===
                                                VariantAttributeScope.NOT_VARIANT_SELECTION
                                        )}
                                        attributeValues={attributeValues}
                                        loading={loading}
                                        disabled={loading}
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
                                        entityId={variant?.id}
                                        title={intl.formatMessage(messages.selectionAttributesHeader)}
                                        attributes={data.attributes.filter(
                                            (attribute) =>
                                                attribute.data.variantAttributeScope ===
                                                VariantAttributeScope.VARIANT_SELECTION
                                        )}
                                        attributeValues={attributeValues}
                                        loading={loading}
                                        disabled={loading}
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

                                    <ProductVariantMedia
                                        disabled={loading}
                                        media={media}
                                        placeholderImage={placeholderImage}
                                        onImageAdd={toggleModal}
                                    />

                                    <CardSpacer />

                                    <ProductVariantPrice
                                        disabled={!variant}
                                        ProductVariantChannelListings={data.channelListings.map(
                                            (channel) => ({
                                                ...channel.data,
                                                ...channel.value,
                                            })
                                        )}
                                        errors={channelErrors}
                                        loading={loading}
                                        onChange={handlers.changeChannels}
                                    />

                                    <CardSpacer />

                                    <ProductVariantCheckoutSettings
                                        data={data}
                                        disabled={loading}
                                        errors={errors}
                                        onChange={change}
                                    />

                                    <CardSpacer />

                                    <ProductShipping
                                        data={data}
                                        disabled={loading}
                                        errors={errors}
                                        weightUnit={variant?.weight?.unit || defaultWeightUnit}
                                        onChange={change}
                                    />

                                    <CardSpacer />

                                    <ProductStocks
                                        productVariantChannelListings={data.channelListings.map(
                                            (channel) => ({
                                                ...channel.data,
                                                ...channel.value,
                                            })
                                        )}
                                        onVariantChannelListingChange={handlers.changeChannels}
                                        data={data}
                                        disabled={loading}
                                        hasVariants
                                        errors={errors}
                                        formErrors={formErrors}
                                        stocks={data.stocks}
                                        warehouses={warehouses}
                                        onChange={handlers.changeStock}
                                        onFormDataChange={change}
                                        onChangePreorderEndDate={handlers.changePreorderEndDate}
                                        onEndPreorderTrigger={
                                            !!variant?.preorder
                                                ? () => setIsEndPreorderModalOpened(true)
                                                : null
                                        }
                                        onWarehouseStockAdd={handlers.addStock}
                                        onWarehouseStockDelete={handlers.deleteStock}
                                        onWarehouseConfigure={onWarehouseConfigure}
                                    />

                                    <CardSpacer />

                                    <Metadata data={data} onChange={handlers.changeMetadata} />
                                </div>
                            </Grid>

                            <Savebar
                                disabled={loading || formDisabled || !hasChanged}
                                state={saveButtonBarState}
                                onCancel={onBack}
                                onDelete={onDelete}
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
                        </>
                    )}
                </ProductVariantUpdateForm>
            </Container>

            {variant && (
                <ProductVariantMediaSelectDialog
                    onClose={toggleModal}
                    onMediaSelect={onMediaSelect}
                    open={isModalOpened}
                    media={productMedia}
                    selectedMedia={maybe(() => variant.media.map((image) => image.id))}
                />
            )}

            {!!variant?.preorder && (
                <ProductVariantEndPreorderDialog
                    confirmButtonState={variantDeactivatePreoderButtonState}
                    onClose={() => setIsEndPreorderModalOpened(false)}
                    onConfirm={handleDeactivatePreorder}
                    open={isEndPreorderModalOpened}
                    variantGlobalSoldUnits={variant?.preorder?.globalSoldUnits}
                />
            )}
        </>
    );
};

ProductVariantPage.displayName = "ProductVariantPage";

export default ProductVariantPage;

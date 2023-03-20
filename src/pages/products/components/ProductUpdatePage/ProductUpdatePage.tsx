// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { AssignAttributeValueDialog } from "@mzawadie/components/AssignAttributeValueDialog";
import { Attributes, AttributeInput } from "@mzawadie/components/Attributes";
import { CardMenu } from "@mzawadie/components/CardMenu";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import {
    sectionNames,
    maybe,
    ChannelProps,
    FetchMoreProps,
    ListActions,
    ReorderAction,
    RelayToFlat,
} from "@mzawadie/core";
import {
    PermissionEnum,
    ProductChannelListingErrorFragment,
    ProductDetailsVariantFragment,
    ProductErrorWithAttributesFragment,
    ProductFragment,
    RefreshLimitsQuery,
    SearchAttributeValuesQuery,
    SearchCategoriesQuery,
    SearchCollectionsQuery,
    SearchPagesQuery,
    SearchProductsQuery,
    TaxTypeFragment,
    WarehouseFragment,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { FormsetData } from "@mzawadie/hooks/useFormset";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import {
    extensionMountPoints,
    mapToMenuItems,
    useExtensions,
} from "@mzawadie/pages/apps/useExtensions";
import {
    getAttributeValuesFromReferences,
    mergeAttributeValues,
} from "@mzawadie/pages/attributes/utils/data";
import ChannelsWithVariantsAvailabilityCard from "@mzawadie/pages/channels/components/ChannelsWithVariantsAvailabilityCard/ChannelsWithVariantsAvailabilityCard";
import { ChannelData } from "@mzawadie/pages/channels/utils";
import { ChannelsWithVariantsData } from "@mzawadie/pages/products/views/ProductUpdate/types";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { getChoices, ProductUpdatePageFormData } from "../../utils/data";
import { ProductDetailsForm } from "../ProductDetailsForm";
import { ProductExternalMediaDialog } from "../ProductExternalMediaDialog";
import { ProductMedia } from "../ProductMedia";
import { ProductOrganization } from "../ProductOrganization";
import { ProductShipping } from "../ProductShipping";
import { ProductStocks, ProductStockInput } from "../ProductStocks";
import { ProductTaxes } from "../ProductTaxes";
import { ProductVariantPrice } from "../ProductVariantPrice";
import { ProductVariants } from "../ProductVariants";
import ProductUpdateForm, { ProductUpdateData, ProductUpdateHandlers } from "./form";

export interface ProductUpdatePageProps extends ListActions, ChannelProps {
    channelsWithVariantsData: ChannelsWithVariantsData;
    setChannelsData: (data: ChannelData[]) => void;
    onChannelsChange: (data: ChannelData[]) => void;
    channelsData: ChannelData[];
    currentChannels: ChannelData[];
    allChannelsCount: number;
    channelsErrors: ProductChannelListingErrorFragment[];
    defaultWeightUnit: string;
    errors: ProductErrorWithAttributesFragment[];
    placeholderImage: string;
    collections: RelayToFlat<SearchCollectionsQuery["search"]>;
    categories: RelayToFlat<SearchCategoriesQuery["search"]>;
    attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
    disabled: boolean;
    fetchMoreCategories: FetchMoreProps;
    fetchMoreCollections: FetchMoreProps;
    isMediaUrlModalVisible?: boolean;
    limits: RefreshLimitsQuery["shop"]["limits"];
    variants: ProductDetailsVariantFragment[];
    media: ProductFragment["media"];
    hasChannelChanged: boolean;
    product: ProductFragment;
    header: string;
    saveButtonBarState: ConfirmButtonTransitionState;
    warehouses: WarehouseFragment[];
    taxTypes: TaxTypeFragment[];
    referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
    referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
    assignReferencesAttributeId?: string;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchMoreReferenceProducts?: FetchMoreProps;
    fetchMoreAttributeValues?: FetchMoreProps;
    isSimpleProduct: boolean;
    fetchCategories: (query: string) => void;
    fetchCollections: (query: string) => void;
    fetchReferencePages?: (data: string) => void;
    fetchReferenceProducts?: (data: string) => void;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    onAssignReferencesClick: (attribute: AttributeInput) => void;
    onCloseDialog: () => void;
    onVariantsAdd: () => void;
    onVariantShow: (id: string) => () => void;
    onVariantReorder: ReorderAction;
    onVariantEndPreorderDialogOpen: () => void;
    onImageDelete: (id: string) => () => void;
    onSubmit: (data: ProductUpdatePageSubmitData) => SubmitPromise;
    openChannelsModal: () => void;
    onAttributeSelectBlur: () => void;
    onBack?();
    onDelete();
    onImageEdit?(id: string);
    onImageReorder?(event: { oldIndex: number; newIndex: number });
    onImageUpload(file: File);
    onMediaUrlUpload(mediaUrl: string);
    onSeoClick?();
    onVariantAdd?();
    onSetDefaultVariant(variant: ProductDetailsVariantFragment);
    onWarehouseConfigure();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
    addStocks: ProductStockInput[];
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    collections: string[];
    description: OutputData;
    removeStocks: string[];
    updateStocks: ProductStockInput[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
    defaultWeightUnit,
    disabled,
    categories: categoryChoiceList,
    channelsErrors,
    collections: collectionChoiceList,
    attributeValues,
    isSimpleProduct,
    errors,
    fetchCategories,
    fetchCollections,
    fetchMoreCategories,
    fetchMoreCollections,
    media,
    hasChannelChanged,
    header,
    limits,
    placeholderImage,
    product,
    saveButtonBarState,
    variants,
    warehouses,
    setChannelsData,
    taxTypes,
    referencePages = [],
    referenceProducts = [],
    onBack,
    onDelete,
    allChannelsCount,
    currentChannels,
    onImageDelete,
    onImageEdit,
    onImageReorder,
    onImageUpload,
    onMediaUrlUpload,
    openChannelsModal,
    onSeoClick,
    onSubmit,
    onVariantAdd,
    channelsData,
    onVariantsAdd,
    onSetDefaultVariant,
    onVariantShow,
    onVariantReorder,
    onVariantEndPreorderDialogOpen,
    onWarehouseConfigure,
    isChecked,
    isMediaUrlModalVisible,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
    toolbar,
    assignReferencesAttributeId,
    onAssignReferencesClick,
    fetchReferencePages,
    fetchMoreReferencePages,
    fetchReferenceProducts,
    fetchMoreReferenceProducts,
    fetchAttributeValues,
    fetchMoreAttributeValues,
    onCloseDialog,
    channelsWithVariantsData,
    onChannelsChange,
    onAttributeSelectBlur,
}) => {
    const intl = useIntl();

    const [selectedCategory, setSelectedCategory] = useStateFromProps(product?.category?.name || "");

    const [mediaUrlModalStatus, setMediaUrlModalStatus] = useStateFromProps(
        isMediaUrlModalVisible || false
    );

    const [selectedCollections, setSelectedCollections] = useStateFromProps(
        getChoices(maybe(() => product.collections, []))
    );

    const [selectedTaxType, setSelectedTaxType] = useStateFromProps(product?.taxType.description);

    const categories = getChoices(categoryChoiceList);
    const collections = getChoices(collectionChoiceList);
    const hasVariants = product?.productType?.hasVariants;
    const taxTypeChoices =
        taxTypes?.map((taxType) => ({
            label: taxType.description,
            value: taxType.taxCode,
        })) || [];

    const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

    const handleAssignReferenceAttribute = (
        attributeValues: string[],
        data: ProductUpdateData,
        handlers: ProductUpdateHandlers
    ) => {
        handlers.selectAttributeReference(
            assignReferencesAttributeId,
            mergeAttributeValues(assignReferencesAttributeId, attributeValues, data.attributes)
        );
        onCloseDialog();
    };

    const { PRODUCT_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.PRODUCT_DETAILS);

    const extensionMenuItems = mapToMenuItems(PRODUCT_DETAILS_MORE_ACTIONS);

    return (
        <ProductUpdateForm
            isSimpleProduct={isSimpleProduct}
            currentChannels={currentChannels}
            channelsData={channelsData}
            setChannelsData={setChannelsData}
            onSubmit={onSubmit}
            product={product}
            categories={categories}
            collections={collections}
            channelsWithVariants={channelsWithVariantsData}
            selectedCollections={selectedCollections}
            setSelectedCategory={setSelectedCategory}
            setSelectedCollections={setSelectedCollections}
            setSelectedTaxType={setSelectedTaxType}
            setChannels={onChannelsChange}
            taxTypes={taxTypeChoices}
            warehouses={warehouses}
            hasVariants={hasVariants}
            referencePages={referencePages}
            referenceProducts={referenceProducts}
            fetchReferencePages={fetchReferencePages}
            fetchMoreReferencePages={fetchMoreReferencePages}
            fetchReferenceProducts={fetchReferenceProducts}
            fetchMoreReferenceProducts={fetchMoreReferenceProducts}
            assignReferencesAttributeId={assignReferencesAttributeId}
        >
            {({ change, data, formErrors, disabled: formDisabled, handlers, hasChanged, submit }) => (
                <>
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.products)}
                        </Backlink>
                        <PageHeader title={header}>
                            {extensionMenuItems.length > 0 && (
                                <CardMenu menuItems={extensionMenuItems} data-test-id="menu" />
                            )}
                        </PageHeader>
                        <Grid>
                            <div>
                                <ProductDetailsForm
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onDescriptionChange={handlers.changeDescription}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <ProductMedia
                                    media={media}
                                    placeholderImage={placeholderImage}
                                    onImageDelete={onImageDelete}
                                    onImageReorder={onImageReorder}
                                    onImageEdit={onImageEdit}
                                    onImageUpload={onImageUpload}
                                    openMediaUrlModal={() => setMediaUrlModalStatus(true)}
                                />
                                <CardSpacer />
                                {data.attributes.length > 0 && (
                                    <Attributes
                                        attributes={data.attributes}
                                        attributeValues={attributeValues}
                                        errors={errors}
                                        loading={disabled}
                                        disabled={disabled}
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
                                )}
                                <CardSpacer />
                                {isSimpleProduct && (
                                    <>
                                        <ProductVariantPrice
                                            ProductVariantChannelListings={data.channelListings}
                                            errors={channelsErrors}
                                            loading={disabled}
                                            onChange={handlers.changeChannelPrice}
                                        />
                                        <CardSpacer />
                                    </>
                                )}
                                {hasVariants ? (
                                    <ProductVariants
                                        disabled={disabled}
                                        limits={limits}
                                        variants={variants}
                                        product={product}
                                        onRowClick={onVariantShow}
                                        onVariantAdd={onVariantAdd}
                                        onVariantsAdd={onVariantsAdd}
                                        onVariantReorder={onVariantReorder}
                                        onSetDefaultVariant={onSetDefaultVariant}
                                        toolbar={toolbar}
                                        isChecked={isChecked}
                                        selected={selected}
                                        selectedChannelId={selectedChannelId}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                    />
                                ) : (
                                    <>
                                        <ProductShipping
                                            data={data}
                                            disabled={disabled}
                                            errors={errors}
                                            weightUnit={product?.weight?.unit || defaultWeightUnit}
                                            onChange={change}
                                        />
                                        <CardSpacer />
                                        <ProductStocks
                                            onVariantChannelListingChange={
                                                handlers.changeChannelPreorder
                                            }
                                            productVariantChannelListings={data.channelListings}
                                            onEndPreorderTrigger={
                                                !!variants?.[0]?.preorder
                                                    ? () => onVariantEndPreorderDialogOpen()
                                                    : null
                                            }
                                            data={data}
                                            disabled={disabled}
                                            hasVariants={false}
                                            errors={errors}
                                            formErrors={formErrors}
                                            stocks={data.stocks}
                                            warehouses={warehouses}
                                            onChange={handlers.changeStock}
                                            onFormDataChange={change}
                                            onChangePreorderEndDate={handlers.changePreorderEndDate}
                                            onWarehouseStockAdd={handlers.addStock}
                                            onWarehouseStockDelete={handlers.deleteStock}
                                            onWarehouseConfigure={onWarehouseConfigure}
                                        />
                                    </>
                                )}
                                <CardSpacer />
                                <SeoForm
                                    errors={errors}
                                    title={data.seoTitle}
                                    titlePlaceholder={data.name}
                                    description={data.seoDescription}
                                    descriptionPlaceholder="" // TODO: cast description to string
                                    slug={data.slug}
                                    slugPlaceholder={data.name}
                                    loading={disabled}
                                    onClick={onSeoClick}
                                    onChange={change}
                                    helperText={intl.formatMessage({
                                        defaultMessage:
                                            "Add search engine title and description to make this product easier to find",
                                        id: "LKoIB1",
                                    })}
                                />
                                <CardSpacer />
                                <Metadata data={data} onChange={handlers.changeMetadata} />
                            </div>
                            <div>
                                <ProductOrganization
                                    canChangeType={false}
                                    categories={categories}
                                    categoryInputDisplayValue={selectedCategory}
                                    collections={collections}
                                    collectionsInputDisplayValue={selectedCollections}
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    fetchCategories={fetchCategories}
                                    fetchCollections={fetchCollections}
                                    fetchMoreCategories={fetchMoreCategories}
                                    fetchMoreCollections={fetchMoreCollections}
                                    productType={product?.productType}
                                    onCategoryChange={handlers.selectCategory}
                                    onCollectionChange={handlers.selectCollection}
                                />
                                <CardSpacer />
                                {isSimpleProduct ? (
                                    <ChannelsAvailabilityCard
                                        managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                        messages={{
                                            hiddenLabel: intl.formatMessage({
                                                defaultMessage: "Not published",
                                                id: "saKXY3",
                                                description: "product label",
                                            }),

                                            visibleLabel: intl.formatMessage({
                                                defaultMessage: "Published",
                                                id: "qJedl0",
                                                description: "product label",
                                            }),
                                        }}
                                        errors={channelsErrors}
                                        selectedChannelsCount={data.channelListings.length}
                                        allChannelsCount={allChannelsCount}
                                        channels={data.channelListings}
                                        disabled={disabled}
                                        onChange={handlers.changeChannels}
                                        openModal={openChannelsModal}
                                    />
                                ) : (
                                    <ChannelsWithVariantsAvailabilityCard
                                        messages={{
                                            hiddenLabel: intl.formatMessage({
                                                defaultMessage: "Not published",
                                                description: "product label",
                                                id: "saKXY3",
                                            }),

                                            visibleLabel: intl.formatMessage({
                                                defaultMessage: "Published",
                                                description: "product label",
                                                id: "qJedl0",
                                            }),
                                        }}
                                        errors={channelsErrors}
                                        channels={data.channelsData}
                                        channelsWithVariantsData={channelsWithVariantsData}
                                        variants={variants}
                                        onChange={handlers.changeChannels}
                                        openModal={openChannelsModal}
                                    />
                                )}
                                <CardSpacer />
                                <ProductTaxes
                                    data={data}
                                    disabled={disabled}
                                    selectedTaxTypeDisplayName={selectedTaxType}
                                    taxTypes={taxTypes}
                                    onChange={change}
                                    onTaxTypeChange={handlers.selectTaxRate}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            onCancel={onBack}
                            onDelete={onDelete}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={disabled || formDisabled || (!hasChanged && !hasChannelChanged)}
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

                        <ProductExternalMediaDialog
                            product={product}
                            onClose={() => setMediaUrlModalStatus(false)}
                            open={mediaUrlModalStatus}
                            onSubmit={onMediaUrlUpload}
                        />
                    </Container>
                </>
            )}
        </ProductUpdateForm>
    );
};

ProductUpdatePage.displayName = "ProductUpdatePage";

export default ProductUpdatePage;

// @ts-nocheck
import { AssignAttributeValueDialog } from "@mzawadie/components/AssignAttributeValueDialog";
import { Attributes, AttributeInput } from "@mzawadie/components/Attributes";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata } from "@mzawadie/components/Metadata";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames, FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import {
    ProductChannelListingErrorFragment,
    ProductErrorWithAttributesFragment,
    TaxTypeFragment,
    PermissionEnum,
    ProductTypeQuery,
    SearchAttributeValuesQuery,
    SearchCategoriesQuery,
    SearchCollectionsQuery,
    SearchPagesQuery,
    SearchProductsQuery,
    SearchProductTypesQuery,
    SearchWarehousesQuery,
} from "@mzawadie/graphql";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import {
    getAttributeValuesFromReferences,
    mergeAttributeValues,
} from "@mzawadie/pages/attributes/utils/data";
import CannotDefineChannelsAvailabilityCard from "@mzawadie/pages/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@mzawadie/pages/channels/utils";
import { getChoices } from "@mzawadie/pages/products/utils/data";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ProductDetailsForm } from "../ProductDetailsForm";
import { ProductOrganization } from "../ProductOrganization";
import { ProductShipping } from "../ProductShipping";
import { ProductStocks } from "../ProductStocks";
import { ProductTaxes } from "../ProductTaxes";
import { ProductVariantPrice } from "../ProductVariantPrice";
import ProductCreateForm, {
    ProductCreateData,
    ProductCreateFormData,
    ProductCreateHandlers,
} from "./form";

interface ProductCreatePageProps {
    errors: ProductErrorWithAttributesFragment[];
    channelsErrors: ProductChannelListingErrorFragment[];
    allChannelsCount: number;
    currentChannels: ChannelData[];
    collections: RelayToFlat<SearchCollectionsQuery["search"]>;
    categories: RelayToFlat<SearchCategoriesQuery["search"]>;
    attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
    loading: boolean;
    fetchMoreCategories: FetchMoreProps;
    fetchMoreCollections: FetchMoreProps;
    fetchMoreProductTypes: FetchMoreProps;
    fetchMoreAttributeValues?: FetchMoreProps;
    initial?: Partial<ProductCreateFormData>;
    productTypes?: RelayToFlat<SearchProductTypesQuery["search"]>;
    referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
    referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
    header: string;
    saveButtonBarState: ConfirmButtonTransitionState;
    weightUnit: string;
    warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
    taxTypes: TaxTypeFragment[];
    selectedProductType?: ProductTypeQuery["productType"];
    fetchCategories: (data: string) => void;
    fetchCollections: (data: string) => void;
    fetchProductTypes: (data: string) => void;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    onWarehouseConfigure: () => void;
    openChannelsModal: () => void;
    onChannelsChange: (data: ChannelData[]) => void;
    assignReferencesAttributeId?: string;
    onAssignReferencesClick: (attribute: AttributeInput) => void;
    fetchReferencePages?: (data: string) => void;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchMoreReferenceProducts?: FetchMoreProps;
    onAttributeSelectBlur: () => void;
    onCloseDialog: () => void;
    onSelectProductType: (productTypeId: string) => void;
    onBack?();
    onSubmit?(data: ProductCreateData);
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
    allChannelsCount,
    channelsErrors,
    currentChannels,
    loading,
    categories: categoryChoiceList,
    collections: collectionChoiceList,
    attributeValues,
    errors,
    fetchCategories,
    fetchCollections,
    fetchMoreCategories,
    fetchMoreCollections,
    fetchMoreProductTypes,
    header,
    initial,
    productTypes: productTypeChoiceList,
    referencePages = [],
    referenceProducts = [],
    saveButtonBarState,
    warehouses,
    taxTypes,
    selectedProductType,
    onBack,
    fetchProductTypes,
    weightUnit,
    onSubmit,
    onChannelsChange,
    onWarehouseConfigure,
    openChannelsModal,
    assignReferencesAttributeId,
    onAssignReferencesClick,
    fetchReferencePages,
    fetchMoreReferencePages,
    fetchReferenceProducts,
    fetchMoreReferenceProducts,
    fetchAttributeValues,
    fetchMoreAttributeValues,
    onCloseDialog,
    onSelectProductType,
    onAttributeSelectBlur,
}: ProductCreatePageProps) => {
    const intl = useIntl();

    // Display values
    const [selectedCategory, setSelectedCategory] = useStateFromProps(initial?.category || "");

    const [selectedCollections, setSelectedCollections] = useStateFromProps<
        MultiAutocompleteChoiceType[]
    >([]);

    const [selectedTaxType, setSelectedTaxType] = useStateFromProps(initial?.taxCode || null);

    const categories = getChoices(categoryChoiceList);
    const collections = getChoices(collectionChoiceList);
    const productTypes = getChoices(productTypeChoiceList);

    const taxTypeChoices =
        taxTypes?.map((taxType) => ({
            label: taxType.description,
            value: taxType.taxCode,
        })) || [];

    const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

    const handleAssignReferenceAttribute = (
        attributeValues: string[],
        data: ProductCreateData,
        handlers: ProductCreateHandlers
    ) => {
        handlers.selectAttributeReference(
            assignReferencesAttributeId,
            mergeAttributeValues(assignReferencesAttributeId, attributeValues, data.attributes)
        );
        onCloseDialog();
    };

    return (
        <ProductCreateForm
            onSubmit={onSubmit}
            initial={initial}
            selectedProductType={selectedProductType}
            onSelectProductType={onSelectProductType}
            categories={categories}
            collections={collections}
            productTypes={productTypeChoiceList}
            referencePages={referencePages}
            referenceProducts={referenceProducts}
            selectedCollections={selectedCollections}
            setSelectedCategory={setSelectedCategory}
            setSelectedCollections={setSelectedCollections}
            setSelectedTaxType={setSelectedTaxType}
            setChannels={onChannelsChange}
            taxTypes={taxTypeChoices}
            warehouses={warehouses}
            currentChannels={currentChannels}
            fetchReferencePages={fetchReferencePages}
            fetchMoreReferencePages={fetchMoreReferencePages}
            fetchReferenceProducts={fetchReferenceProducts}
            fetchMoreReferenceProducts={fetchMoreReferenceProducts}
            assignReferencesAttributeId={assignReferencesAttributeId}
        >
            {({ change, data, formErrors, disabled: formDisabled, handlers, hasChanged, submit }) => {
                // Comparing explicitly to false because `hasVariants` can be undefined
                const isSimpleProduct = data.productType?.hasVariants === false;

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.products)}
                        </Backlink>

                        <PageHeader title={header} />

                        <Grid>
                            <div>
                                <ProductDetailsForm
                                    data={data}
                                    disabled={loading}
                                    errors={errors}
                                    onChange={change}
                                    onDescriptionChange={handlers.changeDescription}
                                />

                                <CardSpacer />

                                {data.attributes.length > 0 && (
                                    <Attributes
                                        attributes={data.attributes}
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
                                )}

                                <CardSpacer />

                                {isSimpleProduct && (
                                    <>
                                        <ProductShipping
                                            data={data}
                                            disabled={loading}
                                            errors={errors}
                                            weightUnit={weightUnit}
                                            onChange={change}
                                        />
                                        <CardSpacer />

                                        <ProductVariantPrice
                                            ProductVariantChannelListings={data.channelListings}
                                            errors={channelsErrors}
                                            loading={loading}
                                            onChange={handlers.changeChannelPrice}
                                        />
                                        <CardSpacer />

                                        <ProductStocks
                                            data={data}
                                            disabled={loading}
                                            hasVariants={false}
                                            onFormDataChange={change}
                                            errors={errors}
                                            formErrors={formErrors}
                                            stocks={data.stocks}
                                            warehouses={warehouses}
                                            onChange={handlers.changeStock}
                                            onChangePreorderEndDate={handlers.changePreorderEndDate}
                                            onWarehouseStockAdd={handlers.addStock}
                                            onWarehouseStockDelete={handlers.deleteStock}
                                            onWarehouseConfigure={onWarehouseConfigure}
                                        />
                                        <CardSpacer />
                                    </>
                                )}

                                <SeoForm
                                    allowEmptySlug
                                    helperText={intl.formatMessage({
                                        defaultMessage:
                                            "Add search engine title and description to make this product easier to find",
                                        id: "LKoIB1",
                                    })}
                                    title={data.seoTitle}
                                    slug={data.slug}
                                    slugPlaceholder={data.name}
                                    titlePlaceholder={data.name}
                                    description={data.seoDescription}
                                    descriptionPlaceholder={data.seoTitle}
                                    loading={loading}
                                    onChange={change}
                                />

                                <CardSpacer />

                                <Metadata data={data} onChange={handlers.changeMetadata} />
                            </div>

                            <div>
                                <ProductOrganization
                                    canChangeType
                                    categories={categories}
                                    categoryInputDisplayValue={selectedCategory}
                                    collections={collections}
                                    data={data}
                                    disabled={loading}
                                    errors={errors}
                                    fetchCategories={fetchCategories}
                                    fetchCollections={fetchCollections}
                                    fetchMoreCategories={fetchMoreCategories}
                                    fetchMoreCollections={fetchMoreCollections}
                                    fetchMoreProductTypes={fetchMoreProductTypes}
                                    fetchProductTypes={fetchProductTypes}
                                    productType={data.productType}
                                    productTypeInputDisplayValue={data.productType?.name || ""}
                                    productTypes={productTypes}
                                    onCategoryChange={handlers.selectCategory}
                                    onCollectionChange={handlers.selectCollection}
                                    onProductTypeChange={handlers.selectProductType}
                                    collectionsInputDisplayValue={selectedCollections}
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
                                        selectedChannelsCount={data.channelListings?.length || 0}
                                        allChannelsCount={allChannelsCount}
                                        channels={data.channelListings || []}
                                        disabled={loading}
                                        onChange={handlers.changeChannels}
                                        openModal={openChannelsModal}
                                    />
                                ) : (
                                    <CannotDefineChannelsAvailabilityCard />
                                )}

                                <CardSpacer />

                                <ProductTaxes
                                    data={data}
                                    disabled={loading}
                                    onChange={change}
                                    onTaxTypeChange={handlers.selectTaxRate}
                                    selectedTaxTypeDisplayName={selectedTaxType}
                                    taxTypes={taxTypes}
                                />
                            </div>
                        </Grid>

                        <Savebar
                            onCancel={onBack}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={loading || !onSubmit || formDisabled || !hasChanged}
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
                );
            }}
        </ProductCreateForm>
    );
};
ProductCreatePage.displayName = "ProductCreatePage";

export default ProductCreatePage;

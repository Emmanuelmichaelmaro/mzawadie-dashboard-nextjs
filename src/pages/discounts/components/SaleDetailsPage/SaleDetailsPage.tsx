// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata, MetadataFormData } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { Tab, TabContainer } from "@mzawadie/components/Tab";
import { sectionNames } from "@mzawadie/core";
import { splitDateTime } from "@mzawadie/core";
import { ChannelProps, ListProps, TabListActions } from "@mzawadie/core";
import {
    DiscountErrorFragment,
    PermissionEnum,
    SaleDetailsFragment,
    SaleType as SaleTypeEnum,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { ChannelSaleData, validateSalePrice } from "@mzawadie/pages/channels/utils";
import {
    createSaleChannelsChangeHandler,
    createSaleUpdateHandler,
} from "@mzawadie/pages/discounts/handlers";
import { itemsQuantityMessages } from "@mzawadie/pages/discounts/translations";
import { saleListUrl } from "@mzawadie/pages/discounts/urls";
import { SALE_UPDATE_FORM_ID } from "@mzawadie/pages/discounts/views/SaleDetails/types";
import { mapEdgesToItems, mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountCategories } from "../DiscountCategories";
import { DiscountCollections } from "../DiscountCollections";
import { DiscountDates } from "../DiscountDates";
import { DiscountProducts } from "../DiscountProducts";
import { DiscountVariants } from "../DiscountVariants";
import { SaleInfo } from "../SaleInfo";
import { SaleSummary } from "../SaleSummary";
import { SaleType } from "../SaleType";
import { SaleValue } from "../SaleValue";

export interface ChannelSaleFormData extends ChannelSaleData {
    percentageValue: string;
    fixedValue: string;
}

export interface SaleDetailsPageFormData extends MetadataFormData {
    channelListings: ChannelSaleFormData[];
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    name: string;
    startDate: string;
    startTime: string;
    type: SaleTypeEnum;
}

export enum SaleDetailsPageTab {
    categories = "categories",
    collections = "collections",
    products = "products",
    variants = "variants",
}

export type SaleTabItemsCount = Partial<Record<SaleDetailsPageTab, number>>;

export interface SaleDetailsPageProps
    extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
        TabListActions<
            | "categoryListToolbar"
            | "collectionListToolbar"
            | "productListToolbar"
            | "variantListToolbar"
        >,
        ChannelProps {
    activeTab: SaleDetailsPageTab;
    tabItemsCount: SaleTabItemsCount;
    errors: DiscountErrorFragment[];
    sale: SaleDetailsFragment;
    allChannelsCount: number;
    channelListings: ChannelSaleFormData[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onCategoryAssign: () => void;
    onCategoryUnassign: (id: string) => void;
    onCollectionAssign: () => void;
    onCollectionUnassign: (id: string) => void;
    onProductAssign: () => void;
    onProductUnassign: (id: string) => void;
    onVariantAssign: () => void;
    onVariantUnassign: (id: string) => void;
    onRemove: () => void;
    onSubmit: (data: SaleDetailsPageFormData) => SubmitPromise<any[]>;
    onTabClick: (index: SaleDetailsPageTab) => void;
    onChannelsChange: (data: ChannelSaleFormData[]) => void;
    openChannelsModal: () => void;
}

const CategoriesTab = Tab(SaleDetailsPageTab.categories);
const CollectionsTab = Tab(SaleDetailsPageTab.collections);
const ProductsTab = Tab(SaleDetailsPageTab.products);
const VariantsTab = Tab(SaleDetailsPageTab.variants);

const SaleDetailsPage: React.FC<SaleDetailsPageProps> = ({
    activeTab,
    tabItemsCount = {},
    allChannelsCount,
    channelListings = [],
    disabled,
    errors,
    onRemove,
    onSubmit,
    onTabClick,
    openChannelsModal,
    sale,
    saveButtonBarState,
    onCategoryAssign,
    onCategoryUnassign,
    onChannelsChange,
    onCollectionAssign,
    onCollectionUnassign,
    onProductAssign,
    onProductUnassign,
    onVariantAssign,
    onVariantUnassign,
    categoryListToolbar,
    collectionListToolbar,
    productListToolbar,
    variantListToolbar,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
}) => {
    const intl = useIntl();

    const navigate = useNavigator();

    const [localErrors, setLocalErrors] = React.useState<DiscountErrorFragment[]>([]);

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const initialForm: SaleDetailsPageFormData = {
        channelListings,
        endDate: splitDateTime(sale?.endDate ?? "").date,
        endTime: splitDateTime(sale?.endDate ?? "").time,
        hasEndDate: !!sale?.endDate,
        name: sale?.name ?? "",
        startDate: splitDateTime(sale?.startDate ?? "").date,
        startTime: splitDateTime(sale?.startDate ?? "").time,
        type: sale?.type ?? SaleTypeEnum.FIXED,
        metadata: sale?.metadata.map(mapMetadataItemToInput),
        privateMetadata: sale?.privateMetadata.map(mapMetadataItemToInput),
    };

    const checkIfSaveIsDisabled = (data: SaleDetailsPageFormData) =>
        data.channelListings?.some((channel) => validateSalePrice(data, channel)) || disabled;

    return (
        <Form
            confirmLeave
            initial={initialForm}
            onSubmit={onSubmit}
            formId={SALE_UPDATE_FORM_ID}
            checkIfSaveIsDisabled={checkIfSaveIsDisabled}
        >
            {({ change, data, submit, triggerChange }) => {
                const handleChannelChange = createSaleChannelsChangeHandler(
                    data.channelListings,
                    onChannelsChange,
                    triggerChange,
                    data.type
                );

                const changeMetadata = makeMetadataChangeHandler(change);

                const handleSubmit = createSaleUpdateHandler(submit, setLocalErrors);

                const allErrors = [...localErrors, ...errors];

                return (
                    <Container>
                        <Backlink href={saleListUrl()}>
                            {intl.formatMessage(sectionNames.sales)}
                        </Backlink>

                        <PageHeader title={sale?.name} />

                        <Grid>
                            <div>
                                <SaleInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />

                                <CardSpacer />

                                <SaleType data={data} disabled={disabled} onChange={change} />

                                <CardSpacer />

                                <SaleValue
                                    data={data}
                                    disabled={disabled}
                                    errors={allErrors}
                                    onChange={handleChannelChange}
                                />

                                <CardSpacer />

                                <TabContainer>
                                    <CategoriesTab
                                        testId="categories-tab"
                                        isActive={activeTab === SaleDetailsPageTab.categories}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(itemsQuantityMessages.categories, {
                                            quantity: tabItemsCount.categories?.toString() || "…",
                                        })}
                                    </CategoriesTab>

                                    <CollectionsTab
                                        testId="collections-tab"
                                        isActive={activeTab === SaleDetailsPageTab.collections}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(itemsQuantityMessages.collections, {
                                            quantity: tabItemsCount.collections?.toString() || "…",
                                        })}
                                    </CollectionsTab>

                                    <ProductsTab
                                        testId="products-tab"
                                        isActive={activeTab === SaleDetailsPageTab.products}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(itemsQuantityMessages.products, {
                                            quantity: tabItemsCount.products?.toString() || "…",
                                        })}
                                    </ProductsTab>

                                    <VariantsTab
                                        testId="variants-tab"
                                        isActive={activeTab === SaleDetailsPageTab.variants}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(itemsQuantityMessages.variants, {
                                            quantity: tabItemsCount.variants?.toString() || "…",
                                        })}
                                    </VariantsTab>
                                </TabContainer>

                                <CardSpacer />

                                {activeTab === SaleDetailsPageTab.categories ? (
                                    <DiscountCategories
                                        disabled={disabled}
                                        onCategoryAssign={onCategoryAssign}
                                        onCategoryUnassign={onCategoryUnassign}
                                        discount={sale}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={categoryListToolbar}
                                    />
                                ) : activeTab === SaleDetailsPageTab.collections ? (
                                    <DiscountCollections
                                        disabled={disabled}
                                        onCollectionAssign={onCollectionAssign}
                                        onCollectionUnassign={onCollectionUnassign}
                                        discount={sale}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={collectionListToolbar}
                                    />
                                ) : activeTab === SaleDetailsPageTab.products ? (
                                    <DiscountProducts
                                        disabled={disabled}
                                        onProductAssign={onProductAssign}
                                        onProductUnassign={onProductUnassign}
                                        products={mapEdgesToItems(sale?.products)}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={productListToolbar}
                                    />
                                ) : (
                                    <DiscountVariants
                                        disabled={disabled}
                                        onVariantAssign={onVariantAssign}
                                        onVariantUnassign={onVariantUnassign}
                                        variants={mapEdgesToItems(sale?.variants)}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={variantListToolbar}
                                    />
                                )}

                                <CardSpacer />

                                <DiscountDates
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                            </div>

                            <div>
                                <SaleSummary selectedChannelId={selectedChannelId} sale={sale} />

                                <CardSpacer />

                                <ChannelsAvailabilityCard
                                    managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                                    allChannelsCount={allChannelsCount}
                                    channelsList={data.channelListings.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                    }))}
                                    disabled={disabled}
                                    openModal={openChannelsModal}
                                />
                            </div>

                            <Metadata data={data} onChange={changeMetadata} />
                        </Grid>

                        <Savebar
                            disabled={disabled}
                            onCancel={() => navigate(saleListUrl())}
                            onDelete={onRemove}
                            onSubmit={() => handleSubmit(data)}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

SaleDetailsPage.displayName = "SaleDetailsPage";

export default SaleDetailsPage;

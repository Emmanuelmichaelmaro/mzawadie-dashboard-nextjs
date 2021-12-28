// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import ChannelsAvailabilityCard from "@mzawadie/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Metadata, { MetadataFormData } from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { Tab, TabContainer } from "@mzawadie/components/Tab";
import {
    sectionNames,
    maybe,
    splitDateTime,
    ChannelProps,
    ListProps,
    TabListActions,
} from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/fragments/types/DiscountErrorFragment";
import { PermissionEnum, SaleType as SaleTypeEnum } from "@mzawadie/types/globalTypes";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ChannelSaleData } from "@mzawadie/views/channels/utils";
import { createSaleChannelsChangeHandler } from "@mzawadie/views/discounts/handlers";
import { validatePrice } from "@mzawadie/views/products/utils/validation";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { SaleDetails_sale } from "../../types/SaleDetails";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
import SaleInfo from "../SaleInfo";
import SaleSummary from "../SaleSummary";
import SaleType from "../SaleType";
import SaleValue from "../SaleValue";

export interface SaleDetailsPageFormData extends MetadataFormData {
    channelListings: ChannelSaleData[];
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
}
export function saleDetailsPageTab(tab: string): SaleDetailsPageTab {
    return tab === SaleDetailsPageTab.products
        ? SaleDetailsPageTab.products
        : tab === SaleDetailsPageTab.collections
        ? SaleDetailsPageTab.collections
        : SaleDetailsPageTab.categories;
}

export interface SaleDetailsPageProps
    extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
        TabListActions<"categoryListToolbar" | "collectionListToolbar" | "productListToolbar">,
        ChannelProps {
    activeTab: SaleDetailsPageTab;
    errors: DiscountErrorFragment[];
    sale: SaleDetails_sale;
    allChannelsCount: number;
    channelListings: ChannelSaleData[];
    hasChannelChanged: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onCategoryAssign: () => void;
    onCategoryUnassign: (id: string) => void;
    onCategoryClick: (id: string) => () => void;
    onCollectionAssign: () => void;
    onCollectionUnassign: (id: string) => void;
    onCollectionClick: (id: string) => () => void;
    onProductAssign: () => void;
    onProductUnassign: (id: string) => void;
    onProductClick: (id: string) => () => void;
    onRemove: () => void;
    onSubmit: (data: SaleDetailsPageFormData) => void;
    onTabClick: (index: SaleDetailsPageTab) => void;
    onChannelsChange: (data: ChannelSaleData[]) => void;
    openChannelsModal: () => void;
}

const CategoriesTab = Tab(SaleDetailsPageTab.categories);
const CollectionsTab = Tab(SaleDetailsPageTab.collections);
const ProductsTab = Tab(SaleDetailsPageTab.products);

const SaleDetailsPage: React.FC<SaleDetailsPageProps> = ({
    activeTab,
    allChannelsCount,
    channelListings = [],
    disabled,
    errors,
    onRemove,
    onSubmit,
    onTabClick,
    hasChannelChanged,
    openChannelsModal,
    pageInfo,
    sale,
    saveButtonBarState,
    onBack,
    onCategoryAssign,
    onCategoryUnassign,
    onCategoryClick,
    onChannelsChange,
    onCollectionAssign,
    onCollectionUnassign,
    onCollectionClick,
    onNextPage,
    onPreviousPage,
    onProductAssign,
    onProductUnassign,
    onProductClick,
    categoryListToolbar,
    collectionListToolbar,
    productListToolbar,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
}) => {
    const intl = useIntl();
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
    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, triggerChange }) => {
                const handleChannelChange = createSaleChannelsChangeHandler(
                    data.channelListings,
                    onChannelsChange,
                    triggerChange
                );
                const formDisabled = data.channelListings?.some((channel) =>
                    validatePrice(channel.discountValue)
                );
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.sales)}</Backlink>
                        <PageHeader title={maybe(() => sale.name)} />
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
                                    errors={errors}
                                    onChange={handleChannelChange}
                                />
                                <CardSpacer />
                                <TabContainer>
                                    <CategoriesTab
                                        isActive={activeTab === SaleDetailsPageTab.categories}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(
                                            {
                                                defaultMessage: "Categories ({quantity})",
                                                description: "number of categories",
                                                id: "ppLwx3",
                                            },
                                            {
                                                quantity: maybe(
                                                    () => sale.categories?.totalCount?.toString(),
                                                    "…"
                                                ),
                                            }
                                        )}
                                    </CategoriesTab>
                                    <CollectionsTab
                                        isActive={activeTab === SaleDetailsPageTab.collections}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(
                                            {
                                                defaultMessage: "Collections ({quantity})",
                                                description: "number of collections",
                                                id: "QdGzUf",
                                            },
                                            {
                                                quantity: maybe(
                                                    () => sale.collections?.totalCount?.toString(),
                                                    "…"
                                                ),
                                            }
                                        )}
                                    </CollectionsTab>
                                    <ProductsTab
                                        testId="products-tab"
                                        isActive={activeTab === SaleDetailsPageTab.products}
                                        changeTab={onTabClick}
                                    >
                                        {intl.formatMessage(
                                            {
                                                defaultMessage: "Products ({quantity})",
                                                description: "number of products",
                                                id: "bNw8PM",
                                            },
                                            {
                                                quantity: maybe(
                                                    () => sale.products?.totalCount?.toString(),
                                                    "…"
                                                ),
                                            }
                                        )}
                                    </ProductsTab>
                                </TabContainer>
                                <CardSpacer />
                                {activeTab === SaleDetailsPageTab.categories ? (
                                    <DiscountCategories
                                        disabled={disabled}
                                        onCategoryAssign={onCategoryAssign}
                                        onCategoryUnassign={onCategoryUnassign}
                                        onNextPage={onNextPage}
                                        onPreviousPage={onPreviousPage}
                                        onRowClick={onCategoryClick}
                                        pageInfo={pageInfo}
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
                                        onNextPage={onNextPage}
                                        onPreviousPage={onPreviousPage}
                                        onRowClick={onCollectionClick}
                                        pageInfo={pageInfo}
                                        discount={sale}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={collectionListToolbar}
                                    />
                                ) : (
                                    <DiscountProducts
                                        disabled={disabled}
                                        onNextPage={onNextPage}
                                        onPreviousPage={onPreviousPage}
                                        onProductAssign={onProductAssign}
                                        onProductUnassign={onProductUnassign}
                                        onRowClick={onProductClick}
                                        pageInfo={pageInfo}
                                        discount={sale}
                                        channelsCount={allChannelsCount}
                                        isChecked={isChecked}
                                        selected={selected}
                                        toggle={toggle}
                                        toggleAll={toggleAll}
                                        toolbar={productListToolbar}
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
                                    selectedChannelsCount={data.channelListings.length}
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
                            disabled={disabled || formDisabled || (!hasChanged && !hasChannelChanged)}
                            onCancel={onBack}
                            onDelete={onRemove}
                            onSubmit={submit}
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

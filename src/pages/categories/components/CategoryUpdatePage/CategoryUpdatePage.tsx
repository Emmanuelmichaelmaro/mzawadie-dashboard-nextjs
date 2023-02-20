/* eslint-disable @typescript-eslint/member-ordering */
// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { Tab, TabContainer } from "@mzawadie/components/Tab";
import { ChannelProps, TabListActions, sectionNames, maybe } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    CategoryDetails_category,
    CategoryDetails_category_children_edges_node,
    CategoryDetails_category_products_edges_node,
} from "../../types/CategoryDetails";
import { CategoryBackground } from "../CategoryBackground";
import { CategoryDetailsForm } from "../CategoryDetailsForm";
import { CategoryList } from "../CategoryList";
import { CategoryProducts } from "../CategoryProducts";
import CategoryUpdateForm, { CategoryUpdateData } from "./form";

export enum CategoryPageTab {
    categories = "categories",
    products = "products",
}

export interface CategoryUpdatePageProps
    extends TabListActions<"productListToolbar" | "subcategoryListToolbar">,
        ChannelProps {
    changeTab: (index: CategoryPageTab) => void;
    currentTab: CategoryPageTab;
    errors: ProductErrorFragment[];
    disabled: boolean;
    category: CategoryDetails_category;
    products: CategoryDetails_category_products_edges_node[];
    subcategories: CategoryDetails_category_children_edges_node[];
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    saveButtonBarState: ConfirmButtonTransitionState;
    channelChoices: SingleAutocompleteChoiceType[];
    channelsCount: number;
    onImageDelete: () => void;
    onSubmit: (data: CategoryUpdateData) => SubmitPromise;
    onImageUpload: (file: File) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onProductClick(id: string): () => void;
    onAddProduct: () => void;
    onBack: () => void;
    onDelete: () => void;
    onAddCategory: () => void;
    onCategoryClick(id: string): () => void;
}

const CategoriesTab = Tab(CategoryPageTab.categories);
const ProductsTab = Tab(CategoryPageTab.products);

export const CategoryUpdatePage: React.FC<CategoryUpdatePageProps> = ({
    changeTab,
    channelChoices,
    channelsCount,
    currentTab,
    category,
    disabled,
    errors,
    pageInfo,
    products,
    saveButtonBarState,
    subcategories,
    onAddCategory,
    onAddProduct,
    onBack,
    onCategoryClick,
    onDelete,
    onNextPage,
    onPreviousPage,
    onProductClick,
    onSubmit,
    onImageDelete,
    onImageUpload,
    isChecked,
    productListToolbar,
    selected,
    selectedChannelId,
    subcategoryListToolbar,
    toggle,
    toggleAll,
}: CategoryUpdatePageProps) => {
    const intl = useIntl();

    return (
        <CategoryUpdateForm category={category} onSubmit={onSubmit}>
            {({ data, change, handlers, submit, hasChanged }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.categories)}</Backlink>

                    <PageHeader title={category?.name} />

                    <CategoryDetailsForm
                        data={data}
                        disabled={disabled}
                        errors={errors}
                        onChange={change}
                        onDescriptionChange={handlers.changeDescription}
                    />
                    <CardSpacer />

                    <CategoryBackground
                        data={data}
                        onImageUpload={onImageUpload}
                        onImageDelete={onImageDelete}
                        image={maybe(() => category.backgroundImage)}
                        onChange={change}
                    />

                    <CardSpacer />

                    <SeoForm
                        helperText={intl.formatMessage({
                            defaultMessage:
                                "Add search engine title and description to make this category easier to find",
                            id: "wQdR8M",
                        })}
                        errors={errors}
                        title={data.seoTitle}
                        titlePlaceholder={data.name}
                        description={data.seoDescription}
                        descriptionPlaceholder={data.name}
                        slug={data.slug}
                        slugPlaceholder={data.name}
                        loading={!category}
                        onChange={change}
                        disabled={disabled}
                    />

                    <CardSpacer />

                    <Metadata data={data} onChange={handlers.changeMetadata} />

                    <CardSpacer />

                    <TabContainer>
                        <CategoriesTab
                            isActive={currentTab === CategoryPageTab.categories}
                            changeTab={changeTab}
                        >
                            <FormattedMessage
                                defaultMessage="Subcategories"
                                id="JDz5h8"
                                description="number of subcategories in category"
                            />
                        </CategoriesTab>

                        <ProductsTab
                            testId="productsTab"
                            isActive={currentTab === CategoryPageTab.products}
                            changeTab={changeTab}
                        >
                            <FormattedMessage
                                defaultMessage="Products"
                                id="V+fkAO"
                                description="number of products in category"
                            />
                        </ProductsTab>
                    </TabContainer>

                    <CardSpacer />

                    {currentTab === CategoryPageTab.categories && (
                        <Card>
                            <CardTitle
                                title={intl.formatMessage({
                                    defaultMessage: "All Subcategories",
                                    id: "NivJal",
                                    description: "section header",
                                })}
                                toolbar={
                                    <Button
                                        color="primary"
                                        variant="text"
                                        onClick={onAddCategory}
                                        data-test-id="createSubcategory"
                                    >
                                        <FormattedMessage
                                            defaultMessage="Create subcategory"
                                            id="UycVMp"
                                            description="button"
                                        />
                                    </Button>
                                }
                            />

                            <CategoryList
                                categories={subcategories}
                                disabled={disabled}
                                isChecked={isChecked}
                                isRoot={false}
                                pageInfo={pageInfo}
                                selected={selected}
                                sort={undefined}
                                toggle={toggle}
                                toggleAll={toggleAll}
                                toolbar={subcategoryListToolbar}
                                onNextPage={onNextPage}
                                onPreviousPage={onPreviousPage}
                                onRowClick={onCategoryClick}
                                onSort={() => undefined}
                            />
                        </Card>
                    )}

                    {currentTab === CategoryPageTab.products && (
                        <CategoryProducts
                            channelsCount={channelsCount}
                            channelChoices={channelChoices}
                            categoryName={category?.name}
                            products={products}
                            disabled={disabled}
                            pageInfo={pageInfo}
                            onNextPage={onNextPage}
                            onPreviousPage={onPreviousPage}
                            onRowClick={onProductClick}
                            onAdd={onAddProduct}
                            toggle={toggle}
                            toggleAll={toggleAll}
                            selected={selected}
                            selectedChannelId={selectedChannelId}
                            isChecked={isChecked}
                            toolbar={productListToolbar}
                        />
                    )}

                    <Savebar
                        onCancel={onBack}
                        onDelete={onDelete}
                        onSubmit={submit}
                        state={saveButtonBarState}
                        disabled={disabled || !hasChanged}
                    />
                </Container>
            )}
        </CategoryUpdateForm>
    );
};

CategoryUpdatePage.displayName = "CategoryUpdatePage";

export default CategoryUpdatePage;

// @ts-nocheck
import AssignAttributeValueDialog from "@mzawadie/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@mzawadie/components/Attributes";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Grid from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import SeoForm from "@mzawadie/components/SeoForm";
import VisibilityCard from "@mzawadie/components/VisibilityCard";
import { sectionNames, FetchMoreProps } from "@mzawadie/core";
import { PageErrorWithAttributesFragment } from "@mzawadie/fragments/types/PageErrorWithAttributesFragment";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import {
    getAttributeValuesFromReferences,
    mergeAttributeValues,
} from "@mzawadie/views/attributes/utils/data";
import { PageType_pageType } from "@mzawadie/views/pages/types/PageType";
import { SearchAttributeValues_attribute_choices_edges_node } from "@mzawadie/views/searches/types/SearchAttributeValues";
import { SearchPageTypes_search_edges_node } from "@mzawadie/views/searches/types/SearchPageTypes";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/views/searches/types/SearchProducts";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { PageDetails_page } from "../../types/PageDetails";
import PageInfo from "../PageInfo";
import PageOrganizeContent from "../PageOrganizeContent";
import PageForm, { PageData, PageUpdateHandlers } from "./form";

export interface PageDetailsPageProps {
    loading: boolean;
    errors: PageErrorWithAttributesFragment[];
    page: PageDetails_page;
    pageTypes?: SearchPageTypes_search_edges_node[];
    referencePages?: SearchPages_search_edges_node[];
    referenceProducts?: SearchProducts_search_edges_node[];
    allowEmptySlug?: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    selectedPageType?: PageType_pageType;
    attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
    onBack: () => void;
    onRemove: () => void;
    onSubmit: (data: PageData) => SubmitPromise;
    fetchPageTypes?: (data: string) => void;
    fetchMorePageTypes?: FetchMoreProps;
    assignReferencesAttributeId?: string;
    onAssignReferencesClick: (attribute: AttributeInput) => void;
    fetchReferencePages?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferenceProducts?: FetchMoreProps;
    fetchAttributeValues: (query: string, attributeId: string) => void;
    fetchMoreAttributeValues?: FetchMoreProps;
    onCloseDialog: () => void;
    onSelectPageType?: (pageTypeId: string) => void;
    onAttributeSelectBlur: () => void;
}

const PageDetailsPage: React.FC<PageDetailsPageProps> = ({
    loading,
    errors,
    page,
    pageTypes: pageTypeChoiceList,
    referencePages,
    referenceProducts,
    saveButtonBarState,
    selectedPageType,
    attributeValues,
    onBack,
    onRemove,
    onSubmit,
    fetchPageTypes,
    fetchMorePageTypes,
    assignReferencesAttributeId,
    onAssignReferencesClick,
    fetchReferencePages,
    fetchMoreReferencePages,
    fetchReferenceProducts,
    fetchMoreReferenceProducts,
    fetchAttributeValues,
    fetchMoreAttributeValues,
    onCloseDialog,
    onSelectPageType,
    onAttributeSelectBlur,
}) => {
    const intl = useIntl();
    const localizeDate = useDateLocalize();

    const pageExists = page !== null;

    const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

    const pageTypes = pageTypeChoiceList ? mapNodeToChoice(pageTypeChoiceList) : [];

    const handleAssignReferenceAttribute = (
        attributeValues: string[],
        data: PageData,
        handlers: PageUpdateHandlers
    ) => {
        handlers.selectAttributeReference(
            assignReferencesAttributeId,
            mergeAttributeValues(assignReferencesAttributeId, attributeValues, data.attributes)
        );
        onCloseDialog();
    };

    const handleSelectPageType = (pageTypeId: string) =>
        onSelectPageType && onSelectPageType(pageTypeId);

    return (
        <PageForm
            page={page}
            pageTypes={pageTypeChoiceList}
            selectedPageType={selectedPageType}
            onSelectPageType={handleSelectPageType}
            referencePages={referencePages}
            referenceProducts={referenceProducts}
            fetchReferencePages={fetchReferencePages}
            fetchMoreReferencePages={fetchMoreReferencePages}
            fetchReferenceProducts={fetchReferenceProducts}
            fetchMoreReferenceProducts={fetchMoreReferenceProducts}
            assignReferencesAttributeId={assignReferencesAttributeId}
            onSubmit={onSubmit}
        >
            {({ change, data, valid, handlers, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.pages)}</Backlink>
                    <PageHeader
                        title={
                            !pageExists
                                ? intl.formatMessage({
                                      defaultMessage: "Create Page",
                                      id: "gr53VQ",
                                      description: "page header",
                                  })
                                : page?.title
                        }
                    />
                    <Grid>
                        <div>
                            <PageInfo
                                data={data}
                                disabled={loading}
                                errors={errors}
                                onChange={change}
                                onContentChange={handlers.changeContent}
                            />
                            <CardSpacer />
                            <SeoForm
                                errors={errors}
                                allowEmptySlug={!pageExists}
                                description={data.seoDescription}
                                disabled={loading}
                                descriptionPlaceholder="" // TODO: Cast description to string and trim it
                                onChange={change}
                                slug={data.slug}
                                slugPlaceholder={data.title}
                                title={data.seoTitle}
                                titlePlaceholder={data.title}
                                helperText={intl.formatMessage({
                                    defaultMessage:
                                        "Add search engine title and description to make this page easier to find",
                                    id: "jZbT0O",
                                })}
                            />
                            <CardSpacer />
                            {data.attributes.length > 0 && (
                                <Attributes
                                    attributes={data.attributes}
                                    attributeValues={attributeValues}
                                    disabled={loading}
                                    loading={loading}
                                    errors={errors}
                                    onChange={handlers.selectAttribute}
                                    onMultiChange={handlers.selectAttributeMulti}
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
                            <Metadata data={data} onChange={handlers.changeMetadata} />
                        </div>
                        <div>
                            <CardSpacer />
                            <VisibilityCard
                                data={data}
                                errors={errors}
                                disabled={loading}
                                messages={{
                                    hiddenLabel: intl.formatMessage({
                                        defaultMessage: "Hidden",
                                        id: "/TK7QD",
                                        description: "page label",
                                    }),
                                    hiddenSecondLabel: intl.formatMessage(
                                        {
                                            defaultMessage: "will be visible from {date}",
                                            id: "GZgjK7",
                                            description: "page",
                                        },
                                        {
                                            date: localizeDate(data.publicationDate, "L"),
                                        }
                                    ),
                                    visibleLabel: intl.formatMessage({
                                        defaultMessage: "Visible",
                                        id: "X26jCC",
                                        description: "page label",
                                    }),
                                }}
                                onChange={change}
                            />
                            <CardSpacer />
                            <PageOrganizeContent
                                data={data}
                                errors={errors}
                                disabled={loading}
                                pageTypes={pageTypes}
                                pageType={data.pageType}
                                pageTypeInputDisplayValue={data.pageType?.name || ""}
                                onPageTypeChange={handlers.selectPageType}
                                fetchPageTypes={fetchPageTypes}
                                fetchMorePageTypes={fetchMorePageTypes}
                                canChangeType={!page?.pageType}
                            />
                        </div>
                    </Grid>
                    <Savebar
                        disabled={loading || !hasChanged || !valid}
                        state={saveButtonBarState}
                        onCancel={onBack}
                        onDelete={page === null ? undefined : onRemove}
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
        </PageForm>
    );
};

PageDetailsPage.displayName = "PageDetailsPage";

export default PageDetailsPage;

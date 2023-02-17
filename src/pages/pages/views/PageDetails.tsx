// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { AttributeInput } from "@mzawadie/components/Attributes";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    VALUES_PAGINATE_BY,
    commonMessages,
    getStringOrPlaceholder,
    maybe,
} from "@mzawadie/core";
import { useFileUploadMutation } from "@mzawadie/files/mutations";
import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import { PageErrorFragment } from "@mzawadie/fragments/types/PageErrorFragment";
import { UploadErrorFragment } from "@mzawadie/fragments/types/UploadErrorFragment";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useAttributeValueDeleteMutation } from "@mzawadie/pages/attributes/mutations";
import {
    getAttributesAfterFileAttributesUpdate,
    mergeAttributeValueDeleteErrors,
    mergeFileUploadErrors,
} from "@mzawadie/pages/attributes/utils/data";
import {
    handleDeleteMultipleAttributeValues,
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/pages/attributes/utils/handlers";
import usePageSearch from "@mzawadie/searches/usePageSearch";
import useProductSearch from "@mzawadie/searches/useProductSearch";
import { AttributeValueInput, PageInput } from "@mzawadie/types/globalTypes";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { getParsedDataForJsonStringField } from "@mzawadie/utils/richText/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageDetailsPage } from "../components/PageDetailsPage";
import { PageData, PageSubmitData } from "../components/PageDetailsPage/form";
import { usePageRemoveMutation, usePageUpdateMutation } from "../mutations";
import { usePageDetailsQuery } from "../queries";
import { PageRemove } from "../types/PageRemove";
import { pageListUrl, pageUrl, PageUrlQueryParams } from "../urls";

export interface PageDetailsProps {
    id: string;
    params: PageUrlQueryParams;
}

const createPageInput = (data: PageData, updatedFileAttributes: AttributeValueInput[]): PageInput => ({
    attributes: prepareAttributesInput({
        attributes: data.attributes,
        updatedFileAttributes,
    }),
    content: getParsedDataForJsonStringField(data.content),
    isPublished: data.isPublished,
    publicationDate: data.publicationDate,
    seo: {
        description: data.seoDescription,
        title: data.seoTitle,
    },
    slug: data.slug === "" ? null : data.slug,
    title: data.title,
});

export const PageDetails: React.FC<PageDetailsProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const pageDetails = usePageDetailsQuery({
        variables: {
            id,
            firstValues: VALUES_PAGINATE_BY,
        },
    });

    const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

    const [pageUpdate, pageUpdateOpts] = usePageUpdateMutation({});

    const [deleteAttributeValue, deleteAttributeValueOpts] = useAttributeValueDeleteMutation({});

    const [pageRemove, pageRemoveOpts] = usePageRemoveMutation({
        onCompleted: (data: PageRemove) => {
            if (data.pageDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                navigate(pageListUrl());
            }
        },
    });

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            pageUrl(id, {
                action: "assign-attribute-value",
                id: attribute.id,
            })
        );

    const handleUpdate = async (data: PageSubmitData) => {
        let errors: Array<AttributeErrorFragment | UploadErrorFragment | PageErrorFragment> = [];

        const uploadFilesResult = await handleUploadMultipleFiles(
            data.attributesWithNewFileValue,
            (variables) => uploadFile({ variables })
        );

        const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
            data.attributesWithNewFileValue,
            pageDetails?.data?.page?.attributes,
            (variables) => deleteAttributeValue({ variables })
        );

        const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            data.attributesWithNewFileValue,
            uploadFilesResult
        );

        const updateResult = await pageUpdate({
            variables: {
                id,
                input: createPageInput(data, updatedFileAttributes),
                firstValues: VALUES_PAGINATE_BY,
            },
        });

        errors = [
            ...errors,
            ...mergeFileUploadErrors(uploadFilesResult),
            ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
            ...updateResult.data.pageUpdate.errors,
        ];

        return errors;
    };

    const handleSubmit = createMetadataUpdateHandler(
        pageDetails.data?.page,
        handleUpdate,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    const {
        loadMore: loadMorePages,
        search: searchPages,
        result: searchPagesOpts,
    } = usePageSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMoreProducts,
        search: searchProducts,
        result: searchProductsOpts,
    } = useProductSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMoreAttributeValues,
        search: searchAttributeValues,
        result: searchAttributeValuesOpts,
        reset: searchAttributeReset,
    } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

    const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

    const fetchMoreReferencePages = {
        hasMore: searchPagesOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchPagesOpts.loading,
        onFetchMore: loadMorePages,
    };

    const fetchMoreReferenceProducts = {
        hasMore: searchProductsOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchProductsOpts.loading,
        onFetchMore: loadMoreProducts,
    };

    const fetchMoreAttributeValues = {
        hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
        loading: !!searchAttributeValuesOpts.loading,
        onFetchMore: loadMoreAttributeValues,
    };

    return (
        <>
            <WindowTitle title={maybe(() => pageDetails.data.page.title)} />
            <PageDetailsPage
                loading={
                    pageDetails.loading ||
                    pageUpdateOpts.loading ||
                    uploadFileOpts.loading ||
                    deleteAttributeValueOpts.loading
                }
                errors={pageUpdateOpts.data?.pageUpdate.errors || []}
                saveButtonBarState={pageUpdateOpts.status}
                page={pageDetails.data?.page}
                attributeValues={attributeValues}
                onBack={() => navigate(pageListUrl())}
                onRemove={() =>
                    navigate(
                        pageUrl(id, {
                            action: "remove",
                        })
                    )
                }
                onSubmit={handleSubmit}
                assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
                onAssignReferencesClick={handleAssignAttributeReferenceClick}
                referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
                referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
                fetchReferencePages={searchPages}
                fetchMoreReferencePages={fetchMoreReferencePages}
                fetchReferenceProducts={searchProducts}
                fetchMoreReferenceProducts={fetchMoreReferenceProducts}
                fetchAttributeValues={searchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onCloseDialog={() => navigate(pageUrl(id))}
                onAttributeSelectBlur={searchAttributeReset}
            />

            <ActionDialog
                open={params.action === "remove"}
                confirmButtonState={pageRemoveOpts.status}
                title={intl.formatMessage({
                    defaultMessage: "Delete Page",
                    id: "C1luwg",
                    description: "dialog header",
                })}
                onClose={() => navigate(pageUrl(id))}
                onConfirm={() => pageRemove({ variables: { id } })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {title}?"
                        id="4B32Ba"
                        description="delete page"
                        values={{
                            title: (
                                <strong>{getStringOrPlaceholder(pageDetails.data?.page?.title)}</strong>
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};

PageDetails.displayName = "PageDetails";

export default PageDetails;

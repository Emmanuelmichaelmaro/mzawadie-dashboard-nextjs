// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { getMutationErrors } from "@mzawadie/core";
import {
    CategoryCreateMutation,
    useCategoryCreateMutation,
    useUpdateMetadataMutation,
    useUpdatePrivateMetadataMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { getParsedDataForJsonStringField } from "@mzawadie/utils/richText/misc";
import React from "react";
import { useIntl } from "react-intl";

import { CategoryCreatePage } from "../components/CategoryCreatePage";
import { CategoryCreateData } from "../components/CategoryCreatePage/form";
import { categoryListUrl, categoryUrl } from "../urls";

interface CategoryCreateViewProps {
    parentId: string;
}

export const CategoryCreateView: React.FC<CategoryCreateViewProps> = ({ parentId }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const [updateMetadata] = useUpdateMetadataMutation({});
    const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

    const handleSuccess = (data: CategoryCreateMutation) => {
        if (data.categoryCreate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    id: "xl7Fag",
                    defaultMessage: "Category created",
                }),
            });
            navigate(categoryUrl(data.categoryCreate.category.id));
        }
    };

    const [createCategory, createCategoryResult] = useCategoryCreateMutation({
        onCompleted: handleSuccess,
    });

    const handleCreate = async (formData: CategoryCreateData) => {
        const result = await createCategory({
            variables: {
                input: {
                    description: getParsedDataForJsonStringField(formData.description),
                    name: formData.name,
                    seo: {
                        description: formData.seoDescription,
                        title: formData.seoTitle,
                    },
                    slug: formData.slug,
                },
                parent: parentId || null,
            },
        });

        return {
            id: result.data?.categoryCreate?.category?.id || null,
            errors: getMutationErrors(result),
        };
    };

    const handleSubmit = createMetadataCreateHandler(
        handleCreate,
        updateMetadata,
        updatePrivateMetadata
    );

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    id: "Irflxf",
                    defaultMessage: "Create category",
                    description: "window title",
                })}
            />
            
            <CategoryCreatePage
                saveButtonBarState={createCategoryResult.status}
                errors={createCategoryResult.data?.categoryCreate?.errors || []}
                disabled={createCategoryResult.loading}
                backUrl={parentId ? categoryUrl(parentId) : categoryListUrl()}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default CategoryCreateView;

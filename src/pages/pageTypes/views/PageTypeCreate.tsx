// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { getMutationErrors } from "@mzawadie/core";
import {
    usePageTypeCreateMutation,
    useUpdateMetadataMutation,
    useUpdatePrivateMetadataMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import React from "react";
import { useIntl } from "react-intl";

import { PageTypeCreatePage, PageTypeForm } from "../components/PageTypeCreatePage";
import { pageTypeUrl } from "../urls";

export const PageTypeCreate: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useUpdateMetadataMutation({});
    const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

    const [createPageType, createPageTypeOpts] = usePageTypeCreateMutation({
        onCompleted: (updateData) => {
            if (updateData.pageTypeCreate?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        id: "5bJ26s",
                        defaultMessage: "Successfully created page type",
                    }),
                });
                navigate(pageTypeUrl(updateData.pageTypeCreate.pageType.id));
            }
        },
    });

    const handleCreate = async (formData: PageTypeForm) => {
        const result = await createPageType({
            variables: {
                input: {
                    name: formData.name,
                },
            },
        });

        return {
            id: result.data?.pageTypeCreate?.pageType?.id || null,
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
                    id: "BftZHy",
                    defaultMessage: "Create Page Type",
                    description: "window title",
                })}
            />
            <PageTypeCreatePage
                disabled={createPageTypeOpts.loading}
                errors={createPageTypeOpts.data?.pageTypeCreate?.errors || []}
                saveButtonBarState={createPageTypeOpts.status}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default PageTypeCreate;

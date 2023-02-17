// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { PageTypeCreatePage, PageTypeForm } from "../components/PageTypeCreatePage";
import { usePageTypeCreateMutation } from "../mutations";
import { PageTypeCreate as PageTypeCreateMutation } from "../types/PageTypeCreate";
import { pageTypeListUrl, pageTypeUrl } from "../urls";

export const PageTypeCreate: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const [createPageType, createPageTypeOpts] = usePageTypeCreateMutation({
        onCompleted: (updateData: PageTypeCreateMutation) => {
            if (updateData.pageTypeCreate?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Successfully created page type",
                        id: "5bJ26s",
                    }),
                });
                navigate(pageTypeUrl(updateData.pageTypeCreate?.pageType?.id));
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

        return result.data?.pageTypeCreate?.pageType?.id || null;
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
                    defaultMessage: "Create Page Type",
                    description: "window title",
                    id: "BftZHy",
                })}
            />

            <PageTypeCreatePage
                disabled={createPageTypeOpts.loading}
                errors={createPageTypeOpts.data?.pageTypeCreate?.errors || []}
                saveButtonBarState={createPageTypeOpts.status}
                onBack={() => navigate(pageTypeListUrl())}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default PageTypeCreate;

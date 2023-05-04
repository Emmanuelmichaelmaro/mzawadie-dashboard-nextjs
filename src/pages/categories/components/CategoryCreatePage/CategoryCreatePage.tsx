// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Metadata } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CategoryDetailsForm } from "../../components/CategoryDetailsForm";
import CategoryCreateForm, { CategoryCreateData } from "./form";

export interface CategoryCreatePageProps {
    errors: ProductErrorFragment[];
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    backUrl: string;
    onSubmit(data: CategoryCreateData);
}

export const CategoryCreatePage: React.FC<CategoryCreatePageProps> = ({
    disabled,
    onSubmit,
    errors,
    saveButtonBarState,
    backUrl,
}) => {
    const intl = useIntl();
    const navigate = useNavigator();

    return (
        <CategoryCreateForm onSubmit={onSubmit} disabled={disabled}>
            {({ data, change, handlers, submit, isSaveDisabled }) => (
                <Container>
                    <Backlink href={backUrl}>{intl.formatMessage(sectionNames.categories)}</Backlink>

                    <PageHeader
                        title={intl.formatMessage({
                            id: "cgsY/X",
                            defaultMessage: "Create New Category",
                            description: "page header",
                        })}
                    />

                    <div>
                        <CategoryDetailsForm
                            data={data}
                            disabled={disabled}
                            errors={errors}
                            onChange={change}
                        />

                        <CardSpacer />

                        <SeoForm
                            allowEmptySlug={true}
                            helperText={intl.formatMessage({
                                id: "wQdR8M",
                                defaultMessage:
                                    "Add search engine title and description to make this category easier to find",
                            })}
                            slug={data.slug}
                            slugPlaceholder={data.name}
                            title={data.seoTitle}
                            titlePlaceholder={data.name}
                            description={data.seoDescription}
                            descriptionPlaceholder={data.name}
                            loading={disabled}
                            onChange={change}
                            disabled={disabled}
                        />

                        <CardSpacer />

                        <Metadata data={data} onChange={handlers.changeMetadata} />

                        <Savebar
                            onCancel={() => navigate(backUrl)}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={isSaveDisabled}
                        />
                    </div>
                </Container>
            )}
        </CategoryCreateForm>
    );
};

CategoryCreatePage.displayName = "CategoryCreatePage";

export default CategoryCreatePage;

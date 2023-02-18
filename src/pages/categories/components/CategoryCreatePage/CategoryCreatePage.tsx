// @ts-nocheck
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import { Metadata } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CategoryDetailsForm } from "../CategoryDetailsForm";
import CategoryCreateForm, { CategoryCreateData } from "./form";

export interface CategoryCreatePageProps {
    errors: ProductErrorFragment[];
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onSubmit: (data: CategoryCreateData) => any;
    onBack: () => void;
}

export const CategoryCreatePage: React.FC<CategoryCreatePageProps> = ({
    disabled,
    onSubmit,
    onBack,
    errors,
    saveButtonBarState,
}) => {
    const intl = useIntl();

    return (
        <CategoryCreateForm onSubmit={onSubmit}>
            {({ data, change, handlers, submit, hasChanged }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.categories)}</Backlink>

                    <PageHeader
                        title={intl.formatMessage({
                            defaultMessage: "Create New Category",
                            id: "cgsY/X",
                            description: "page header",
                        })}
                    />

                    <div>
                        <CategoryDetailsForm
                            data={data}
                            disabled={disabled}
                            errors={errors}
                            onChange={change}
                            onDescriptionChange={handlers.changeDescription}
                        />

                        <CardSpacer />

                        <SeoForm
                            allowEmptySlug
                            helperText={intl.formatMessage({
                                defaultMessage:
                                    "Add search engine title and description to make this category easier to find",
                                id: "wQdR8M",
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
                            onCancel={onBack}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={disabled || !hasChanged}
                        />
                    </div>
                </Container>
            )}
        </CategoryCreateForm>
    );
};

CategoryCreatePage.displayName = "CategoryCreatePage";

export default CategoryCreatePage;

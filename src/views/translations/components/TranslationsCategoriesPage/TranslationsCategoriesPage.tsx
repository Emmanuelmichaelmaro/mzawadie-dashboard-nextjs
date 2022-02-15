// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import LanguageSwitch from "@mzawadie/components/LanguageSwitch";
import PageHeader from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { CategoryTranslationFragment } from "@mzawadie/fragments/types/CategoryTranslationFragment";
import {
    TranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/views/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsCategoriesPageProps extends TranslationsEntitiesPageProps {
    data: CategoryTranslationFragment;
}

const TranslationsCategoriesPage: React.FC<TranslationsCategoriesPageProps> = ({
    activeField,
    disabled,
    languageCode,
    languages,
    data,
    saveButtonState,
    onBack,
    onDiscard,
    onEdit,
    onLanguageChange,
    onSubmit,
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.translations)}</Backlink>
            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: 'Translation Category "{categoryName}" - {languageCode}',
                        id: "XitW/z",
                    },
                    {
                        categoryName: getStringOrPlaceholder(data?.category?.name),
                        languageCode,
                    }
                )}
            >
                <LanguageSwitch
                    currentLanguage={LanguageCodeEnum[languageCode]}
                    languages={languages}
                    onLanguageChange={onLanguageChange}
                />
            </PageHeader>
            <TranslationFields
                activeField={activeField}
                disabled={disabled}
                initialState
                title={intl.formatMessage(commonMessages.generalInformations)}
                fields={[
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Category Name",
                            id: "vEYtiq",
                        }),
                        name: TranslationInputFieldName.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.category?.name,
                    },
                    {
                        displayName: intl.formatMessage(commonMessages.description),
                        name: TranslationInputFieldName.description,
                        translation: data?.translation?.description || null,
                        type: "rich" as const,
                        value: data?.category?.description,
                    },
                ]}
                saveButtonState={saveButtonState}
                richTextResetKey={languageCode}
                onEdit={onEdit}
                onDiscard={onDiscard}
                onSubmit={onSubmit}
            />
            <CardSpacer />
            <TranslationFields
                activeField={activeField}
                disabled={disabled}
                initialState
                title={intl.formatMessage({
                    defaultMessage: "Search Engine Preview",
                    id: "TGX4T1",
                })}
                fields={[
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Search Engine Title",
                            id: "HlEpii",
                        }),
                        name: TranslationInputFieldName.seoTitle,
                        translation: data?.translation?.seoTitle || null,
                        type: "short" as const,
                        value: data?.category?.seoTitle,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Search Engine Description",
                            id: "US3IPU",
                        }),
                        name: TranslationInputFieldName.seoDescription,
                        translation: data?.translation?.seoDescription || null,
                        type: "long" as const,
                        value: data?.category?.seoDescription,
                    },
                ]}
                saveButtonState={saveButtonState}
                richTextResetKey={languageCode}
                onEdit={onEdit}
                onDiscard={onDiscard}
                onSubmit={onSubmit}
            />
        </Container>
    );
};

TranslationsCategoriesPage.displayName = "TranslationsCategoriesPage";

export default TranslationsCategoriesPage;

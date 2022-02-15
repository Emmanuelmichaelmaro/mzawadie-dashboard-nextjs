// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import LanguageSwitch from "@mzawadie/components/LanguageSwitch";
import PageHeader from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { PageTranslationFragment } from "@mzawadie/fragments/types/PageTranslationFragment";
import {
    PageTranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/views/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsPagesPageProps extends TranslationsEntitiesPageProps {
    data: PageTranslationFragment;
    onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsPagesPage: React.FC<TranslationsPagesPageProps> = ({
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
    onAttributeValueSubmit,
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.translations)}</Backlink>
            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: 'Translation Page "{pageName}" - {languageCode}',
                        id: "oUWXLO",
                        description: "header",
                    },
                    {
                        languageCode,
                        pageName: getStringOrPlaceholder(data?.page?.title),
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
                            defaultMessage: "Page Title",
                            id: "gvOzOl",
                        }),
                        name: PageTranslationInputFieldName.title,
                        translation: data?.translation?.title || null,
                        type: "short" as const,
                        value: data?.page?.title,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Content",
                            id: "gMwpNC",
                            description: "page content",
                        }),
                        name: PageTranslationInputFieldName.content,
                        translation: data?.translation?.content || null,
                        type: "rich" as const,
                        value: data?.page?.content,
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
                        name: PageTranslationInputFieldName.seoTitle,
                        translation: data?.translation?.seoTitle || null,
                        type: "short" as const,
                        value: data?.page?.seoTitle,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Search Engine Description",
                            id: "US3IPU",
                        }),
                        name: PageTranslationInputFieldName.seoDescription,
                        translation: data?.translation?.seoDescription || null,
                        type: "long" as const,
                        value: data?.page?.seoDescription,
                    },
                ]}
                saveButtonState={saveButtonState}
                richTextResetKey={languageCode}
                onEdit={onEdit}
                onDiscard={onDiscard}
                onSubmit={onSubmit}
            />
            <CardSpacer />
            {data?.attributeValues?.length > 0 && (
                <>
                    <TranslationFields
                        activeField={activeField}
                        disabled={disabled}
                        initialState
                        title={intl.formatMessage(commonMessages.translationAttributes)}
                        fields={
                            data.attributeValues.map((attrVal, i) => ({
                                id: attrVal.attributeValue.id,
                                displayName: intl.formatMessage(
                                    {
                                        defaultMessage: "Attribute {number}",
                                        id: "PajjqE",
                                        description: "attribute list",
                                    },
                                    {
                                        number: i + 1,
                                    }
                                ),
                                name: attrVal?.name,
                                translation: attrVal?.translation?.richText || null,
                                type: "rich" as const,
                                value: attrVal?.richText,
                            })) || []
                        }
                        saveButtonState={saveButtonState}
                        richTextResetKey={languageCode}
                        onEdit={onEdit}
                        onDiscard={onDiscard}
                        onSubmit={onAttributeValueSubmit}
                    />
                    <CardSpacer />
                </>
            )}
        </Container>
    );
};

TranslationsPagesPage.displayName = "TranslationsPagesPage";

export default TranslationsPagesPage;

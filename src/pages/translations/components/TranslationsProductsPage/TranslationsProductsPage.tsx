// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { ProductTranslationFragment } from "@mzawadie/fragments/types/ProductTranslationFragment";
import {
    TranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/pages/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher";
import { TranslationFields } from "../TranslationFields";

export interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
    data: ProductTranslationFragment;
    productId: string;
    onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsProductsPage: React.FC<TranslationsProductsPageProps> = ({
    productId,
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
                        defaultMessage: 'Translation Product "{productName}" - {languageCode}',
                        id: "22x9tu",
                        description: "header",
                    },
                    {
                        languageCode,
                        productName: getStringOrPlaceholder(data?.product?.name),
                    }
                )}
            >
                <ProductContextSwitcher
                    languageCode={languageCode}
                    productId={productId}
                    selectedId={productId}
                />
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
                            defaultMessage: "Product Name",
                            id: "ZIc5lM",
                        }),
                        name: TranslationInputFieldName.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.product?.name,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Description",
                            id: "Q8Qw5B",
                        }),
                        name: TranslationInputFieldName.description,
                        translation: data?.translation?.description || null,
                        type: "rich" as const,
                        value: data?.product?.description,
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
                        value: data?.product?.seoTitle,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Search Engine Description",
                            id: "US3IPU",
                        }),
                        name: TranslationInputFieldName.seoDescription,
                        translation: data?.translation?.seoDescription || null,
                        type: "long" as const,
                        value: data?.product?.seoDescription,
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
TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;

// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import LanguageSwitch from "@mzawadie/components/LanguageSwitch";
import PageHeader from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { ProductVariantTranslationFragment } from "@mzawadie/fragments/types/ProductVariantTranslationFragment";
import {
    TranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/views/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ProductContextSwitcher from "../ProductContextSwitcher";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
    data: ProductVariantTranslationFragment;
    productId: string;
    variantId: string;
    onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsProductsPage: React.FC<TranslationsProductsPageProps> = ({
    activeField,
    disabled,
    languageCode,
    languages,
    data,
    saveButtonState,
    productId,
    variantId,
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
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.products)}</Backlink>
            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: 'Translation Product Variant "{productName}" - {languageCode}',
                        id: "98WMlR",
                        description: "header",
                    },
                    {
                        languageCode,
                        productName: getStringOrPlaceholder(data?.name),
                    }
                )}
            >
                <ProductContextSwitcher
                    languageCode={languageCode}
                    productId={productId}
                    selectedId={variantId}
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
                            defaultMessage: "Variant Name",
                            id: "T1f2Yl",
                        }),
                        name: TranslationInputFieldName.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.name,
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

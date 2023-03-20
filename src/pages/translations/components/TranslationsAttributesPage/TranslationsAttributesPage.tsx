// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { ListSettingsUpdate } from "@mzawadie/components/TablePagination";
import { commonMessages, sectionNames, getStringOrPlaceholder, ListSettings } from "@mzawadie/core";
import { AttributeTranslationDetailsFragment, LanguageCodeEnum } from "@mzawadie/graphql";
import { TranslationsEntitiesPageProps } from "@mzawadie/pages/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { getTranslationFields } from "../../utils";
import { TranslationFields } from "../TranslationFields";
import { transtionsAttributesPageFieldsMessages as messages } from "./messages";

export interface TranslationsAttributesPageProps extends TranslationsEntitiesPageProps {
    data: AttributeTranslationDetailsFragment;
    settings?: ListSettings;
    onUpdateListSettings?: ListSettingsUpdate;
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    onNextPage: () => void;
    onPreviousPage: () => void;
}

export const fieldNames = {
    attribute: "attribute",
    value: "attributeValue",
    richTextValue: "attributeRichTextValue",
};

const TranslationsAttributesPage: React.FC<TranslationsAttributesPageProps> = ({
    activeField,
    disabled,
    languages,
    languageCode,
    data,
    saveButtonState,
    onBack,
    onDiscard,
    onEdit,
    onLanguageChange,
    onSubmit,
    settings,
    onUpdateListSettings,
    pageInfo,
    onNextPage,
    onPreviousPage,
}) => {
    const intl = useIntl();

    const withChoices = data?.attribute?.withChoices;

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.translations)}</Backlink>
            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: 'Translation Attribute "{attribute}" - {languageCode}',
                        id: "SPBLzT",
                        description: "header",
                    },
                    {
                        attribute: getStringOrPlaceholder(data?.attribute?.name),
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
                            defaultMessage: "Attribute Name",
                            id: "DRMMDs",
                        }),
                        name: `${fieldNames.attribute}:${data?.attribute.id}`,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.attribute?.name,
                    },
                ]}
                saveButtonState={saveButtonState}
                richTextResetKey={languageCode}
                onEdit={onEdit}
                onDiscard={onDiscard}
                onSubmit={onSubmit}
            />
            <CardSpacer />
            {data?.attribute?.choices.edges.length > 0 && withChoices && (
                <TranslationFields
                    activeField={activeField}
                    disabled={disabled}
                    initialState
                    title={intl.formatMessage(messages.values)}
                    fields={getTranslationFields(data?.attribute?.choices, intl)}
                    saveButtonState={saveButtonState}
                    richTextResetKey={languageCode}
                    pagination={{
                        settings,
                        onUpdateListSettings,
                        pageInfo,
                        onNextPage,
                        onPreviousPage,
                    }}
                    onEdit={onEdit}
                    onDiscard={onDiscard}
                    onSubmit={onSubmit}
                />
            )}
        </Container>
    );
};
TranslationsAttributesPage.displayName = "TranslationsAttributesPage";
export default TranslationsAttributesPage;

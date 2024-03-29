// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { LanguageCodeEnum, SaleTranslationFragment } from "@mzawadie/graphql";
import { TranslationsEntitiesPageProps } from "@mzawadie/pages/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationFields } from "../TranslationFields";

export interface TranslationsSalesPageProps extends TranslationsEntitiesPageProps {
    data: SaleTranslationFragment;
}

export const fieldNames = {
    name: "name",
};

const TranslationsSalesPage: React.FC<TranslationsSalesPageProps> = ({
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
                        defaultMessage: 'Translation Sale "{saleName}" - {languageCode}',
                        id: "zjkAMs",
                        description: "header",
                    },
                    {
                        languageCode,
                        saleName: getStringOrPlaceholder(data?.sale?.name),
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
                            defaultMessage: "Sale Name",
                            id: "s40PZt",
                        }),
                        name: fieldNames.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.sale?.name,
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

TranslationsSalesPage.displayName = "TranslationsSalesPage";

export default TranslationsSalesPage;

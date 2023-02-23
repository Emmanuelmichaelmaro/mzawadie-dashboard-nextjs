// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { ShippingMethodTranslationFragment } from "@mzawadie/fragments/types/ShippingMethodTranslationFragment";
import {
    TranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/pages/translations/types";
import { LanguageCodeEnum } from "@mzawadie/types/globalTypes";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationFields } from "../TranslationFields";

export interface TranslationsShippingMethodPageProps extends TranslationsEntitiesPageProps {
    data: ShippingMethodTranslationFragment;
}

const TranslationsShippingMethodPage: React.FC<TranslationsShippingMethodPageProps> = ({
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
                        defaultMessage:
                            'Translation ShippingMethod "{shippingMethodName}" - {languageCode}',
                        id: "1UKx20",
                        description: "header",
                    },
                    {
                        languageCode,
                        shippingMethodName: getStringOrPlaceholder(data?.name),
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
                            defaultMessage: "Name",
                            id: "aPCrsp",
                            description: "shipping method name",
                        }),
                        name: TranslationInputFieldName.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.name,
                    },
                    {
                        displayName: intl.formatMessage({
                            defaultMessage: "Description",
                            id: "GpqEl5",
                            description: "shipping method description",
                        }),
                        name: TranslationInputFieldName.description,
                        translation: data?.translation?.description || null,
                        type: "rich",
                        value: data?.description,
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

TranslationsShippingMethodPage.displayName = "TranslationsShippingMethodPage";

export default TranslationsShippingMethodPage;

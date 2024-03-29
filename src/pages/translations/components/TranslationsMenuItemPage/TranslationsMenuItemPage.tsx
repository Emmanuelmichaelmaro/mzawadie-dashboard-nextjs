// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { LanguageCodeEnum, MenuItemTranslationFragment } from "@mzawadie/graphql";
import {
    TranslationInputFieldName,
    TranslationsEntitiesPageProps,
} from "@mzawadie/pages/translations/types";
import {
    languageEntitiesUrl,
    languageEntityUrl,
    TranslatableEntities,
} from "@mzawadie/pages/translations/urls";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationFields } from "../TranslationFields";

export interface TranslationsMenuItemPageProps extends TranslationsEntitiesPageProps {
    data: MenuItemTranslationFragment;
}

const TranslationsMenuItemPage: React.FC<TranslationsMenuItemPageProps> = ({
    translationId,
    activeField,
    disabled,
    languageCode,
    languages,
    data,
    saveButtonState,
    onDiscard,
    onEdit,
    onSubmit,
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink
                href={languageEntitiesUrl(languageCode, {
                    tab: TranslatableEntities.menuItems,
                })}
            >
                {intl.formatMessage(sectionNames.translations)}
            </Backlink>

            <PageHeader
                title={intl.formatMessage(
                    {
                        id: "IOshTA",
                        defaultMessage: 'Translation MenuItem "{menuItemName}" - {languageCode}',
                        description: "header",
                    },
                    {
                        languageCode,
                        menuItemName: getStringOrPlaceholder(data?.menuItem?.name),
                    }
                )}
            >
                <LanguageSwitch
                    currentLanguage={LanguageCodeEnum[languageCode]}
                    languages={languages}
                    getLanguageUrl={(lang) =>
                        languageEntityUrl(lang, TranslatableEntities.menuItems, translationId)
                    }
                />
            </PageHeader>

            <TranslationFields
                activeField={activeField}
                disabled={disabled}
                initialState={true}
                title={intl.formatMessage(commonMessages.generalInformations)}
                fields={[
                    {
                        displayName: intl.formatMessage({
                            id: "0Vyr8h",
                            defaultMessage: "Name",
                            description: "menu item name",
                        }),
                        name: TranslationInputFieldName.name,
                        translation: data?.translation?.name || null,
                        type: "short" as "short",
                        value: data?.menuItem?.name,
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

TranslationsMenuItemPage.displayName = "TranslationsMenuItemPage";

export default TranslationsMenuItemPage;

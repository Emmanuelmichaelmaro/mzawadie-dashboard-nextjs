// @ts-nocheck
import Container from "@mzawadie/components/Container";
import { LanguageSwitch } from "@mzawadie/components/LanguageSwitch";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { commonMessages, sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { LanguageCodeEnum, VoucherTranslationFragment } from "@mzawadie/graphql";
import { TranslationsEntitiesPageProps } from "@mzawadie/pages/translations/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationFields } from "../TranslationFields";

export interface TranslationsVouchersPageProps extends TranslationsEntitiesPageProps {
    data: VoucherTranslationFragment;
}

export const fieldNames = {
    name: "name",
};

const TranslationsVouchersPage: React.FC<TranslationsVouchersPageProps> = ({
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
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.translations)}</Backlink>

            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: 'Translation Voucher "{voucherName}" - {languageCode}',
                        id: "1tXSSK",
                        description: "header",
                    },
                    {
                        languageCode,
                        voucherName: getStringOrPlaceholder(data?.voucher?.name),
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
                            defaultMessage: "Voucher Name",
                            id: "sfErC+",
                        }),
                        name: fieldNames.name,
                        translation: data?.translation?.name || null,
                        type: "short" as const,
                        value: data?.voucher?.name,
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

TranslationsVouchersPage.displayName = "TranslationsVouchersPage";

export default TranslationsVouchersPage;

// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import {
    LanguageCodeEnum,
    usePageTranslationDetailsQuery,
    useUpdateAttributeValueTranslationsMutation,
    useUpdatePageTranslationsMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsPagesPage } from "../components/TranslationsPagesPage";
import { PageTranslationInputFieldName, TranslationField } from "../types";
import { languageEntitiesUrl, languageEntityUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsPagesQueryParams {
    activeField: string;
}

export interface TranslationsPagesProps {
    id: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsPagesQueryParams;
}

const TranslationsPages: React.FC<TranslationsPagesProps> = ({ id, languageCode, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const pageTranslations = usePageTranslationDetailsQuery({
        variables: { id, language: languageCode },
    });

    const onUpdate = (errors: unknown[]) => {
        if (errors.length === 0) {
            pageTranslations.refetch();
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate("?", { replace: true });
        }
    };

    const [updateTranslations, updateTranslationsOpts] = useUpdatePageTranslationsMutation({
        onCompleted: (data) => onUpdate(data.pageTranslate.errors),
    });

    const [updateAttributeValueTranslations] = useUpdateAttributeValueTranslationsMutation({
        onCompleted: (data) => onUpdate(data.attributeValueTranslate.errors),
    });

    const onEdit = (field: string) =>
        navigate(
            `?${stringifyQs({
                activeField: field,
            })}`,
            { replace: true }
        );

    const onDiscard = () => {
        navigate("?", { replace: true });
    };

    const handleSubmit = (
        { name: fieldName }: TranslationField<PageTranslationInputFieldName>,
        data: string | any
    ) =>
        extractMutationErrors(
            updateTranslations({
                variables: {
                    id,
                    input: getParsedTranslationInputData({
                        data,
                        fieldName,
                    }),
                    language: languageCode,
                },
            })
        );

    const handleAttributeValueSubmit = (
        { id }: TranslationField<PageTranslationInputFieldName>,
        data: OutputData
    ) =>
        extractMutationErrors(
            updateAttributeValueTranslations({
                variables: {
                    id,
                    input: { richText: JSON.stringify(data) },
                    language: languageCode,
                },
            })
        );

    const translation = pageTranslations?.data?.translation;

    return (
        <TranslationsPagesPage
            activeField={params.activeField}
            disabled={pageTranslations.loading || updateTranslationsOpts.loading}
            languageCode={languageCode}
            languages={shop?.languages || []}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
                navigate(
                    languageEntitiesUrl(languageCode, {
                        tab: TranslatableEntities.pages,
                    })
                )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onLanguageChange={(lang) =>
                navigate(languageEntityUrl(lang, TranslatableEntities.pages, id))
            }
            onSubmit={handleSubmit}
            onAttributeValueSubmit={handleAttributeValueSubmit}
            data={translation?.__typename === "PageTranslatableContent" ? translation : null}
        />
    );
};

TranslationsPages.displayName = "TranslationsPages";

export default TranslationsPages;

// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { commonMessages, extractMutationErrors, maybe } from "@mzawadie/core";
import {
    LanguageCodeEnum,
    useProductVariantTranslationDetailsQuery,
    useUpdateAttributeValueTranslationsMutation,
    useUpdateProductVariantTranslationsMutation,
} from "@mzawadie/graphql";
import { useNavigator, useNotifier, useShop } from "@mzawadie/hooks";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsProductVariantsPage } from "../components/TranslationsProductVariantsPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { languageEntitiesUrl, productVariantUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsProductVariantsQueryParams {
    activeField: string;
}

export interface TranslationsProductVariantsProps {
    id: string;
    productId: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsProductVariantsQueryParams;
}

const TranslationsProductVariants: React.FC<TranslationsProductVariantsProps> = ({
    id,
    productId,
    languageCode,
    params,
}) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const productVariantTranslations = useProductVariantTranslationDetailsQuery({
        variables: { id, language: languageCode },
    });

    const onUpdate = (errors: unknown[]) => {
        if (errors.length === 0) {
            productVariantTranslations.refetch();
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate("?", { replace: true });
        }
    };

    const [updateTranslations, updateTranslationsOpts] = useUpdateProductVariantTranslationsMutation({
        onCompleted: (data) => onUpdate(data.productVariantTranslate.errors),
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
        { name: fieldName }: TranslationField<TranslationInputFieldName>,
        data: string
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
        { id }: TranslationField<TranslationInputFieldName>,
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

    const translation = productVariantTranslations?.data?.translation;

    return (
        <TranslationsProductVariantsPage
            productId={productId}
            variantId={id}
            activeField={params.activeField}
            disabled={productVariantTranslations.loading || updateTranslationsOpts.loading}
            languageCode={languageCode}
            languages={maybe(() => shop.languages, [])}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
                navigate(
                    languageEntitiesUrl(languageCode, {
                        tab: TranslatableEntities.products,
                    })
                )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onLanguageChange={(lang) => navigate(productVariantUrl(lang, productId, id))}
            onSubmit={handleSubmit}
            onAttributeValueSubmit={handleAttributeValueSubmit}
            data={translation?.__typename === "ProductVariantTranslatableContent" ? translation : null}
        />
    );
};

TranslationsProductVariants.displayName = "TranslationsProductVariants";

export default TranslationsProductVariants;

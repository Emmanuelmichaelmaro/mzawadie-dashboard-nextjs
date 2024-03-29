// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { commonMessages, extractMutationErrors, maybe } from "@mzawadie/core";
import {
    LanguageCodeEnum,
    useProductTranslationDetailsQuery,
    useUpdateAttributeValueTranslationsMutation,
    useUpdateProductTranslationsMutation,
} from "@mzawadie/graphql";
import { useNavigator, useNotifier, useShop } from "@mzawadie/hooks";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsProductsPage } from "../components/TranslationsProductsPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { languageEntitiesUrl, languageEntityUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsProductsQueryParams {
    activeField: string;
}

export interface TranslationsProductsProps {
    id: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsProductsQueryParams;
}

const TranslationsProducts: React.FC<TranslationsProductsProps> = ({ id, languageCode, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const productTranslations = useProductTranslationDetailsQuery({
        variables: { id, language: languageCode },
    });

    const onUpdate = (errors: unknown[]) => {
        if (errors.length === 0) {
            productTranslations.refetch();
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate("?", { replace: true });
        }
    };

    const [updateTranslations, updateTranslationsOpts] = useUpdateProductTranslationsMutation({
        onCompleted: (data) => onUpdate(data.productTranslate?.errors),
    });

    const [updateAttributeValueTranslations] = useUpdateAttributeValueTranslationsMutation({
        onCompleted: (data) => onUpdate(data.attributeValueTranslate?.errors),
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

    const translation = productTranslations?.data?.translation;

    return (
        <TranslationsProductsPage
            productId={id}
            activeField={params.activeField}
            disabled={productTranslations.loading || updateTranslationsOpts.loading}
            languageCode={languageCode}
            languages={maybe(() => shop?.languages, [])}
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
            onLanguageChange={(lang) =>
                navigate(languageEntityUrl(lang, TranslatableEntities.products, id))
            }
            onSubmit={handleSubmit}
            onAttributeValueSubmit={handleAttributeValueSubmit}
            data={translation?.__typename === "ProductTranslatableContent" ? translation : null}
        />
    );
};

TranslationsProducts.displayName = "TranslationsProducts";

export default TranslationsProducts;

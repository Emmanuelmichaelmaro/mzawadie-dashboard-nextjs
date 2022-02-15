/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { commonMessages, maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { LanguageCodeEnum } from "@mzawadie/types/globalTypes";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsProductVariantsPage from "../components/TranslationsProductVariantsPage";
import {
    TypedUpdateAttributeValueTranslations,
    TypedUpdateProductVariantTranslations,
} from "../mutations";
import { useProductVariantTranslationDetails } from "../queries";
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

    const productVariantTranslations = useProductVariantTranslationDetails({
        variables: { id, language: languageCode },
    });

    const onEdit = (field: string) =>
        navigate(
            `?${stringifyQs({
                activeField: field,
            })}`,
            true
        );

    const onUpdate = (errors: unknown[]) => {
        if (errors.length === 0) {
            productVariantTranslations.refetch();
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate("?", true);
        }
    };

    const onDiscard = () => {
        navigate("?", true);
    };

    return (
        <TypedUpdateProductVariantTranslations
            onCompleted={(data) => onUpdate(data.productVariantTranslate.errors)}
        >
            {(updateTranslations, updateTranslationsOpts) => (
                <TypedUpdateAttributeValueTranslations
                    onCompleted={(data) => onUpdate(data.attributeValueTranslate.errors)}
                >
                    {(updateAttributeValueTranslations) => {
                        const handleSubmit = (
                            { name: fieldName }: TranslationField<TranslationInputFieldName>,
                            data: string
                        ) => {
                            updateTranslations({
                                variables: {
                                    id,
                                    input: getParsedTranslationInputData({
                                        data,
                                        fieldName,
                                    }),
                                    language: languageCode,
                                },
                            });
                        };

                        const handleAttributeValueSubmit = (
                            { id }: TranslationField<TranslationInputFieldName>,
                            data: OutputData
                        ) => {
                            updateAttributeValueTranslations({
                                variables: {
                                    id,
                                    input: { richText: JSON.stringify(data) },
                                    language: languageCode,
                                },
                            });
                        };

                        const translation = productVariantTranslations?.data?.translation;

                        return (
                            <TranslationsProductVariantsPage
                                productId={productId}
                                variantId={id}
                                activeField={params.activeField}
                                disabled={
                                    productVariantTranslations.loading || updateTranslationsOpts.loading
                                }
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
                                onLanguageChange={(lang) =>
                                    navigate(productVariantUrl(lang, productId, id))
                                }
                                onSubmit={handleSubmit}
                                onAttributeValueSubmit={handleAttributeValueSubmit}
                                data={
                                    translation?.__typename === "ProductVariantTranslatableContent"
                                        ? translation
                                        : null
                                }
                            />
                        );
                    }}
                </TypedUpdateAttributeValueTranslations>
            )}
        </TypedUpdateProductVariantTranslations>
    );
};

TranslationsProductVariants.displayName = "TranslationsProductVariants";

export default TranslationsProductVariants;

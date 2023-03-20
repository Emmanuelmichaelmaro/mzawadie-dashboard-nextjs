// @ts-nocheck
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import {
    LanguageCodeEnum,
    useShippingMethodTranslationDetailsQuery,
    useUpdateShippingMethodTranslationsMutation,
} from "@mzawadie/graphql";
import { useNavigator, useNotifier, useShop } from "@mzawadie/hooks";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsShippingMethodPage } from "../components/TranslationsShippingMethodPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { languageEntitiesUrl, languageEntityUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsShippingMethodQueryParams {
    activeField: string;
}

export interface TranslationsShippingMethodProps {
    id: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsShippingMethodQueryParams;
}

const TranslationsShippingMethod: React.FC<TranslationsShippingMethodProps> = ({
    id,
    languageCode,
    params,
}) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const shippingMethodTranslations = useShippingMethodTranslationDetailsQuery({
        variables: { id, language: languageCode },
    });

    const [updateTranslations, updateTranslationsOpts] = useUpdateShippingMethodTranslationsMutation({
        onCompleted: (data) => {
            if (data.shippingPriceTranslate?.errors.length === 0) {
                shippingMethodTranslations.refetch();
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                navigate("?", { replace: true });
            }
        },
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
                    input: getParsedTranslationInputData({ fieldName, data }),
                    language: languageCode,
                },
            })
        );

    const translation = shippingMethodTranslations?.data?.translation;

    return (
        <TranslationsShippingMethodPage
            activeField={params.activeField}
            disabled={shippingMethodTranslations.loading || updateTranslationsOpts.loading}
            languages={shop?.languages || []}
            languageCode={languageCode}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
                navigate(
                    languageEntitiesUrl(languageCode, {
                        tab: TranslatableEntities.shippingMethods,
                    })
                )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={handleSubmit}
            onLanguageChange={(lang) =>
                navigate(languageEntityUrl(lang, TranslatableEntities.shippingMethods, id))
            }
            data={translation?.__typename === "ShippingMethodTranslatableContent" ? translation : null}
        />
    );
};

TranslationsShippingMethod.displayName = "TranslationsShippingMethod";

export default TranslationsShippingMethod;

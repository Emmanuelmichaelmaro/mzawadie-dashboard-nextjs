/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { commonMessages } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { LanguageCodeEnum } from "@mzawadie/types/globalTypes";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsSalesPage from "../components/TranslationsSalesPage";
import { TypedUpdateSaleTranslations } from "../mutations";
import { useSaleTranslationDetails } from "../queries";
import { TranslationField, TranslationInputFieldName } from "../types";
import { UpdateSaleTranslations } from "../types/UpdateSaleTranslations";
import { languageEntitiesUrl, languageEntityUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsSalesQueryParams {
    activeField: string;
}
export interface TranslationsSalesProps {
    id: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsSalesQueryParams;
}

const TranslationsSales: React.FC<TranslationsSalesProps> = ({ id, languageCode, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const saleTranslations = useSaleTranslationDetails({
        variables: { id, language: languageCode },
    });

    const onEdit = (field: string) =>
        navigate(
            `?${stringifyQs({
                activeField: field,
            })}`,
            true
        );
    const onUpdate = (data: UpdateSaleTranslations) => {
        if (data.saleTranslate.errors.length === 0) {
            saleTranslations.refetch();
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
        <TypedUpdateSaleTranslations onCompleted={onUpdate}>
            {(updateTranslations, updateTranslationsOpts) => {
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
                const translation = saleTranslations?.data?.translation;

                return (
                    <TranslationsSalesPage
                        activeField={params.activeField}
                        disabled={saleTranslations.loading || updateTranslationsOpts.loading}
                        languages={shop?.languages || []}
                        languageCode={languageCode}
                        saveButtonState={updateTranslationsOpts.status}
                        onBack={() =>
                            navigate(
                                languageEntitiesUrl(languageCode, {
                                    tab: TranslatableEntities.sales,
                                })
                            )
                        }
                        onEdit={onEdit}
                        onDiscard={onDiscard}
                        onSubmit={handleSubmit}
                        onLanguageChange={(lang) =>
                            navigate(languageEntityUrl(lang, TranslatableEntities.sales, id))
                        }
                        data={
                            translation?.__typename === "SaleTranslatableContent" ? translation : null
                        }
                    />
                );
            }}
        </TypedUpdateSaleTranslations>
    );
};

TranslationsSales.displayName = "TranslationsSales";

export default TranslationsSales;

// @ts-nocheck
import { commonMessages, extractMutationErrors, maybe } from "@mzawadie/core";
import {
    LanguageCodeEnum,
    useUpdateVoucherTranslationsMutation,
    useVoucherTranslationDetailsQuery,
} from "@mzawadie/graphql";
import { useNavigator, useNotifier, useShop } from "@mzawadie/hooks";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsVouchersPage } from "../components/TranslationsVouchersPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { languageEntitiesUrl, languageEntityUrl, TranslatableEntities } from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsVouchersQueryParams {
    activeField: string;
}

export interface TranslationsVouchersProps {
    id: string;
    languageCode: LanguageCodeEnum;
    params: TranslationsVouchersQueryParams;
}

const TranslationsVouchers: React.FC<TranslationsVouchersProps> = ({ id, languageCode, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();

    const voucherTranslations = useVoucherTranslationDetailsQuery({
        variables: { id, language: languageCode },
    });

    const [updateTranslations, updateTranslationsOpts] = useUpdateVoucherTranslationsMutation({
        onCompleted: (data) => {
            if (data.voucherTranslate?.errors.length === 0) {
                voucherTranslations.refetch();
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
                    input: getParsedTranslationInputData({
                        data,
                        fieldName,
                    }),
                    language: languageCode,
                },
            })
        );

    const translation = voucherTranslations?.data?.translation;

    return (
        <TranslationsVouchersPage
            activeField={params.activeField}
            disabled={voucherTranslations.loading || updateTranslationsOpts.loading}
            languages={maybe(() => shop?.languages, [])}
            languageCode={languageCode}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
                navigate(
                    languageEntitiesUrl(languageCode, {
                        tab: TranslatableEntities.vouchers,
                    })
                )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onLanguageChange={(lang: any) =>
                navigate(languageEntityUrl(lang, TranslatableEntities.vouchers, id))
            }
            onSubmit={handleSubmit}
            data={translation?.__typename === "VoucherTranslatableContent" ? translation : null}
        />
    );
};

TranslationsVouchers.displayName = "TranslationsVouchers";

export default TranslationsVouchers;

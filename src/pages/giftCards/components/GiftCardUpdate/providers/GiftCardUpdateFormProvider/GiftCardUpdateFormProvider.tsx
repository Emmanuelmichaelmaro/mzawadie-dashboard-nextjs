// @ts-nocheck
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { GiftCardError } from "@mzawadie/fragments/types/GiftCardError";
import { MutationResultWithOpts } from "@mzawadie/hooks/graphql/makeMutation";
import useForm, { FormChange, UseFormResult } from "@mzawadie/hooks/useForm";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@mzawadie/hooks/useNotifier/utils";
import { getFormErrors } from "@mzawadie/utils/errors";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import getMetadata from "@mzawadie/utils/metadata/getMetadata";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import difference from "lodash/difference";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import {
    GiftCardCreateFormData,
    initialData as emptyFormData,
} from "../../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import { giftCardUpdateFormMessages } from "../../../GiftCardsList/messages";
import { useGiftCardUpdateMutation } from "../../mutations";
import { GiftCardUpdate } from "../../types/GiftCardUpdate";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateFormProviderProps {
    children: React.ReactNode;
}

export type GiftCardUpdateFormData = MetadataFormData &
    Pick<GiftCardCreateFormData, "tags" | "expiryDate">;

export interface GiftCardUpdateFormConsumerData extends GiftCardUpdateFormErrors {
    opts: MutationResultWithOpts<GiftCardUpdate>;
}

export interface GiftCardUpdateFormErrors {
    formErrors: Record<"tags" | "expiryDate", GiftCardError>;
    handlers: { changeMetadata: FormChange };
}

export type GiftCardUpdateFormConsumerProps = UseFormResult<GiftCardUpdateFormData> &
    GiftCardUpdateFormConsumerData;

export const GiftCardUpdateFormContext = createContext<GiftCardUpdateFormConsumerProps>(null);

const getGiftCardTagsAddRemoveData = (initTags: string[], changedTags: string[]) => {
    const removed = difference(initTags, changedTags);
    const added = difference(changedTags, initTags);

    return {
        addTags: added,
        removeTags: removed,
    };
};

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({ children }) => {
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();

    const getInitialData = (): GiftCardUpdateFormData => {
        if (loadingGiftCard || !giftCard) {
            return { ...emptyFormData, metadata: [], privateMetadata: [] };
        }

        const { tags, expiryDate, privateMetadata, metadata } = giftCard;

        return {
            tags: tags.map(({ name }) => name),
            expiryDate,
            privateMetadata: privateMetadata?.map(mapMetadataItemToInput),
            metadata: metadata?.map(mapMetadataItemToInput),
        };
    };

    const onSubmit = (data: GiftCardUpdate) => {
        const { errors } = data.giftCardUpdate;
        const hasExpiryError = errors.some((error) => error.field === "expiryDate");

        notify(
            hasExpiryError
                ? {
                      title: intl.formatMessage(
                          giftCardUpdateFormMessages.giftCardInvalidExpiryDateHeader
                      ),
                      text: intl.formatMessage(
                          giftCardUpdateFormMessages.giftCardInvalidExpiryDateContent
                      ),
                      status: "error",
                  }
                : getDefaultNotifierSuccessErrorData(errors, intl)
        );
    };

    const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
        onCompleted: onSubmit,
    });

    const submit = async ({ tags, expiryDate }: GiftCardUpdateFormData) => {
        const result = await updateGiftCard({
            variables: {
                id: giftCard?.id,
                input: {
                    expiryDate,
                    ...getGiftCardTagsAddRemoveData(
                        giftCard.tags.map((el) => el.name),
                        tags
                    ),
                },
            },
        });

        return result?.data?.giftCardUpdate?.errors;
    };

    const formProps = useForm(getInitialData());

    const { data, change, setChanged, hasChanged, formId } = formProps;

    const handleSubmit = createMetadataUpdateHandler(
        giftCard,
        submit,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit: handleSubmit,
        setChanged,
    });

    const {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler: makeMetadataChangeHandler,
    } = useMetadataChangeTrigger();

    const changeMetadata = makeMetadataChangeHandler(change);

    const submitData: GiftCardUpdateFormData = {
        ...data,
        ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
    };

    const formSubmit = () => handleFormSubmit(submitData);

    const formErrors = getFormErrors(
        ["tags", "expiryDate"],
        updateGiftCardOpts?.data?.giftCardUpdate?.errors
    );

    const providerValues = {
        ...formProps,
        opts: updateGiftCardOpts,
        hasChanged,
        formErrors,
        submit: formSubmit,
        handlers: {
            changeMetadata,
        },
    };

    return (
        <GiftCardUpdateFormContext.Provider value={providerValues}>
            {children}
        </GiftCardUpdateFormContext.Provider>
    );
};

export default GiftCardUpdateFormProvider;

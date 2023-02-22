// @ts-nocheck
import { MultiAutocompleteSelectField } from "@mzawadie/components/MultiAutocompleteSelectField";
import { SingleAutocompleteSelectFieldProps } from "@mzawadie/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA, commonMessages } from "@mzawadie/core";
import { FormChange } from "@mzawadie/hooks/useForm";
import { mapEdgesToItems, mapMultiValueNodeToChoice } from "@mzawadie/utils/maps";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { GiftCardBulkCreateFormError } from "../GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { giftCardTagInputMessages as messages } from "./messages";
import useGiftCardTagsSearch from "./useGiftCardTagsSearch";
import { getMultiChoices } from "./utils";

interface GiftCardTagInputProps extends Pick<SingleAutocompleteSelectFieldProps, "name"> {
    toggleChange: FormChange;
    values: string[];
    error: GiftCardBulkCreateFormError;
    optional?: boolean;
    loading?: boolean;
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
    toggleChange,
    name,
    values,
    error,
    optional = true,
    loading,
}) => {
    const intl = useIntl();

    const { loadMore, search, result } = useGiftCardTagsSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const choices = mapMultiValueNodeToChoice(
        uniq(compact(mapEdgesToItems(result?.data?.search)?.map(({ name }) => name))),
        "tags"
    );

    const label = optional
        ? `${intl.formatMessage(messages.placeholder)} *${intl.formatMessage(
              commonMessages.optionalField
          )}`
        : intl.formatMessage(messages.placeholder);

    return (
        <MultiAutocompleteSelectField
            error={!!error}
            helperText={getGiftCardErrorMessage(error, intl)}
            name={name || "giftCardTag"}
            label={label}
            data-test-id="gift-card-tag-select-field"
            value={values}
            displayValues={getMultiChoices(values)}
            choices={choices}
            fetchChoices={search}
            onChange={toggleChange}
            onFetchMore={loadMore}
            loading={result?.loading || loading}
            allowCustomValues
        />
    );
};

export default GiftCardTagInput;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { transformFormToAddressInput } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { AccountErrorCode, AddressInput, AddressTypeEnum } from "@mzawadie/types/globalTypes";
import { add, remove } from "@mzawadie/utils/lists";
import { AddressTypeInput } from "@mzawadie/views/customers/types";
import { useState } from "react";

interface UseAddressValidation<TInput, TOutput> {
    errors: AccountErrorFragment[];
    submit: (data: TInput & AddressTypeInput) => TOutput;
}

function useAddressValidation<TInput, TOutput>(
    onSubmit: (address: TInput & AddressInput) => TOutput,
    addressType?: AddressTypeEnum
): UseAddressValidation<TInput, TOutput> {
    const [validationErrors, setValidationErrors] = useState<AccountErrorFragment[]>([]);

    const countryRequiredError: AccountErrorFragment = {
        __typename: "AccountError",
        code: AccountErrorCode.REQUIRED,
        field: "country",
        addressType,
    };

    return {
        errors: validationErrors,
        // eslint-disable-next-line consistent-return
        submit: (data: TInput & AddressTypeInput) => {
            try {
                setValidationErrors(
                    remove(countryRequiredError, validationErrors, (a, b) => a.field === b.field)
                );
                return onSubmit(transformFormToAddressInput(data));
            } catch {
                setValidationErrors(add(countryRequiredError, validationErrors));
            }
        },
    };
}

export default useAddressValidation;

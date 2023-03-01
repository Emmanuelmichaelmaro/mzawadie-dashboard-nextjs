// @ts-nocheck
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FormChange } from "@mzawadie/hooks/useForm";
import React from "react";

export interface SingleAutocompleteSelectedChangeHandlerProps {
    change: FormChange;
    setSelected: (value: string) => void;
    choices: SingleAutocompleteChoiceType[];
}

/**
 *
 * @param change
 * @param setSelected
 * @param choices
 */
function createSingleAutocompleteSelectHandler(
    change: FormChange,
    setSelected: (value: string) => void,
    choices: SingleAutocompleteChoiceType[]
): FormChange {
    return (event: React.ChangeEvent<any>) => {
        change(event);

        const { value } = event.target;
        const choice = choices.find((category) => category.value === value);

        setSelected(choice ? choice.label : value);
    };
}

export default createSingleAutocompleteSelectHandler;

import { maybe } from "@mzawadie/core";
import React from "react";

import { MultiAutocompleteChoiceType } from "../components/MultiAutocompleteSelectField";
import useListActions from "./useListActions";

function useMultiAutocomplete(initial: MultiAutocompleteChoiceType[] = []) {
    const { listElements, toggle } = useListActions<MultiAutocompleteChoiceType>(
        initial,
        (a, b) => a.value === b.value
    );

    const handleSelect = (event: React.ChangeEvent<any>, choices: MultiAutocompleteChoiceType[]) => {
        const { value } = event.target;
        const match = choices.find((choice) => choice.value === value);
        toggle({
            label: maybe(() => match?.label, value) || "",
            value,
        });
    };

    return {
        change: handleSelect,
        data: listElements,
    };
}

export default useMultiAutocomplete;

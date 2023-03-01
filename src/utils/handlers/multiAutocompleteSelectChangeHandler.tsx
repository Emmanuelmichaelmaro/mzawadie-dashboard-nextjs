// @ts-nocheck
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { combinedMultiAutocompleteChoices } from "@mzawadie/core";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import { toggle } from "@mzawadie/utils/lists";

/**
 * @param change Use toggleValue callback delivered by form
 * @param setSelected
 * @param selected
 * @param choices
 */
function createMultiAutocompleteSelectHandler(
    change: FormChange,
    setSelected: (choices: MultiAutocompleteChoiceType[]) => void,
    selected: MultiAutocompleteChoiceType[],
    choices: MultiAutocompleteChoiceType[]
): FormChange {
    return (event: ChangeEvent) => {
        change(event);

        const id = event.target.value;
        const combinedChoices = combinedMultiAutocompleteChoices(selected, choices);
        const choice = combinedChoices.find((choice) => choice.value === id);

        setSelected(toggle(choice, selected, (a, b) => a.value === b.value));
    };
}

export default createMultiAutocompleteSelectHandler;

import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import { toggle } from "@mzawadie/utils/lists";

/**
 * @param change Use toggleValue callback delivered by form
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
        const choice = choices.find((choice) => choice.value === id);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSelected(toggle(choice, selected, (a, b) => a.value === b.value));
    };
}

export default createMultiAutocompleteSelectHandler;

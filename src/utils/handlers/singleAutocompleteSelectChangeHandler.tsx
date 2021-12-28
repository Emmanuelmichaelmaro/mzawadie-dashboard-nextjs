// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FormChange } from "@mzawadie/hooks/useForm";

export interface SingleAutocompleteSelectedChangeHandlerProps {
    change: FormChange;
    setSelected: (value: string) => void;
    choices: SingleAutocompleteChoiceType[];
}

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

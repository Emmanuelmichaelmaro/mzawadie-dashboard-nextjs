import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";

export const getMultiChoices = (values: string[]): MultiAutocompleteChoiceType[] =>
    values.map((tag) => ({
        label: tag,
        value: tag,
    }));

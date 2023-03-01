import { ChangeEvent } from "@mzawadie/hooks/useForm";

export function onQueryChange(
    event: ChangeEvent,
    onFetch: (data: string) => void,
    setQuery: (data: string) => void
) {
    const { value } = event.target;

    onFetch(value);
    setQuery(value);
}

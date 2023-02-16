import { SubmitPromise } from "@mzawadie/hooks";

async function handleFormSubmit<T>(
    data: T,
    onSubmit: (data: T) => SubmitPromise,
    setChanged: (changed: boolean) => void,
    evt: { preventDefault: () => void }
): Promise<boolean> {
    evt.preventDefault();

    const errors = await onSubmit(data);

    const ok = errors?.length === 0;

    if (ok) {
        setChanged(false);
    }

    return ok;
}

export default handleFormSubmit;

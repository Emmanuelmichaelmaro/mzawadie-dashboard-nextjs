import { SubmitPromise } from "../../hooks/useForm";
declare function handleFormSubmit<T>(data: T, onSubmit: (data: T) => SubmitPromise, setChanged: (changed: boolean) => void): Promise<boolean>;
export default handleFormSubmit;

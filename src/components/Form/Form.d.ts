import React from "react";
import { SubmitPromise, UseFormResult } from "../../hooks/useForm";
export interface FormProps<T> {
    children: (props: UseFormResult<T>) => React.ReactNode;
    confirmLeave?: boolean;
    initial?: T;
    resetOnSubmit?: boolean;
    onSubmit?: (data: T) => SubmitPromise | void;
}
declare function Form<T>(props: FormProps<T>): JSX.Element;
declare namespace Form {
    var displayName: string;
}
export default Form;

// @ts-nocheck
import { FormId } from "@mzawadie/components";
import { SubmitPromise, UseFormResult, useForm } from "@mzawadie/hooks";
import React from "react";

export interface FormProps<TData, TErrors> extends Omit<React.HTMLProps<HTMLFormElement>, "onSubmit"> {
    children: (props: UseFormResult<TData>) => React.ReactNode;
    confirmLeave?: boolean;
    initial?: TData;
    resetOnSubmit?: boolean;
    onSubmit?: (data: TData) => SubmitPromise<TErrors[]> | void;
    formId?: FormId;
}

function Form<TData, Terrors>({
    children,
    initial,
    resetOnSubmit,
    onSubmit,
    confirmLeave = false,
    formId,
    ...rest
}: FormProps<TData, Terrors>) {
    const renderProps = useForm(initial, onSubmit, { confirmLeave, formId });

    function handleSubmit(event?: React.FormEvent<any>, cb?: () => void) {
        const { reset, submit } = renderProps;

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (cb) {
            cb();
        }

        if (resetOnSubmit) {
            reset();
        }

        submit();
    }

    return (
        <form {...rest} onSubmit={handleSubmit}>
            {children(renderProps)}
        </form>
    );
}

Form.displayName = "Form";

export default Form;

import { DEMO_MODE } from "@mzawadie/core";
import { FormChange, SubmitPromise, useForm, useHandleFormSubmit } from "@mzawadie/hooks";
import React from "react";

export interface LoginFormData {
    email: string;
    password: string;
}

export interface UseLoginFormResult {
    change: FormChange;
    data: LoginFormData;
    hasChanged: boolean;
    submit: () => SubmitPromise;
}

export interface LoginFormProps {
    children: (props: UseLoginFormResult) => React.ReactNode;
    onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = () => {
    if (DEMO_MODE) {
        return {
            email: "admin@example.com",
            password: "admin",
        };
    }
    return { email: "", password: "" };
};

function useLoginForm(onSubmit: (data: LoginFormData) => SubmitPromise): UseLoginFormResult {
    const form = useForm(getLoginFormData());

    const { change, hasChanged, data, setChanged } = form;

    const handleFormSubmit = useHandleFormSubmit({ onSubmit, setChanged });

    // eslint-disable-next-line @typescript-eslint/require-await
    const submit = async () => handleFormSubmit(data);

    return {
        change,
        data,
        hasChanged,
        submit,
    };
}

const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
    const props = useLoginForm(onSubmit);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Cypress tests blow up without it
        event.preventDefault();
        props.submit();
    };

    return <form onSubmit={handleSubmit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";

export default LoginForm;

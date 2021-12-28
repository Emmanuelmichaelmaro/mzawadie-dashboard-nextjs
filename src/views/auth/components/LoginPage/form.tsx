/* eslint-disable react/prop-types */
import { DEMO_MODE } from "@mzawadie/core";
import useForm, { FormChange, SubmitPromise } from "@mzawadie/hooks/useForm";
import handleFormSubmit from "@mzawadie/utils/handlers/handleFormSubmit";
import React from "react";

export interface LoginFormData {
    email: string;
    password: string;
}

export interface UseLoginFormResult {
    change: FormChange;
    data: LoginFormData;
    hasChanged: boolean;
    submit: () => Promise<boolean>;
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
    const [changed, setChanged] = React.useState(false);

    const triggerChange = () => setChanged(true);

    const form = useForm(getLoginFormData());

    const handleChange: FormChange = (event, cb) => {
        form.change(event, cb);
        triggerChange();
    };

    const data: LoginFormData = {
        ...form.data,
    };

    const handleSubmit = async (data: LoginFormData) => {
        const errors = await onSubmit(data);

        return errors;
    };

    // @ts-ignore
    // eslint-disable-next-line no-restricted-globals
    const submit = async () => handleFormSubmit(data, handleSubmit, setChanged, event);

    return {
        change: handleChange,
        data,
        hasChanged: changed,
        submit,
    };
}

const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
    const props = useLoginForm(onSubmit);

    // eslint-disable-next-line react/destructuring-assignment
    return <form onSubmit={props.submit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";

export default LoginForm;

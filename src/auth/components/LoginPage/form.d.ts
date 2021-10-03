import { FormChange, SubmitPromise } from "@mzawadie/hooks/useForm";
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
declare const LoginForm: React.FC<LoginFormProps>;
export default LoginForm;

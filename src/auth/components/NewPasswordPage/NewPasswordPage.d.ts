import { SetPassword_setPassword_errors } from "@mzawadie/auth/types/SetPassword";
import React from "react";
export interface NewPasswordPageFormData {
    password: string;
    confirmPassword: string;
}
export interface NewPasswordPageProps {
    disabled: boolean;
    errors: SetPassword_setPassword_errors[];
    onSubmit: (data: NewPasswordPageFormData) => void;
}
declare const NewPasswordPage: React.FC<NewPasswordPageProps>;
export default NewPasswordPage;

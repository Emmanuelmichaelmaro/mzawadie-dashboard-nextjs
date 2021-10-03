import React from "react";
export interface ResetPasswordPageFormData {
    email: string;
}
export interface ResetPasswordPageProps {
    disabled: boolean;
    error: string | undefined;
    onSubmit: (data: ResetPasswordPageFormData) => void;
}
declare const ResetPasswordPage: React.FC<ResetPasswordPageProps>;
export default ResetPasswordPage;

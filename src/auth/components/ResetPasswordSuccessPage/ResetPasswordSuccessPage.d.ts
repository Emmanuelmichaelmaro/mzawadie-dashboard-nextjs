import React from "react";
export interface ResetPasswordSuccessPageFormData {
    email: string;
}
export interface ResetPasswordSuccessPageProps {
    onBack: () => void;
}
declare const ResetPasswordSuccessPage: React.FC<ResetPasswordSuccessPageProps>;
export default ResetPasswordSuccessPage;

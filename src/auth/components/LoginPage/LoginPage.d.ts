import { AvailableExternalAuthentications_shop_availableExternalAuthentications } from "@mzawadie/auth/types/AvailableExternalAuthentications";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import React from "react";
import { LoginFormData } from "./form";
export interface LoginCardProps {
    error: boolean;
    externalError: boolean;
    disabled: boolean;
    loading: boolean;
    externalAuthentications?: AvailableExternalAuthentications_shop_availableExternalAuthentications[];
    onExternalAuthentication: (pluginId: string) => void;
    onPasswordRecovery: () => void;
    onSubmit?: (event: LoginFormData) => SubmitPromise;
}
declare const LoginCard: React.FC<LoginCardProps>;
export default LoginCard;

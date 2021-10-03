export declare const passwordResetPath = "/reset-password/";
export declare const passwordResetUrl = "/reset-password/";
export declare const passwordResetSuccessPath = "/reset-password/success/";
export declare const passwordResetSuccessUrl = "/reset-password/success/";
export declare const newPasswordPath = "/new-password/";
export declare const loginCallbackPath = "/login/callback/";
export interface NewPasswordUrlQueryParams {
    email: string;
    token: string;
}
export declare const newPasswordUrl: (params?: NewPasswordUrlQueryParams | undefined) => string;
export interface LoginOpenidconnectUrlQueryParams {
    code: string;
    state: string;
}
export declare type LoginUrlQueryParams = LoginOpenidconnectUrlQueryParams;

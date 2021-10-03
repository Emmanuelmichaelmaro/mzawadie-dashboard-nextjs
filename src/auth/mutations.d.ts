/// <reference types="react" />
import { RequestPasswordReset, RequestPasswordResetVariables } from "./types/RequestPasswordReset";
import { SetPassword, SetPasswordVariables } from "./types/SetPassword";
export declare const tokenAuthMutation: import("@apollo/client").DocumentNode;
export declare const tokenVerifyMutation: import("@apollo/client").DocumentNode;
export declare const tokenRefreshMutation: import("@apollo/client").DocumentNode;
export declare const requestPasswordReset: import("@apollo/client").DocumentNode;
export declare const RequestPasswordResetMutation: (props: import("../mutations").TypedMutationInnerProps<RequestPasswordReset, RequestPasswordResetVariables>) => JSX.Element;
export declare const setPassword: import("@apollo/client").DocumentNode;
export declare const SetPasswordMutation: (props: import("../mutations").TypedMutationInnerProps<SetPassword, SetPasswordVariables>) => JSX.Element;
export declare const externalAuthenticationUrlMutation: import("@apollo/client").DocumentNode;
export declare const externalObtainAccessTokensMutation: import("@apollo/client").DocumentNode;
export declare const externalTokenRefreshMutation: import("@apollo/client").DocumentNode;
export declare const externalTokenVerifyMutation: import("@apollo/client").DocumentNode;

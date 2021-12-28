import { ApolloClient } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/Messages";
import { User } from "@mzawadie/fragments/types/User";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import { useExternalAuthProvider } from "@mzawadie/views/auth/hooks/useExternalAuthProvider";
import { useMzawadieAuthProvider } from "@mzawadie/views/auth/hooks/useMzawadieAuthProvider";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

const redirectKey = "sign_in_redirect";

const setRedirect = (redirect: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    typeof window !== "undefined" ? window.sessionStorage.setItem(redirectKey, redirect) : undefined;
};

const getRedirect = (): string | null | undefined => {
    return typeof window !== "undefined" ? window.sessionStorage.getItem(redirectKey) : undefined;
};

const clearRedirect = () => {
    return typeof window !== "undefined" ? window.sessionStorage.removeItem(redirectKey) : undefined;
};

export interface UseAuthProvider {
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean>;
    tokenVerifyLoading: boolean;
    user?: User;
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined>;
    initializing?: boolean;
}

export interface UseAuthProviderOpts {
    intl: IntlShape;
    notify: IMessageContext;
    apolloClient: ApolloClient<any>;
}

export const useAuthProvider = (opts: UseAuthProviderOpts) => {
    const [authPlugin, setAuthPlugin] = useLocalStorage("authPlugin", undefined);

    const mzawadieAuth = useMzawadieAuthProvider({
        authPlugin,
        setAuthPlugin,
        ...opts,
    });

    const externalAuth = useExternalAuthProvider({
        authPlugin,
        setAuthPlugin,
        ...opts,
    });

    const loginAuth = {
        login: mzawadieAuth.login,
        loginByExternalPlugin: externalAuth.loginByExternalPlugin,
        loginByToken: mzawadieAuth.loginByToken,
        requestLoginByExternalPlugin: externalAuth.requestLoginByExternalPlugin,
    };

    if (authPlugin) {
        return {
            ...externalAuth,
            ...loginAuth,
            setRedirect,
            getRedirect,
            clearRedirect,
        };
    }

    return {
        ...mzawadieAuth,
        ...loginAuth,
        setRedirect,
        getRedirect,
        clearRedirect,
    };
};

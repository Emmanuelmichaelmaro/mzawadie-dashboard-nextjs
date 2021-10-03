import { ApolloClient } from "@apollo/client";
import { useExternalAuthProvider } from "@mzawadie/auth/hooks/useExternalAuthProvider";
import { useMzawadieAuthProvider } from "@mzawadie/auth/hooks/useMzawadieAuthProvider";
import { IMessageContext } from "@mzawadie/components/messages";
import { User } from "@mzawadie/fragments/types/User";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

export interface UseAuthProvider {
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean>;
    tokenVerifyLoading: boolean;
    user?: User;
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined>;
}

export interface UseAuthProviderOpts {
    intl: IntlShape;
    notify: IMessageContext;
    apolloClient: ApolloClient<any>;
}

export const useAuthProvider = (opts: UseAuthProviderOpts) => {
    const [authPlugin, setAuthPlugin] = useLocalStorage("authPlugin", "undefined");

    const saleorAuth = useMzawadieAuthProvider({
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
        login: saleorAuth.login,
        loginByExternalPlugin: externalAuth.loginByExternalPlugin,
        loginByToken: saleorAuth.loginByToken,
        requestLoginByExternalPlugin: externalAuth.requestLoginByExternalPlugin,
    };

    if (authPlugin) {
        return {
            ...externalAuth,
            ...loginAuth,
        };
    }

    return {
        ...saleorAuth,
        ...loginAuth,
    };
};

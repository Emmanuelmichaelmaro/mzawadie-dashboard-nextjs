/* eslint-disable unicorn/filename-case */
import { ApolloClient } from "@apollo/client"
import { MutableRefObject } from "react"
import { IntlShape } from "react-intl"

import { User } from "../../../generated/graphql"
import { IMessageContext } from "../../components/messages"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useExternalAuthProvider } from "./useExternalAuthProvider"
import { useSaleorAuthProvider } from "./useSaleorAuthProvider"

export interface UseAuthProvider {
    logout: () => void
    tokenAuthLoading: boolean
    tokenRefresh: () => Promise<boolean>
    tokenVerifyLoading: boolean
    user?: User
    autologinPromise?: MutableRefObject<Promise<any>>
}

export interface UseAuthProviderOptions {
    intl: IntlShape
    notify: IMessageContext
    apolloClient: ApolloClient<any>
}

export function useAuthProvider(options: UseAuthProviderOptions) {
    const [authPlugin, setAuthPlugin] = useLocalStorage("authPlugin")

    const saleorAuth = useSaleorAuthProvider({
        authPlugin,
        setAuthPlugin,
        ...options,
    })

    const externalAuth = useExternalAuthProvider({
        authPlugin,
        setAuthPlugin,
        ...options,
    })

    const loginAuth = {
        login: saleorAuth.login,
        loginByExternalPlugin: externalAuth.loginByExternalPlugin,
        loginByToken: saleorAuth.loginByToken,
        requestLoginByExternalPlugin: externalAuth.requestLoginByExternalPlugin,
    }

    if (authPlugin) {
        return {
            ...externalAuth,
            ...loginAuth,
        }
    }

    return {
        ...saleorAuth,
        ...loginAuth,
    }
}

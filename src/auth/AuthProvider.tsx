/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/indent */

/* eslint-disable unicorn/no-useless-undefined */

/* eslint-disable unicorn/filename-case */
import { ApolloClient, useApolloClient, useMutation } from "@apollo/client"
import React, { useContext, useEffect, useRef, useState } from "react"
import { IntlShape, useIntl } from "react-intl"

import {
    CreateToken,
    MutationTokenCreateArgs as MutationTokenCreateArguments,
    MutationTokenRefreshArgs as MutationTokenRefreshArguments,
    MutationTokenVerifyArgs as MutationTokenVerifyArguments,
    RefreshToken,
    User,
    VerifyToken,
} from "../../generated/graphql"
import { IMessageContext } from "../components/messages"
import { DEMO_MODE } from "../config"
import useNotifier from "../hooks/useNotifier"
import { getMutationStatus } from "../misc"
import {
    isSupported as isCredentialsManagementAPISupported,
    login as loginWithCredentialsManagementAPI,
    saveCredentials,
} from "../utils/credentialsManagement"
import { UserContext } from "./"
import { tokenAuthMutation, tokenRefreshMutation, tokenVerifyMutation } from "./mutations"
// import { useAuthProvider } from "./hooks/useAuthProvider"
import {
    displayDemoMessage,
    getTokens,
    removeTokens,
    setAuthToken,
    setTokens,
} from "./utils"

const persistToken = false

export function useAuthProvider(
    intl: IntlShape,
    notify: IMessageContext,
    apolloClient: ApolloClient<any>
) {
    const [userContext, setUserContext] = useState<undefined | User>()
    const autologinPromise = useRef<Promise<any>>()
    const refreshPromise = useRef<Promise<boolean>>()

    const logout = () => {
        setUserContext(undefined)
        if (isCredentialsManagementAPISupported) {
            navigator.credentials.preventSilentAccess()
        }
        removeTokens()
    }

    const [tokenAuth, tokenAuthResult] = useMutation<
        CreateToken,
        MutationTokenCreateArguments
    >(tokenAuthMutation, {
        client: apolloClient,
        onCompleted: (result) => {
            if (result.errors.length > 0) {
                logout()
            }

            const user = result.user

            // FIXME: Now we set state also when auth fails and returned user is
            // `null`, because the LoginView uses this `null` to display error.
            setUserContext(user!)
            if (user) {
                setTokens(result.token!, result.csrfToken!, persistToken)
            }
        },
        onError: logout,
    })

    const [tokenRefresh] = useMutation<RefreshToken, MutationTokenRefreshArguments>(
        tokenRefreshMutation,
        {
            client: apolloClient,
            onError: logout,
        }
    )

    const [tokenVerify, tokenVerifyResult] = useMutation<
        VerifyToken,
        MutationTokenVerifyArguments
    >(tokenVerifyMutation, {
        client: apolloClient,
        onCompleted: (result) => {
            if (result === null) {
                logout()
            } else {
                const user = result?.user

                if (!!user) {
                    setUserContext(user)
                }
            }
        },
        onError: logout,
    })

    const tokenAuthOptions = {
        ...tokenAuthResult,
        status: getMutationStatus(tokenAuthResult),
    }

    const tokenVerifyOptions = {
        ...tokenVerifyResult,
        status: getMutationStatus(tokenVerifyResult),
    }

    const onLogin = () => {
        if (DEMO_MODE) {
            displayDemoMessage(intl, notify)
        }
    }

    useEffect(() => {
        const token = getTokens().auth
        autologinPromise.current =
            !!token && !userContext
                ? tokenVerify({ variables: { token } })
                : loginWithCredentialsManagementAPI(login)
    }, [])

    const login = async (email: string, password: string) => {
        const result = await tokenAuth({ variables: { email, password } })

        if (result && result?.data?.errors.length === 0) {
            if (!!onLogin) {
                onLogin()
            }
            saveCredentials(result.data?.user, password)

            return result.data?.user
        }

        // eslint-disable-next-line unicorn/no-null
        return null
    }

    const loginByToken = (auth: string, refresh: string, user: User) => {
        setUserContext(user)
        setTokens(auth, refresh, persistToken)
    }

    const refreshToken = (): Promise<boolean> => {
        if (!!refreshPromise.current) {
            return refreshPromise.current
        }

        return new Promise((resolve) => {
            const token = getTokens().refresh

            return tokenRefresh({ variables: { refreshToken: token } }).then(
                (refreshData) => {
                    if (!!refreshData.data?.token) {
                        setAuthToken(refreshData.data?.token, persistToken)
                        return resolve(true)
                    }

                    return resolve(false)
                }
            )
        })
    }

    return {
        autologinPromise,
        login,
        loginByToken,
        logout,
        refreshToken,
        tokenAuthOpts: tokenAuthOptions,
        tokenVerifyOpts: tokenVerifyOptions,
        userContext,
    }
}

interface AuthProviderProperties {
    children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
const AuthProvider: React.FC<AuthProviderProperties> = ({ children }) => {
    const apolloClient = useApolloClient()
    const intl = useIntl()
    const notify = useNotifier()

    // const authProvider = useAuthProvider({ apolloClient, intl, notify })

    // return <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>

    const {
        login,
        loginByToken,
        logout,
        tokenAuthOpts,
        refreshToken,
        tokenVerifyOpts,
        userContext,
    } = useAuthProvider(intl, notify, apolloClient)

    return (
        <UserContext.Provider
            value={{
                login,
                loginByToken,
                logout,
                tokenAuthLoading: tokenAuthOpts.loading,
                tokenRefresh: refreshToken,
                tokenVerifyLoading: tokenVerifyOpts.loading,
                user: userContext,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAuth = () => {
    const user = useContext(UserContext)
    const isAuthenticated = !!user.user

    return {
        hasToken: !!getTokens(),
        isAuthenticated,
        tokenAuthLoading: user.tokenAuthLoading,
        tokenVerifyLoading: user.tokenVerifyLoading,
        user: user.user,
    }
}

export default AuthProvider

/* eslint-disable unicorn/filename-case */

/* eslint-disable unicorn/no-useless-undefined */

/* eslint-disable unicorn/filename-case */

/* eslint-disable @typescript-eslint/indent */

/* eslint-disable unicorn/filename-case */
import { useMutation } from "@apollo/client"
import { useEffect, useRef, useState } from "react"

import {
    ExternalAuthenticationUrl,
    ExternalObtainAccessTokens,
    ExternalRefresh,
    ExternalVerify,
    MutationExternalAuthenticationUrlArgs as MutationExternalAuthenticationUrlArguments,
    MutationExternalObtainAccessTokensArgs as MutationExternalObtainAccessTokensArguments,
    MutationExternalRefreshArgs as MutationExternalRefreshArguments,
    MutationExternalVerifyArgs as MutationExternalVerifyArguments,
    User,
} from "../../../generated/graphql"
import { DEMO_MODE } from "../../config"
import { SetLocalStorage } from "../../hooks/useLocalStorage"
import { commonMessages } from "../../intl"
import { getFullName, getMutationStatus } from "../../misc"
import errorTracker from "../../services/errorTracking"
import {
    externalAuthenticationUrlMutation,
    externalObtainAccessTokensMutation,
    externalTokenRefreshMutation,
    externalTokenVerifyMutation,
} from "../mutations"
import {
    displayDemoMessage,
    getTokens,
    removeTokens,
    setAuthToken,
    setTokens,
} from "../utils"
import { UseAuthProvider, UseAuthProviderOptions } from "./useAuthProvider"

const persistToken = false

export interface RequestExternalLoginInput {
    redirectUri: string
}

export interface ExternalLoginInput {
    code: string
    state: string
}

export interface UseExternalAuthProvider extends UseAuthProvider {
    requestLoginByExternalPlugin: (
        pluginId: string,
        input: RequestExternalLoginInput
    ) => Promise<void>
    loginByExternalPlugin: (
        input: ExternalLoginInput
    ) => Promise<ExternalObtainAccessTokens>
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export interface UseExternalAuthProviderOpts extends UseAuthProviderOptions {
    setAuthPlugin: SetLocalStorage<any>
    authPlugin: string
}

export function useExternalAuthProvider({
    apolloClient,
    authPlugin,
    intl,
    notify,
    setAuthPlugin,
}: UseExternalAuthProviderOpts): UseExternalAuthProvider {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const [userContext, setUserContext] = useState<undefined | User>(undefined)
    const autologinPromise = useRef<Promise<any>>()
    const refreshPromise = useRef<Promise<boolean>>()

    useEffect(() => {
        const token = getTokens().auth

        if (authPlugin && !!token && !userContext) {
            const input = JSON.stringify({
                token,
            })
            autologinPromise.current = tokenVerify({
                variables: { input, pluginId: authPlugin },
            })
        }
    }, [])

    useEffect(() => {
        if (authPlugin && userContext) {
            const { id, email } = userContext
            errorTracker.setUserData({
                email,
                id,
                username: getFullName(userContext),
            })

            // eslint-disable-next-line unicorn/consistent-destructuring
            if (!userContext.isStaff) {
                logout()
                notify({
                    status: "error",
                    text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
                    title: intl.formatMessage(commonMessages.insufficientPermissions),
                })
            }
        }
    }, [userContext])

    const logout = () => {
        setUserContext(undefined)
        setAuthPlugin(undefined)
        removeTokens()
    }

    const [externalAuthenticationUrl] = useMutation<
        ExternalAuthenticationUrl,
        MutationExternalAuthenticationUrlArguments
    >(externalAuthenticationUrlMutation, {
        client: apolloClient,
        onError: logout,
    })

    const [obtainAccessTokens, obtainAccessTokensResult] = useMutation<
        ExternalObtainAccessTokens,
        MutationExternalObtainAccessTokensArguments
    >(externalObtainAccessTokensMutation, {
        client: apolloClient,
        onCompleted: ({ errors, csrfToken, token, user }) => {
            if (errors.length > 0) {
                logout()
            }

            setUserContext(user!)

            if (user) {
                setTokens(token!, csrfToken!, persistToken)
            }
        },
        onError: logout,
    })

    const [tokenRefresh] = useMutation<ExternalRefresh, MutationExternalRefreshArguments>(
        externalTokenRefreshMutation,
        {
            client: apolloClient,
            onError: logout,
        }
    )

    const [tokenVerify, tokenVerifyResult] = useMutation<
        ExternalVerify,
        MutationExternalVerifyArguments
    >(externalTokenVerifyMutation, {
        client: apolloClient,
        onCompleted: (result) => {
            if (result === null) {
                logout()
            } else {
                const user = result.user

                if (!!user) {
                    setUserContext(user)
                }
            }
        },
        onError: logout,
    })

    const obtainAccessTokensOptions = {
        ...obtainAccessTokensResult,
        status: getMutationStatus(obtainAccessTokensResult),
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

    const requestLoginByExternalPlugin = async (
        pluginId: string,
        pluginInput: RequestExternalLoginInput
    ) => {
        const input = JSON.stringify(pluginInput)
        const result = await externalAuthenticationUrl({
            variables: {
                input,
                pluginId,
            },
        })

        if (result && result.data?.errors.length === 0) {
            setAuthPlugin(pluginId)

            const authenticationData = JSON.parse(result.data.authenticationData)

            location.href = authenticationData.authorizationUrl
        } else {
            setAuthPlugin(undefined)
        }
    }

    const loginByExternalPlugin = async (loginInput: ExternalLoginInput) => {
        const input = JSON.stringify(loginInput)
        const result = await obtainAccessTokens({
            variables: { input, pluginId: authPlugin },
        })

        if (result && !result.data?.errors?.length) {
            if (!!onLogin) {
                onLogin()
            }
        } else {
            setAuthPlugin(undefined)
        }

        return result?.data
    }

    const refreshToken = (): Promise<boolean> => {
        if (!!refreshPromise.current) {
            return refreshPromise.current
        }

        return new Promise((resolve) => {
            const token = getTokens().refresh
            const input = JSON.stringify({
                refreshToken: token,
            })

            return tokenRefresh({ variables: { input, pluginId: authPlugin } }).then(
                (refreshData) => {
                    if (!!refreshData.data?.token) {
                        setAuthToken(refreshData.data.token, persistToken)
                        return resolve(true)
                    }

                    return resolve(false)
                }
            )
        })
    }

    return {
        autologinPromise,
        loginByExternalPlugin,
        logout,
        requestLoginByExternalPlugin,
        tokenAuthLoading: obtainAccessTokensOptions.loading,
        tokenRefresh: refreshToken,
        tokenVerifyLoading: tokenVerifyOptions.loading,
        user: userContext,
    }
}

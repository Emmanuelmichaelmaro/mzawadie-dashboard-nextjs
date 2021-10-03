import { ExternalObtainAccessTokens_externalObtainAccessTokens } from "@mzawadie/auth/types/ExternalObtainAccessTokens";
import { SetLocalStorage } from "@mzawadie/hooks/useLocalStorage";
import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";
export interface RequestExternalLoginInput {
    redirectUri: string;
}
export interface ExternalLoginInput {
    code: string;
    state: string;
}
export interface UseExternalAuthProvider extends UseAuthProvider {
    requestLoginByExternalPlugin: (pluginId: string, input: RequestExternalLoginInput) => Promise<void>;
    loginByExternalPlugin: (input: ExternalLoginInput) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens | null | undefined>;
}
export interface UseExternalAuthProviderOpts extends UseAuthProviderOpts {
    setAuthPlugin: SetLocalStorage<any>;
    authPlugin: string;
}
export declare const useExternalAuthProvider: ({ apolloClient, intl, notify, authPlugin, setAuthPlugin, }: UseExternalAuthProviderOpts) => UseExternalAuthProvider;

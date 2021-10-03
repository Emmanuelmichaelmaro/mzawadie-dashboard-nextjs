import { TokenAuth_tokenCreate } from "@mzawadie/auth/types/TokenAuth";
import { User } from "@mzawadie/fragments/types/User";
import { SetLocalStorage } from "@mzawadie/hooks/useLocalStorage";
import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";
export interface UseMzawadieAuthProvider extends UseAuthProvider {
    login: (username: string, password: string) => Promise<TokenAuth_tokenCreate | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
}
export interface UseMzawadieAuthProviderOpts extends UseAuthProviderOpts {
    setAuthPlugin: SetLocalStorage<any>;
    authPlugin: string;
}
export declare const useMzawadieAuthProvider: ({ apolloClient, intl, notify, authPlugin, setAuthPlugin, }: UseMzawadieAuthProviderOpts) => UseMzawadieAuthProvider;

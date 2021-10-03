import { User } from "@mzawadie/fragments/types/User";
declare global {
    interface Window {
        PasswordCredential: any;
    }
}
export declare const isSupported: boolean;
export declare function login<T>(loginFunction: (id: string, password: string) => T): Promise<T | null>;
export declare function saveCredentials(user: User, password: string): Promise<Credential | null>;

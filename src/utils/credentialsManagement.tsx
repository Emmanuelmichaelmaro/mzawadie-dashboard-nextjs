// @ts-nocheck
import { User } from "@mzawadie/fragments/types/User";

export const isSupported = !!(typeof window !== "undefined"
    ? navigator?.credentials?.preventSilentAccess() && window.PasswordCredential
    : undefined);

export async function login<T>(loginFunction: (id: string, password: string) => T): Promise<T | null> {
    let result: T;

    try {
        const credential = await navigator.credentials.get({ password: true });
        if (credential instanceof PasswordCredential) {
            result = loginFunction(credential.id, credential.password || "");
        }
    } catch {
        // The user either does not have credentials for this site, or
        // refused to share them. Insert some code here to fall back to
        // a basic login form.
        // @ts-ignore
        result = null;
    }

    // @ts-ignore
    return result;
}

export function saveCredentials(user: User, password: string): Promise<Credential | null> {
    let result: Promise<Credential | null>;

    if (isSupported) {
        const cred = new PasswordCredential({
            iconURL:
                user.avatar !== null
                    ? user.avatar?.url
                    : "https://www.flaticon.com/free-icon/profile-user_64572",
            id: user.email,
            name: user.firstName ? `${user.firstName} ${user.lastName}` : "John Doe",
            password,
        });
        try {
            result = navigator.credentials.store(cred);
        } catch {
            result = Promise.resolve(null);
        }
    } else {
        result = Promise.resolve(null);
    }

    return result;
}

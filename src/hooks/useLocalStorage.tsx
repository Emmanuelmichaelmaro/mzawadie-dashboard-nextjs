import { useState } from "react";

export type SetLocalStorageValue<T> = T | ((previousValue: T) => T);
export type SetLocalStorage<T> = (value: SetLocalStorageValue<T>) => void;

export default function useLocalStorage<T>(key: string, initialValue: T): [T, SetLocalStorage<T>] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : undefined;
        return item || initialValue;
    });

    const setValue = (value: SetLocalStorageValue<T>) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            typeof window !== "undefined"
                ? window.localStorage.setItem(key, JSON.stringify(valueToStore))
                : undefined;
        } catch {
            console.warn(`Could not save ${key} to localStorage`);
        }
    };

    return [storedValue, setValue];
}

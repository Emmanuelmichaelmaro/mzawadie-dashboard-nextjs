/* eslint-disable unicorn/filename-case */
import { useState } from "react"

export type SetLocalStorageValue<T> = T | ((previousValue: T) => T)
export type SetLocalStorage<T> = (value: SetLocalStorageValue<T>) => void

export default function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, SetLocalStorage<T>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
    })

    const setValue = (value: SetLocalStorageValue<T>) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch {
            console.warn(`Could not save ${key} to localStorage`)
        }
    }

    return [storedValue, setValue]
}

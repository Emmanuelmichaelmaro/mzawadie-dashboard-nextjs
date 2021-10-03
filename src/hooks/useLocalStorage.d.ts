export declare type SetLocalStorageValue<T> = T | ((previousValue: T) => T);
export declare type SetLocalStorage<T> = (value: SetLocalStorageValue<T>) => void;
export default function useLocalStorage<T>(key: string, initialValue: T): [T, SetLocalStorage<T>];

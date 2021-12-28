import { useEffect, useRef } from "react";

export type UseDebounceFn<T> = (...arguments_: T[]) => void;

function useDebounce<T>(debounceFunction: UseDebounceFn<T>, time = 200): UseDebounceFn<T> {
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current!), []);

    return (...arguments_: T[]) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        // @ts-ignore
        timer.current = setTimeout(() => debounceFunction(...arguments_), time);
    };
}

export default useDebounce;

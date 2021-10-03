import React from "react";
export interface ChangeEvent<TData = any> {
    target: {
        name: string;
        value: TData;
    };
}
export declare type SubmitPromise = Promise<any[]>;
export declare type FormChange = (event: ChangeEvent, cb?: () => void) => void;
export declare type FormErrors<T> = {
    [field in keyof T]?: string | React.ReactNode;
};
export interface UseFormResult<T> {
    change: FormChange;
    data: T;
    hasChanged: boolean;
    reset: () => void;
    set: (data: Partial<T>) => void;
    submit: () => void;
    triggerChange: () => void;
    toggleValue: FormChange;
    errors: FormErrors<T>;
    setChanged: (value: boolean) => void;
    setError: (name: keyof T, error: string | React.ReactNode) => void;
    clearErrors: (name?: keyof T | Array<keyof T>) => void;
}
declare type FormData = Record<string, any | any[]>;
declare function useForm<T extends FormData>(initial: T | undefined, onSubmit?: (data: T) => SubmitPromise | void): UseFormResult<T>;
export default useForm;

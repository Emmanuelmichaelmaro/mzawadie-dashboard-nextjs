export declare type FormsetChange<TValue = any> = (id: string, value: TValue) => void;
export interface FormsetAtomicData<TData = {}, TValue = any> {
    data: TData;
    id: string;
    label: string;
    value: TValue;
}
export declare type FormsetData<TData = {}, TValue = any> = Array<FormsetAtomicData<TData, TValue>>;
export interface UseFormsetOutput<TData = {}, TValue = any> {
    add: (data: FormsetAtomicData<TData, TValue>) => void;
    change: FormsetChange<TValue>;
    data: FormsetData<TData, TValue>;
    get: (id: string) => FormsetAtomicData<TData, TValue> | undefined;
    set: (data: FormsetData<TData, TValue>) => void;
    remove: (id: string) => void;
}
declare function useFormset<TData = {}, TValue = any>(initial: FormsetData<TData, TValue>): UseFormsetOutput<TData, TValue>;
export default useFormset;

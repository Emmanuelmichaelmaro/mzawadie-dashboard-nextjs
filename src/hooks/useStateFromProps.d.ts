import { Dispatch, SetStateAction } from "react";
export interface UseStateFromPropsOpts<T> {
    mergeFunc?: (prevData: T, state: T, newData: T) => T;
    onRefresh?: (data: T) => void;
}
declare function useStateFromProps<T>(data: T, opts?: UseStateFromPropsOpts<T>): [T, Dispatch<SetStateAction<T>>];
export default useStateFromProps;

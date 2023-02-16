import React from "react";

export interface DebounceProps<T> {
    children: (props: (...args: T[]) => void) => React.ReactNode;
    debounceFn: (...args: T[]) => void;
    time?: number;
}

export class Debounce<T> extends React.Component<DebounceProps<T>> {
    timer: null | ReturnType<typeof setTimeout> = null;

    // eslint-disable-next-line react/sort-comp
    handleDebounce = (...args: T[]) => {
        const { debounceFn, time } = this.props;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => debounceFn(...args), time || 200);
    };

    componentWillUnmount() {
        clearTimeout(Number(this.timer));
    }

    render() {
        return this.props.children(this.handleDebounce);
    }
}

export default Debounce;

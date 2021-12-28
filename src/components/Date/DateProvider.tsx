import React from "react";

import { Provider } from "./DateContext";

interface DateProviderState {
    date: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class DateProvider extends React.Component<{}, DateProviderState> {
    // eslint-disable-next-line react/static-property-placement
    static contextTypes = {};

    intervalId: number | undefined;

    // eslint-disable-next-line react/state-in-constructor
    state = {
        date: Date.now(),
    };

    componentDidMount() {
        this.intervalId = window.setInterval(() => this.setState({ date: Date.now() }), 10_000);
    }

    componentWillUnmount() {
        window.clearInterval(this.intervalId);
    }

    render() {
        const { children } = this.props;
        const { date } = this.state;
        return <Provider value={date}>{children}</Provider>;
    }
}

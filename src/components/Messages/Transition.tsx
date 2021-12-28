import React from "react";
import { Transition as MessageManagerTransition } from "react-transition-group";

const duration = 250;

const defaultStyle = {
    opacity: 0,
    transition: `opacity ${duration}ms ease`,
};

const transitionStyles: any = {
    entered: { opacity: 1 },
    entering: { opacity: 0 },
};

const Transition = ({ children, ...properties }: any) => (
    <MessageManagerTransition {...properties} timeout={duration}>
        {(state) => (
            <div
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                }}
            >
                {children}
            </div>
        )}
    </MessageManagerTransition>
);

export default Transition;

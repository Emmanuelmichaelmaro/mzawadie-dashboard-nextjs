// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import throttle from "lodash/throttle";
import React, { useEffect, useState } from "react";

export type Position = Record<"x" | "y", number>;

function getPosition(anchor?: HTMLElement | null): Position | undefined {
    if (anchor) {
        return {
            x: anchor.scrollLeft,
            y: anchor.scrollTop,
        };
    }
    return undefined;
}

export function isScrolledToBottom(
    anchor: React.MutableRefObject<HTMLDivElement | null | undefined>,
    position: Position,
    offset = 0
) {
    return !!anchor.current && position
        ? position.y + anchor.current.clientHeight + offset >= anchor.current.scrollHeight
        : undefined;
}

function useElementScroll(anchor: React.MutableRefObject<null>): Position {
    const [scroll, setScroll] = useState(getPosition(anchor.current));

    useEffect(() => {
        if (anchor.current) {
            const handleScroll = throttle(() => setScroll(getPosition(anchor.current)), 100);

            anchor.current.addEventListener("scroll", handleScroll);

            return () => {
                if (anchor.current) {
                    anchor.current.removeEventListener("scroll", handleScroll);
                }
            };
        }
    }, [anchor]);

    useEffect(() => {
        setTimeout(() => setScroll(getPosition(anchor.current)), 100);
    }, [anchor]);

    return scroll as Position;
}

export default useElementScroll;

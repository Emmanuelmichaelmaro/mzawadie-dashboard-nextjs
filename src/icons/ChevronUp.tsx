import { createSvgIcon } from "@material-ui/core";
import React from "react";

const ChevronUp = createSvgIcon(
    <svg width="10" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6L5 2L1 6" stroke="#28234A" strokeOpacity="0.4" strokeWidth="2" />
    </svg>,
    "ChevronUp"
);

export default ChevronUp;

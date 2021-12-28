import React from "react";

import { AppStateContext } from "../containers/AppState";

function useAppState() {
    return React.useContext(AppStateContext);
}

export default useAppState;

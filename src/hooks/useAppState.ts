import React from "react";

import { AppStateContext } from "../containers/AppState";

export const useAppState = () => React.useContext(AppStateContext);

export default useAppState;

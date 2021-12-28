import { createContext } from "react";

import { BackgroundTasksContextType } from "./types";

// @ts-ignore
const BackgroundTasksContext = createContext<BackgroundTasksContextType>(null);

export default BackgroundTasksContext;

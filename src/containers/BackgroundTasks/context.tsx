import { createContext } from "react";

import { BackgroundTasksContextType } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const BackgroundTasksContext = createContext<BackgroundTasksContextType>(null);

export default BackgroundTasksContext;

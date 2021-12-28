import BackgroundTasksContext from "@mzawadie/containers/BackgroundTasks/context";
import { useContext } from "react";

function useBackgroundTask() {
    return useContext(BackgroundTasksContext);
}

export default useBackgroundTask;

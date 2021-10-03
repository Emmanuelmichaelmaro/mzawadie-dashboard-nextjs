import { ApolloClient } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/messages";
import React from "react";
import { IntlShape } from "react-intl";
import { Task, TaskData } from "./types";
export declare const backgroundTasksRefreshTime: number;
export declare function useBackgroundTasks(apolloClient: ApolloClient<any>, notify: IMessageContext, intl: IntlShape): {
    cancel: (id: number) => void;
    queue: (type: Task, data?: TaskData | undefined) => number;
};
declare const BackgroundTasksProvider: React.FC;
export default BackgroundTasksProvider;

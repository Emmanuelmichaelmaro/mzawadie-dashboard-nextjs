import { ApolloQueryResult } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/messages";
import React from "react";
import { IntlShape } from "react-intl";
import { InvoiceGenerateParams, QueuedTask, TaskData, TaskStatus } from "./types";
import { CheckExportFileStatus } from "./types/CheckExportFileStatus";
import { CheckOrderInvoicesStatus } from "./types/CheckOrderInvoicesStatus";
export declare function handleTask(task: QueuedTask): Promise<TaskStatus>;
export declare function handleError(error: Error): void;
export declare function queueCustom(id: number, tasks: React.MutableRefObject<QueuedTask[]>, data: TaskData | undefined): void;
export declare function queueInvoiceGenerate(id: number, generateInvoice: InvoiceGenerateParams | undefined, tasks: React.MutableRefObject<QueuedTask[]>, fetch: () => Promise<ApolloQueryResult<CheckOrderInvoicesStatus>>, notify: IMessageContext, intl: IntlShape): void;
export declare function queueExport(id: number, tasks: React.MutableRefObject<QueuedTask[]>, fetch: () => Promise<ApolloQueryResult<CheckExportFileStatus>>, notify: IMessageContext, intl: IntlShape): void;

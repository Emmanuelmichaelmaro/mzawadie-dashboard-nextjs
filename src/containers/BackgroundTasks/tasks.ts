// @ts-nocheck
import { ApolloQueryResult } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/Messages";
import { commonMessages } from "@mzawadie/core";
import {
    CheckExportFileStatusQuery,
    CheckOrderInvoicesStatusQuery,
    JobStatusEnum,
} from "@mzawadie/graphql";
import React from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";
import { InvoiceGenerateParams, QueuedTask, TaskData, TaskStatus } from "./types";

function getTaskStatus(jobStatus: JobStatusEnum): TaskStatus {
    switch (jobStatus) {
        case JobStatusEnum.SUCCESS:
            return TaskStatus.SUCCESS;
        case JobStatusEnum.PENDING:
            return TaskStatus.PENDING;
        default:
            return TaskStatus.FAILURE;
    }
}

export async function handleTask(task: QueuedTask): Promise<TaskStatus> {
    let status = TaskStatus.PENDING;
    try {
        status = await task.handle();
        if (status !== TaskStatus.PENDING) {
            task.onCompleted({
                status,
            });
        }
    } catch (error) {
        task.onError(error);
    }

    return status;
}

export function handleError(error: Error) {
    throw error;
}

export function queueCustom(id: number, tasks: React.MutableRefObject<QueuedTask[]>, data: TaskData) {
    (["handle", "onCompleted"] as Array<keyof TaskData>)
        .filter((field) => !data[field])
        .forEach((field) => {
            throw new Error(`${field} is required when creating custom task`);
        });
    tasks.current = [
        ...tasks.current,
        {
            handle: data.handle,
            id,
            onCompleted: data.onCompleted,
            onError: data.onError || handleError,
            status: TaskStatus.PENDING,
        },
    ];
}

export function queueInvoiceGenerate(
    id: number,
    generateInvoice: InvoiceGenerateParams,
    tasks: React.MutableRefObject<QueuedTask[]>,
    fetch: () => Promise<ApolloQueryResult<CheckOrderInvoicesStatusQuery>>,
    notify: IMessageContext,
    intl: IntlShape
) {
    if (!generateInvoice) {
        throw new Error("generateInvoice is required when creating custom task");
    }
    tasks.current = [
        ...tasks.current,
        {
            handle: async () => {
                const result = await fetch();
                const { status } = result.data.order.invoices.find(
                    (invoice) => invoice.id === generateInvoice.invoiceId
                );

                return getTaskStatus(status);
            },
            id,
            onCompleted: (data) =>
                data.status === TaskStatus.SUCCESS
                    ? notify({
                          status: "success",
                          text: intl.formatMessage(messages.invoiceGenerateFinishedText),
                          title: intl.formatMessage(messages.invoiceGenerateFinishedTitle),
                      })
                    : notify({
                          status: "error",
                          text: intl.formatMessage(commonMessages.somethingWentWrong),
                          title: intl.formatMessage(messages.invoiceGenerationFailedTitle),
                      }),
            onError: handleError,
            status: TaskStatus.PENDING,
        },
    ];
}

export function queueExport(
    id: number,
    tasks: React.MutableRefObject<QueuedTask[]>,
    fetch: () => Promise<ApolloQueryResult<CheckExportFileStatusQuery>>,
    notify: IMessageContext,
    intl: IntlShape
) {
    tasks.current = [
        ...tasks.current,
        {
            handle: async () => {
                const result = await fetch();
                const { status } = result.data.exportFile;

                return getTaskStatus(status);
            },
            id,
            onCompleted: (data) =>
                data.status === TaskStatus.SUCCESS
                    ? notify({
                          status: "success",
                          text: intl.formatMessage(messages.exportFinishedText),
                          title: intl.formatMessage(messages.exportFinishedTitle),
                      })
                    : notify({
                          status: "error",
                          text: intl.formatMessage(commonMessages.somethingWentWrong),
                          title: intl.formatMessage(messages.exportFailedTitle),
                      }),
            onError: handleError,
            status: TaskStatus.PENDING,
        },
    ];
}

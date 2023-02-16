import React, { createContext } from "react";

export type Status = "success" | "error" | "info" | "warning";

export interface IMessage {
    actionBtn?: {
        label: string;
        action: () => void;
    };
    autoHide?: number | null | undefined;
    expandText?: string;
    title?: string;
    text: React.ReactNode;
    onUndo?: () => void;
    status?: Status;
}

export interface INotification {
    id: number;
    message: IMessage;
    timeout: number;
    close: () => void;
}

export interface ITimer {
    id: number;
    notification: INotification;
    remaining: number;
    start: number;
    timeoutId: number;
}

export const types = {
    ERROR: "error",
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
};

export interface INotificationContext {
    show: (message: IMessage, timeout?: number | null) => void;
    remove: (notification: INotification) => void;
}

export type IMessageContext = (message: IMessage) => void;

export const MessageContext = createContext<INotificationContext | null>(null);

// @ts-ignore
export { default as MessageManagerProvider } from "./MessageManagerProvider";

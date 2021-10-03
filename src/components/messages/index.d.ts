/// <reference types="react" />
export declare type Status = "success" | "error" | "info" | "warning";
export interface IMessage {
    actionBtn?: {
        label: string;
        action: () => void;
    };
    autohide?: number;
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
export declare const types: {
    ERROR: string;
    INFO: string;
    SUCCESS: string;
    WARNING: string;
};
export interface INotificationContext {
    show: (message: IMessage, timeout?: number | null) => void;
    remove: (notification: INotification) => void;
}
export declare type IMessageContext = (message: IMessage) => void;
export declare const MessageContext: import("react").Context<INotificationContext>;
export * from "./MessageManagerProvider";
export { default } from "./MessageManagerProvider";

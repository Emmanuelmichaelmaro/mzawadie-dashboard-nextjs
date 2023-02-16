// @ts-nocheck
import { IMessage, IMessageContext, MessageContext } from "@mzawadie/components";
import { useContext } from "react";

export type UseNotifierResult = IMessageContext;

function useNotifier(): UseNotifierResult {
    const notificationContext = useContext(MessageContext);

    return (options: IMessage) => {
        const timeout = options.status === "error" ? null : options.autoHide;
        notificationContext.show(options, timeout);
    };
}

export default useNotifier;

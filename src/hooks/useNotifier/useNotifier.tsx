import { IMessage, IMessageContext, MessageContext } from "@mzawadie/components/messages";
import { useContext } from "react";

export type UseNotifierResult = IMessageContext;

function useNotifier(): UseNotifierResult {
    const notificationContext = useContext(MessageContext);

    return (options: IMessage) => {
        const timeout = options.status === "error" ? null : options.autohide;
        notificationContext.show(options, timeout);
    };
}

export default useNotifier;

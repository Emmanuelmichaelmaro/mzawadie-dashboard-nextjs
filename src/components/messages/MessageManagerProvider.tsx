/* eslint-disable unicorn/filename-case */
import { Notification } from "@saleor/macaw-ui"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { TransitionGroup } from "react-transition-group"

// eslint-disable-next-line prettier/prettier
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "../../config"
// eslint-disable-next-line prettier/prettier
import { INotification, ITimer, MessageContext } from "."
// eslint-disable-next-line prettier/prettier
import Container from "./Container"
import Transition from "./Transition"
// eslint-disable-next-line prettier/prettier
import { useStyles } from "./styles"
import Transition from "./Transition"

const MessageManagerProvider = ({ children }: any) => {
    const classes = useStyles()
    const timersArray = useRef<ITimer[]>([])
    const [notifications, setNotifications] = useState<INotification[]>([])

    useEffect(() => {
        const timersArrayReference = timersArray.current

        return () => {
            for (const timer of timersArrayReference) clearTimeout(timer.timeoutId)
        }
    }, [])

    const timerCallback = (notification: INotification) => {
        remove(notification.id)
        timersArray.current = timersArray.current.filter(
            (timer) => timer.id !== notification.id
        )
    }

    const remove = useCallback((notificationId) => {
        setNotifications((currentNotifications) =>
            currentNotifications.filter((n) => n.id !== notificationId)
        )
    }, [])

    const show = useCallback((message = {}, timeout = DEFAULT_NOTIFICATION_SHOW_TIME) => {
        const id = Date.now()
        const notification = {
            close: () => remove(id),
            id,
            message,
            timeout,
        }
        if (timeout !== null) {
            const timeoutId = window.setTimeout(() => {
                timerCallback(notification)
            }, timeout)

            timersArray.current.push({
                id: notification.id,
                notification,
                remaining: timeout,
                start: Date.now(),
                timeoutId,
            })
        }

        setNotifications((state) => [notification, ...state])

        return notification
    }, [])

    const getCurrentTimer = (notification: INotification) => {
        const currentTimerIndex = timersArray.current.findIndex(
            (timer) => timer.id === notification.id
        )
        return timersArray.current[currentTimerIndex]
    }

    const pauseTimer = (notification: INotification) => {
        const currentTimer = getCurrentTimer(notification)
        if (currentTimer) {
            currentTimer.remaining =
                currentTimer.remaining - (Date.now() - currentTimer.start)
            window.clearTimeout(currentTimer.timeoutId)
        }
    }
    const resumeTimer = (notification: INotification) => {
        const currentTimer = getCurrentTimer(notification)
        if (currentTimer) {
            currentTimer.start = Date.now()
            currentTimer.timeoutId = window.setTimeout(
                () => timerCallback(notification),
                currentTimer.remaining
            )
        }
    }

    return (
        <>
            <MessageContext.Provider value={{ remove, show }}>
                {children}
            </MessageContext.Provider>
            <TransitionGroup
                appear
                options={{ position: "top right" }}
                component={Container}
            >
                {notifications.length > 0 &&
                    notifications.map((notification) => (
                        <Transition key={notification.id}>
                            <Notification
                                {...(!!notification.timeout
                                    ? {
                                          onMouseEnter: () => pauseTimer(notification),
                                          onMouseLeave: () => resumeTimer(notification),
                                      }
                                    : {})}
                                onClose={notification.close}
                                title={notification.message.title}
                                type={notification.message.status || "info"}
                                content={notification.message.text}
                                {...(!!notification.message.actionBtn
                                    ? {
                                          action: {
                                              label: notification.message.actionBtn.label,
                                              onClick:
                                                  notification.message.actionBtn.action,
                                          },
                                      }
                                    : {})}
                                className={classes.notification}
                            />
                        </Transition>
                    ))}
            </TransitionGroup>
        </>
    )
}

export default MessageManagerProvider

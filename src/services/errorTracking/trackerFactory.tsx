/* eslint-disable unicorn/filename-case */
import { TrackerMethods, TrackerPermission, UserData } from "./types"

type ErrorTrackerFactory = (
    ExtensionFactory: TrackerMethods,
    permissions?: TrackerPermission[]
) => TrackerMethods

export const ErrorTrackerFactory: ErrorTrackerFactory = (extension, permissions = []) => {
    let ENABLED = false

    const safelyInvoke = <T extends () => any>(
        function_: T,
        permission?: TrackerPermission
    ): ReturnType<T> => {
        const hasPermission =
            permission !== undefined ? permissions.includes(permission) : true

        if (ENABLED && hasPermission) {
            try {
                return function_()
            } catch (error) {
                throw new Error(`Tracking Extension Error: ${error}`)
            }
        }
    }

    const init: TrackerMethods["init"] = () => {
        if (!ENABLED) {
            ENABLED = extension.init()
        }

        return ENABLED
    }

    const setUserData: TrackerMethods["setUserData"] = (userData: UserData) =>
        safelyInvoke(() => extension.setUserData(userData), TrackerPermission.USER_DATA)

    const captureException: TrackerMethods["captureException"] = (e: Error) =>
        safelyInvoke(() => extension.captureException(e))

    return {
        captureException,
        init,
        setUserData,
    }
}

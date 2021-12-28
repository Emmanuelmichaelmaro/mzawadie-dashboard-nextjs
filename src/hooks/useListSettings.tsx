// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AppListViewSettings, defaultListSettings, ListSettings, ListViews } from "@mzawadie/core";
import { useEffect } from "react";

import useLocalStorage from "./useLocalStorage";

export interface UseListSettings<TColumns extends string = string> {
    settings: ListSettings<TColumns>;
    updateListSettings: <T extends keyof ListSettings<TColumns>>(
        key: T,
        value: ListSettings<TColumns>[T]
    ) => void;
}
export default function useListSettings<TColumns extends string = string>(
    listName: ListViews
): UseListSettings<TColumns> {
    const [settings, setListSettings] = useLocalStorage<AppListViewSettings>(
        "listConfig",
        defaultListSettings
    );

    useEffect(() => {
        if (settings[listName] === undefined) {
            setListSettings((settings) => ({
                ...settings,
                [listName]: defaultListSettings[listName],
            }));
        }
    }, [listName, setListSettings, settings]);

    const updateListSettings = <T extends keyof ListSettings>(key: T, value: ListSettings[T]) =>
        setListSettings((settings) => ({
            ...settings,
            [listName]: {
                ...settings[listName],
                [key]: value,
            },
        }));

    return {
        settings: settings[listName] as ListSettings<TColumns>,
        updateListSettings,
    };
}

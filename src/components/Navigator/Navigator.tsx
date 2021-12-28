// @ts-nocheck
import { Fade, Modal, Paper } from "@material-ui/core";
import { APP_VERSION } from "@mzawadie/core";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";
import cmp from "semver-compare";

import NavigatorInput from "./NavigatorInput";
import NavigatorSection from "./NavigatorSection";
import {
    getActions,
    getCatalog,
    getCustomers,
    getViews,
    hasActions,
    hasCatalog,
    hasCustomers,
    hasViews,
} from "./modes/utils";
import { QuickSearchAction } from "./types";
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+k, command+k";
const navigatorNotificationStorageKey = "notifiedAboutNavigator";

function getItemOffset(actions: QuickSearchAction[], cbs: Array<typeof getViews>): number {
    return cbs.reduce((acc, cb) => cb(actions).length + acc, 0);
}

const useStyles = makeStyles(
    (theme) => ({
        modal: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing(3),
        },
        paper: {
            overflow: "hidden",
        },
        root: {
            [theme.breakpoints.down("sm")]: {
                height: "auto",
            },
            height: 500,
            maxWidth: 600,
            outline: 0,
            width: "100%",
        },
    }),
    {
        name: "Navigator",
    }
);

export interface NavigatorProps {
    visible: boolean;
    setVisibility: (state: boolean) => void;
}

const Navigator: React.FC<NavigatorProps> = ({ visible, setVisibility }: any) => {
    const classes = useStyles({});
    const theme = useTheme();
    const input = React.useRef(null);
    const [query, mode, change, actions] = useQuickSearch(visible, input);
    const intl = useIntl();
    const notify = useNotifier();
    const [notifiedAboutNavigator, setNotifiedAboutNavigator] = useLocalStorage(
        navigatorNotificationStorageKey,
        false
    );

    React.useEffect(() => {
        hotkeys(navigatorHotkey, (event) => {
            event.preventDefault();
            setVisibility(!visible);
        });

        if (cmp(APP_VERSION, "2.1.0") !== 1 && !notifiedAboutNavigator) {
            notify({
                autoHide: null,
                text: intl.formatMessage(
                    {
                        defaultMessage:
                            "Our new feature to help you with your daily tasks. Run Navigator using {keyboardShortcut} shortcut.",
                        id: "EM+30g",
                        description: "navigator notification",
                    },
                    {
                        keyboardShortcut:
                            navigator.platform.toLowerCase().indexOf("mac") >= 0 ? "⌘+K" : "Ctrl+K",
                    }
                ),
                title: intl.formatMessage({
                    defaultMessage: "Navigator is here to help",
                    id: "Gxm7Qx",
                    description: "navigator notification title",
                }),
            });
            setNotifiedAboutNavigator(true);
        }

        return () => hotkeys.unbind(navigatorHotkey);
    }, [intl, notifiedAboutNavigator, notify, setNotifiedAboutNavigator, setVisibility, visible]);

    return (
        <Modal className={classes.modal} open={visible} onClose={() => setVisibility(false)}>
            <Fade appear in={visible} timeout={theme.transitions.duration.short}>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Downshift
                            itemToString={(item: QuickSearchAction) => (item ? item.label : "")}
                            onSelect={(item: QuickSearchAction) => {
                                const shouldRemainVisible = item.onClick();
                                if (!shouldRemainVisible) {
                                    setVisibility(false);
                                }
                            }}
                            onInputValueChange={(value: any) =>
                                change({
                                    target: {
                                        name: "query",
                                        value,
                                    },
                                })
                            }
                            defaultHighlightedIndex={0}
                        >
                            {({ getInputProps, getItemProps, highlightedIndex }: any) => (
                                <div>
                                    <NavigatorInput
                                        mode={mode}
                                        value={query}
                                        {...getInputProps({
                                            value: query,
                                        })}
                                        ref={input}
                                    />

                                    {hasViews(actions) && (
                                        <NavigatorSection
                                            label={intl.formatMessage({
                                                defaultMessage: "Navigate to",
                                                id: "YYkkhx",
                                                description: "navigator section header",
                                            })}
                                            getItemProps={getItemProps}
                                            highlightedIndex={highlightedIndex}
                                            items={getViews(actions)}
                                            offset={0}
                                        />
                                    )}

                                    {hasActions(actions) && (
                                        <NavigatorSection
                                            label={intl.formatMessage({
                                                defaultMessage: "Quick Actions",
                                                id: "me585h",
                                                description: "navigator section header",
                                            })}
                                            getItemProps={getItemProps}
                                            highlightedIndex={highlightedIndex}
                                            items={getActions(actions)}
                                            offset={getItemOffset(actions, [getViews])}
                                        />
                                    )}

                                    {hasCustomers(actions) && (
                                        <NavigatorSection
                                            label={intl.formatMessage({
                                                defaultMessage: "Search in Customers",
                                                id: "4gT3eD",
                                                description: "navigator section header",
                                            })}
                                            getItemProps={getItemProps}
                                            highlightedIndex={highlightedIndex}
                                            items={getCustomers(actions)}
                                            offset={getItemOffset(actions, [getViews, getActions])}
                                        />
                                    )}

                                    {hasCatalog(actions) && (
                                        <NavigatorSection
                                            label={intl.formatMessage({
                                                defaultMessage: "Search in Catalog",
                                                id: "7Oorx5",
                                                description: "navigator section header",
                                            })}
                                            getItemProps={getItemProps}
                                            highlightedIndex={highlightedIndex}
                                            items={getCatalog(actions)}
                                            offset={0}
                                        />
                                    )}
                                </div>
                            )}
                        </Downshift>
                    </Paper>
                </div>
            </Fade>
        </Modal>
    );
};

export default Navigator;

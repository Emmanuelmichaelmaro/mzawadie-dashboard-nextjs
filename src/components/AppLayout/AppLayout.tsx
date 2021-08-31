import { LinearProgress, useMediaQuery } from "@material-ui/core"
import {
    makeStyles,
    SaleorTheme,
    Sidebar,
    SidebarDrawer,
    useBacklink,
    useSavebar,
    useTheme,
} from "@saleor/macaw-ui"
import classNames from "classnames"
import { useRouter } from "next/router"
import React from "react"
import { useIntl } from "react-intl"

import useAppState from "../../hooks/useAppState"
import useNavigator from "../../hooks/useNavigator"
import useUser from "../../hooks/useUser"
import { isDarkTheme } from "../../misc"
import { staffMemberDetailsUrl } from "../../staff/urls"
import Container from "../Container"
import ErrorPage from "../ErrorPage"
import Navigator from "../Navigator"
import NavigatorButton from "../NavigatorButton/NavigatorButton"
import UserChip from "../UserChip"
import { appLoaderHeight } from "./consts"
import createMenuStructure from "./menuStructure"
import { isMenuActive } from "./utils"

const useStyles = makeStyles(
    (theme) => ({
        appAction: {
            [theme.breakpoints.down("sm")]: {
                left: 0,
                width: "100%",
            },
            bottom: 0,
            gridColumn: 2,
            position: "sticky",
            zIndex: 10,
        },
        appActionDocked: {
            position: "static",
        },
        appLoader: {
            height: appLoaderHeight,
            marginBottom: theme.spacing(4),
            zIndex: 1201,
        },
        appLoaderPlaceholder: {
            height: appLoaderHeight,
            marginBottom: theme.spacing(4),
        },

        content: {
            flex: 1,
        },
        darkThemeSwitch: {
            [theme.breakpoints.down("sm")]: {
                marginRight: theme.spacing(1),
            },
            marginRight: theme.spacing(2),
        },
        header: {
            display: "grid",
            gridTemplateAreas: `"headerAnchor headerToolbar"`,
            [theme.breakpoints.down("sm")]: {
                gridTemplateAreas: `"headerToolbar" "headerAnchor"`,
            },
            marginBottom: theme.spacing(3),
        },
        headerAnchor: {
            gridArea: "headerAnchor",
        },
        headerToolbar: {
            display: "flex",
            gridArea: "headerToolbar",
            height: 40,
            [theme.breakpoints.down("sm")]: {
                height: "auto",
            },
        },
        root: {
            [theme.breakpoints.up("md")]: {
                display: "flex",
            },
            width: `100%`,
        },
        spacer: {
            flex: 1,
        },
        userBar: {
            alignItems: "center",
            display: "flex",
        },

        view: {
            flex: 1,
            flexGrow: 1,
            marginLeft: 0,
            paddingBottom: theme.spacing(),
            [theme.breakpoints.up("sm")]: {
                paddingBottom: theme.spacing(3),
            },
        },
        viewContainer: {
            minHeight: `calc(100vh + ${appLoaderHeight + 70}px - ${theme.spacing(2)})`,
        },
    }),
    {
        name: "AppLayout",
    }
)

interface AppLayoutProperties {
    children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProperties> = ({ children }: any) => {
    const { logout, user } = useUser()
    const intl = useIntl()
    const router = useRouter()
    const navigate = useNavigator()
    const classes = useStyles({})

    const { anchor: appActionAnchor, docked } = useSavebar()
    const appHeaderAnchor = useBacklink()

    const [appState, dispatchAppState] = useAppState()

    const { themeType, setTheme } = useTheme()
    const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark")

    const menuStructure = createMenuStructure(intl, user!)

    const activeMenu = menuStructure.find((menuItem) =>
        isMenuActive(router.asPath, menuItem)
    )?.id

    const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false)

    const isMdUp = useMediaQuery((theme: SaleorTheme) => theme.breakpoints.up("md"))

    const handleErrorBack = () => {
        navigate("/")
        dispatchAppState({
            payload: {
                error: undefined,
            },
            type: "displayError",
        })
    }

    return (
        <>
            <Navigator
                visible={isNavigatorVisible}
                setVisibility={setNavigatorVisibility}
            />

            <div className={classes.root}>
                {isMdUp && (
                    <Sidebar
                        active={activeMenu!}
                        menuItems={menuStructure}
                        onMenuItemClick={navigate}
                    />
                )}

                <div className={classes.content}>
                    {appState.loading ? (
                        <LinearProgress className={classes.appLoader} color="primary" />
                    ) : (
                        <div className={classes.appLoaderPlaceholder} />
                    )}

                    <div className={classes.viewContainer}>
                        <div>
                            <Container>
                                <div className={classes.header}>
                                    <div
                                        className={classes.headerAnchor}
                                        ref={appHeaderAnchor}
                                    />

                                    <div className={classes.headerToolbar}>
                                        {!isMdUp && (
                                            <SidebarDrawer
                                                menuItems={menuStructure}
                                                onMenuItemClick={navigate}
                                            />
                                        )}

                                        <div className={classes.spacer} />

                                        <div className={classes.userBar}>
                                            <NavigatorButton
                                                isMac={navigator.platform
                                                    .toLowerCase()
                                                    .includes("mac")}
                                                onClick={() =>
                                                    setNavigatorVisibility(true)
                                                }
                                            />

                                            {/* {isPickerActive && (
                                                <AppChannelSelect
                                                    channels={availableChannels}
                                                    selectedChannelId={channel.id}
                                                    onChannelSelect={setChannel}
                                                />
                                            )} */}

                                            <UserChip
                                                isDarkThemeEnabled={isDarkTheme(
                                                    themeType
                                                )}
                                                user={user!}
                                                onLogout={logout}
                                                onProfileClick={() =>
                                                    navigate(
                                                        staffMemberDetailsUrl(user!.id)
                                                    )
                                                }
                                                onThemeToggle={toggleTheme}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>

                        <main className={classes.view}>
                            {appState.error
                                ? appState.error.type === "unhandled" && (
                                      <ErrorPage
                                          id={appState.error.id}
                                          onBack={handleErrorBack}
                                      />
                                  )
                                : children}
                        </main>
                    </div>

                    <div
                        className={classNames(classes.appAction, {
                            [classes.appActionDocked]: docked,
                        })}
                        ref={appActionAnchor}
                    />
                </div>
            </div>
        </>
    )
}

export default AppLayout

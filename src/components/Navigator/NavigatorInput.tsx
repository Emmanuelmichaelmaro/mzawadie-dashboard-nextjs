import { makeStyles } from "@saleor/macaw-ui"
import React from "react"
import { useIntl } from "react-intl"

import { QuickSearchMode } from "./types"

const useStyles = makeStyles(
    (theme) => {
        const typography = {
            color: theme.palette.text.primary,
            fontSize: 24,
            lineHeight: 1.33,
        }

        return {
            adornment: {
                ...typography,
                color: theme.palette.text.secondary,
                paddingRight: theme.spacing(1),
            },
            input: {
                ...typography,
                background: "transparent",
                border: "none",
                outline: 0,
                padding: 0,
                width: "100%",
            },
            root: {
                background: theme.palette.background.default,
                display: "flex",
                padding: theme.spacing(2, 3),
            },
        }
    },
    {
        name: "NavigatorInput",
    }
)

interface NavigatorInputProperties extends React.InputHTMLAttributes<HTMLInputElement> {
    mode: QuickSearchMode
}

const NavigatorInput = React.forwardRef<HTMLInputElement, NavigatorInputProperties>(
    (properties, reference) => {
        const { mode, ...rest } = properties
        const classes = useStyles(properties)
        const intl = useIntl()

        return (
            <div className={classes.root}>
                {mode !== "default" && (
                    <span className={classes.adornment}>
                        {mode === "orders"
                            ? "#"
                            : mode === "customers"
                            ? "@"
                            : mode === "catalog"
                            ? "$"
                            : mode === "help"
                            ? "?"
                            : ">"}
                    </span>
                )}
                <input
                    autoFocus
                    autoComplete="off"
                    className={classes.input}
                    placeholder={
                        mode === "orders"
                            ? intl.formatMessage({
                                  defaultMessage: "Order Number",
                                  description: "navigator placeholder",
                              })
                            : mode === "commands"
                            ? intl.formatMessage({
                                  defaultMessage: "Type Command",
                                  id: "NqxvFh",
                                  description: "navigator placeholder",
                              })
                            : mode === "catalog"
                            ? intl.formatMessage({
                                  defaultMessage: "Search in Catalog",
                                  id: "AOI4LW",
                                  description: "navigator placeholder",
                              })
                            : mode === "customers"
                            ? intl.formatMessage({
                                  defaultMessage: "Search Customer",
                                  id: "TpPx7V",
                                  description: "navigator placeholder",
                              })
                            : mode === "default"
                            ? intl.formatMessage(
                                  {
                                      defaultMessage:
                                          "Type {key} to see available actions",
                                      id: "BooQvo",
                                      description: "navigator placeholder",
                                  },
                                  {
                                      key: "'?'",
                                  }
                              )
                            : undefined
                    }
                    ref={reference}
                    {...rest}
                />
            </div>
        )
    }
)

NavigatorInput.displayName = "NavigatorInput"

export default NavigatorInput

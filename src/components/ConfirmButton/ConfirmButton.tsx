import Button, { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { DEFAULT_NOTIFICATION_SHOW_TIME, buttonMessages } from "@mzawadie/core";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

export type ConfirmButtonTransitionState = "loading" | "success" | "error" | "default";

const styles = (theme: Theme) =>
    createStyles({
        error: {
            "&:hover": {
                backgroundColor: theme.palette.error.main,
            },
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        icon: {
            marginLeft: "0 !important",
            position: "absolute",
            transitionDuration: `${theme.transitions.duration.standard}ms`,
        },
        invisible: {
            opacity: 0,
        },
        label: {
            alignItems: "center",
            display: "flex",
            transitionDuration: `${theme.transitions.duration.standard}ms`,
        },
        progress: {
            "& svg": {
                color: theme.palette.common.white,
                margin: 0,
            },
            position: "absolute",
            transitionDuration: `${theme.transitions.duration.standard}ms`,
        },
        success: {
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
            },
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    });

export interface ConfirmButtonProperties
    extends Omit<ButtonProps, "classes">,
        WithStyles<typeof styles> {
    transitionState: ConfirmButtonTransitionState;
    onTransitionToDefault?: () => void;
}

interface ConfirmButtonState {
    displayCompletedActionState: boolean;
}

const ConfirmButton = withStyles(styles, { name: "ConfirmButton" })(
    class ConfirmButtonComponent extends React.Component<
        ConfirmButtonProperties &
            WithStyles<"error" | "icon" | "invisible" | "label" | "progress" | "success">,
        ConfirmButtonState
    > {
        // eslint-disable-next-line react/state-in-constructor
        state: ConfirmButtonState = {
            displayCompletedActionState: false,
        };

        timeout: null | ReturnType<typeof setTimeout> = null;

        static getDerivedStateFromProps(
            nextProperties: ConfirmButtonProperties,
            previousState: ConfirmButtonState
        ): ConfirmButtonState {
            if (nextProperties.transitionState === "loading") {
                return {
                    displayCompletedActionState: true,
                };
            }
            return previousState;
        }

        componentDidUpdate(previousProperties: ConfirmButtonProperties) {
            const { transitionState, onTransitionToDefault } = this.props;

            if (previousProperties.transitionState !== transitionState) {
                if (
                    (["error", "success"] as ConfirmButtonTransitionState[]).includes(transitionState)
                ) {
                    this.timeout = setTimeout(() => {
                        this.setState({
                            displayCompletedActionState: false,
                        });
                        if (onTransitionToDefault) {
                            onTransitionToDefault();
                        }
                    }, DEFAULT_NOTIFICATION_SHOW_TIME);
                } else if (transitionState === "loading") {
                    // @ts-ignore
                    clearTimeout(this.timeout);
                }
            }
        }

        componentWillUnmount() {
            // @ts-ignore
            clearTimeout(this.timeout);
        }

        render() {
            const {
                children,
                classes,
                className,
                disabled,
                transitionState,
                onClick,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                onTransitionToDefault: _,
                ...properties
            } = this.props;

            const { displayCompletedActionState } = this.state;

            return (
                <Button
                    variant="contained"
                    onClick={transitionState === "loading" ? undefined : onClick}
                    color="primary"
                    className={classNames({
                        [classes.error]: transitionState === "error" && displayCompletedActionState,
                        [classes.success]: transitionState === "success" && displayCompletedActionState,
                        // [className]: true,
                    })}
                    disabled={!displayCompletedActionState && disabled}
                    {...properties}
                >
                    <CircularProgress
                        size={24}
                        color="inherit"
                        className={classNames({
                            [classes.progress]: true,
                            [classes.invisible]: transitionState !== "loading",
                        })}
                    />

                    <CheckIcon
                        className={classNames({
                            [classes.icon]: true,
                            [classes.invisible]: !(
                                transitionState === "success" && displayCompletedActionState
                            ),
                        })}
                    />

                    <span
                        className={classNames({
                            [classes.label]: true,
                            [classes.invisible]:
                                (transitionState === "loading" || transitionState === "success") &&
                                displayCompletedActionState,
                        })}
                    >
                        {transitionState === "error" && displayCompletedActionState ? (
                            <FormattedMessage defaultMessage="Error" id="Mi4JOd" description="button" />
                        ) : (
                            children || <FormattedMessage {...buttonMessages.confirm} />
                        )}
                    </span>
                </Button>
            );
        }
    }
);

ConfirmButton.displayName = "ConfirmButton";

export default ConfirmButton;

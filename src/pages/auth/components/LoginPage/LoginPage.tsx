// @ts-nocheck
import { CircularProgress, Divider, TextField, Typography } from "@material-ui/core";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import { commonMessages } from "@mzawadie/core";
import { AvailableExternalAuthenticationsQuery } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { UserContextError } from "@mzawadie/pages/auth/types";
import { Button, EyeIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";
import LoginForm, { LoginFormData } from "./form";
import { getErrorMessage } from "./messages";

export interface LoginCardProps {
    error?: UserContextError;
    disabled: boolean;
    loading: boolean;
    externalAuthentications?: AvailableExternalAuthenticationsQuery["shop"]["availableExternalAuthentications"];
    onExternalAuthentication: (pluginId: string) => void;
    onPasswordRecovery: () => void;
    onSubmit?: (event: LoginFormData) => SubmitPromise;
}

const LoginCard: React.FC<LoginCardProps> = (props) => {
    const {
        error,
        disabled,
        loading,
        externalAuthentications = [],
        onExternalAuthentication,
        onPasswordRecovery,
        onSubmit,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const [showPassword, setShowPassword] = React.useState(false);

    if (loading) {
        return (
            <div className={classes.loading}>
                <CircularProgress size={128} />
            </div>
        );
    }

    return (
        <LoginForm onSubmit={onSubmit}>
            {({ change: handleChange, data, submit }) => (
                <>
                    <Typography variant="h3" className={classes.header}>
                        <FormattedMessage
                            defaultMessage="Sign In"
                            id="vzgZ3U"
                            description="card header"
                        />
                    </Typography>

                    {error && (
                        <div className={classes.panel} data-test-id="login-error-message">
                            {getErrorMessage(error, intl)}
                        </div>
                    )}

                    <TextField
                        autoFocus
                        fullWidth
                        autoComplete="username"
                        label={intl.formatMessage(commonMessages.email)}
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        inputProps={{
                            "data-test-id": "email",
                        }}
                        disabled={disabled}
                    />

                    <FormSpacer />

                    <div className={classes.passwordWrapper}>
                        <TextField
                            fullWidth
                            autoComplete="password"
                            label={intl.formatMessage({
                                defaultMessage: "Password",
                                id: "5sg7KC",
                            })}
                            name="password"
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            inputProps={{
                                "data-test-id": "password",
                            }}
                            disabled={disabled}
                        />

                        {/* Not using endAdornment as it looks weird with autocomplete */}

                        <IconButton
                            className={classes.showPasswordBtn}
                            variant="secondary"
                            hoverOutline={false}
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                        >
                            <EyeIcon />
                        </IconButton>
                    </div>

                    <Typography
                        component="a"
                        className={classes.link}
                        onClick={onPasswordRecovery}
                        variant="body2"
                        data-test-id="reset-password-link"
                    >
                        <FormattedMessage
                            defaultMessage="Forgot password?"
                            id="3tbL7x"
                            description="description"
                        />
                    </Typography>

                    <div className={classes.buttonContainer}>
                        <Button
                            className={classes.loginButton}
                            disabled={disabled}
                            variant="primary"
                            onClick={submit}
                            type="submit"
                            data-test-id="submit"
                        >
                            <FormattedMessage
                                defaultMessage="Sign in"
                                id="AubJ/S"
                                description="button"
                            />
                        </Button>
                    </div>

                    {externalAuthentications.length > 0 && (
                        <>
                            <FormSpacer />
                            <Divider />
                            <FormSpacer />
                            <Typography>
                                <FormattedMessage
                                    defaultMessage="or login using"
                                    id="ENBELI"
                                    description="description"
                                />
                            </Typography>
                        </>
                    )}

                    {externalAuthentications.map((externalAuthentication) => (
                        <React.Fragment key={externalAuthentication.id}>
                            <FormSpacer />

                            <Button
                                fullWidth
                                variant="secondary"
                                onClick={() => onExternalAuthentication(externalAuthentication.id)}
                                data-test-id="external-authentication"
                                disabled={disabled}
                            >
                                {externalAuthentication.name}
                            </Button>
                        </React.Fragment>
                    ))}
                </>
            )}
        </LoginForm>
    );
};

LoginCard.displayName = "LoginCard";

export default LoginCard;

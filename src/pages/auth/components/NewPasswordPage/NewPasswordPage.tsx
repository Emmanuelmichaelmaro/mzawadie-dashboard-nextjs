// @ts-nocheck
import { TextField, Typography } from "@material-ui/core";
import { Form, FormSpacer } from "@mzawadie/components";
import { SubmitPromise } from "@mzawadie/hooks";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import { Button } from "@saleor/macaw-ui";
import { SetPasswordData } from "@saleor/sdk";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";

export interface NewPasswordPageFormData {
    password: string;
    confirmPassword: string;
}

export interface NewPasswordPageProps {
    disabled: boolean;
    errors: SetPasswordData["errors"];
    onSubmit: (data: NewPasswordPageFormData) => SubmitPromise;
}

const initialForm: NewPasswordPageFormData = {
    confirmPassword: "",
    password: "",
};

const NewPasswordPage: React.FC<NewPasswordPageProps> = (props) => {
    const { disabled, errors, onSubmit } = props;
    const classes = useStyles(props);
    const intl = useIntl();
    const error = getAccountErrorMessage(
        errors.find((err) => err.field === "password"),
        intl
    );

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change: handleChange, data, submit: handleSubmit }) => {
                const passwordError =
                    data.password !== data.confirmPassword && data.password.length > 0;

                return (
                    <>
                        <Typography variant="h3" className={classes.header}>
                            <FormattedMessage
                                defaultMessage="Set up new password"
                                id="WhKGPA"
                                description="page title"
                            />
                        </Typography>

                        {!!error && <div className={classes.panel}>{error}</div>}

                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage
                                defaultMessage="Please set up a new password for your account. Repeat your new password to make sure you will be able to remember it."
                                id="m0Dz+2"
                            />
                        </Typography>

                        <FormSpacer />

                        <TextField
                            autoFocus
                            fullWidth
                            autoComplete="none"
                            disabled={disabled}
                            label={intl.formatMessage({
                                defaultMessage: "New Password",
                                id: "Ev6SEF",
                            })}
                            name="password"
                            onChange={handleChange}
                            type="password"
                            value={data.password}
                            inputProps={{
                                "data-test-id": "password",
                            }}
                        />

                        <FormSpacer />

                        <TextField
                            fullWidth
                            error={passwordError}
                            autoComplete="none"
                            disabled={disabled}
                            label={intl.formatMessage({
                                defaultMessage: "Confirm Password",
                                id: "vfG+nh",
                            })}
                            name="confirmPassword"
                            onChange={handleChange}
                            type="password"
                            value={data.confirmPassword}
                            helperText={
                                passwordError &&
                                intl.formatMessage({
                                    defaultMessage: "Passwords do not match",
                                    id: "7Chrsf",
                                })
                            }
                            inputProps={{
                                "data-test-id": "confirm-password",
                            }}
                        />

                        <FormSpacer />

                        <Button
                            data-test="button-bar-confirm"
                            className={classes.submit}
                            disabled={(passwordError && data.password.length > 0) || disabled}
                            variant="primary"
                            onClick={handleSubmit}
                            type="submit"
                        >
                            <FormattedMessage
                                defaultMessage="Set new password"
                                id="S22jIs"
                                description="button"
                            />
                        </Button>
                    </>
                );
            }}
        </Form>
    );
};

NewPasswordPage.displayName = "NewPasswordPage";

export default NewPasswordPage;

import { Button, TextField, Typography } from "@material-ui/core";
import Form from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { commonMessages } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        errorText: {
            color: theme.palette.error.contrastText,
        },
        panel: {
            background: theme.palette.error.main,
            borderRadius: theme.spacing(),
            marginBottom: theme.spacing(3),
            padding: theme.spacing(1.5),
        },
        submit: {
            width: "100%",
        },
    }),
    {
        name: "ResetPasswordPage",
    }
);

export interface ResetPasswordPageFormData {
    email: string;
}
export interface ResetPasswordPageProps {
    disabled: boolean;
    error: string | undefined;
    onSubmit: (data: ResetPasswordPageFormData) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = (props) => {
    const { disabled, error, onSubmit } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <Form initial={{ email: "" }} onSubmit={onSubmit}>
            {({ change: handleChange, data, submit: handleSubmit }) => (
                <>
                    {!!error && (
                        <div className={classes.panel}>
                            <Typography variant="caption" className={classes.errorText}>
                                {error}
                            </Typography>
                        </div>
                    )}
                    <Typography>
                        <FormattedMessage
                            defaultMessage="Forgot your password? Don't worry, we'll reset it for you."
                            id="3ublOS"
                        />
                    </Typography>
                    <FormSpacer />
                    <TextField
                        autoFocus
                        disabled={disabled}
                        fullWidth
                        autoComplete="username"
                        label={intl.formatMessage(commonMessages.email)}
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        inputProps={{
                            "data-test": "email",
                        }}
                    />
                    <FormSpacer />
                    <Button
                        className={classes.submit}
                        color="primary"
                        disabled={disabled}
                        variant="contained"
                        onClick={handleSubmit}
                        type="submit"
                    >
                        <FormattedMessage
                            defaultMessage="Send Instructions"
                            id="PkrH7Z"
                            description="password reset, button"
                        />
                    </Button>
                </>
            )}
        </Form>
    );
};

ResetPasswordPage.displayName = "ResetPasswordPage";

export default ResetPasswordPage;

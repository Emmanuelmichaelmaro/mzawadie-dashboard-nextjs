import { Button, Typography } from "@material-ui/core";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    {
        submit: {
            width: "100%",
        },
    },
    {
        name: "ResetPasswordSuccessPage",
    }
);

export interface ResetPasswordSuccessPageFormData {
    email: string;
}
export interface ResetPasswordSuccessPageProps {
    onBack: () => void;
}

const ResetPasswordSuccessPage: React.FC<ResetPasswordSuccessPageProps> = (props) => {
    const { onBack } = props;

    const classes = useStyles(props);

    return (
        <>
            <Typography>
                <FormattedMessage
                    defaultMessage="Success! In a few minutes you’ll receive a message with instructions on how to reset your password."
                    id="2ob30/"
                />
            </Typography>
            <FormSpacer />
            <Button
                className={classes.submit}
                color="primary"
                variant="contained"
                onClick={onBack}
                type="submit"
            >
                <FormattedMessage defaultMessage="Back to login" id="2oyWT9" description="button" />
            </Button>
        </>
    );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";

export default ResetPasswordSuccessPage;

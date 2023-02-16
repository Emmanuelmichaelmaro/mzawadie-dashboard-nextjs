import { Typography } from "@material-ui/core";
import { FormSpacer } from "@mzawadie/components";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import useStyles from "../styles";

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
            <Typography variant="h3" className={classes.header}>
                <FormattedMessage defaultMessage="Reset password" id="Yy/yDL" />
            </Typography>

            <Typography>
                <FormattedMessage
                    defaultMessage="Success! In a few minutes you’ll receive a message with instructions on how to reset your password."
                    id="2ob30/"
                />
            </Typography>

            <FormSpacer />

            <Button className={classes.submit} variant="primary" onClick={onBack} type="submit">
                <FormattedMessage defaultMessage="Back to login" id="2oyWT9" description="button" />
            </Button>
        </>
    );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";

export default ResetPasswordSuccessPage;

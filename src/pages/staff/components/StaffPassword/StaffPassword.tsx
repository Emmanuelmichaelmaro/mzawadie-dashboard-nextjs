import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordProps {
    onChangePassword: () => void;
}

const StaffPassword: React.FC<StaffPasswordProps> = ({ onChangePassword }) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Password",
                    id: "ZhDQel",
                    description: "header",
                })}
                toolbar={
                    <Button color="primary" onClick={onChangePassword}>
                        <FormattedMessage
                            defaultMessage="Change your password"
                            id="N3Zot1"
                            description="button"
                        />
                    </Button>
                }
            />
            <CardContent>
                <Typography>
                    <FormattedMessage
                        defaultMessage="You should change your password every month to avoid security issues."
                        id="mm0CXe"
                    />
                </Typography>
            </CardContent>
        </Card>
    );
};

StaffPassword.displayName = "StaffPassword";

export default StaffPassword;
